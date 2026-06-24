import { dbService } from '../config/db.js';
import { College, Branch, Cutoff } from '../data/mockDatabase.js';

export interface PredictionResult {
  college: College;
  branch: Branch;
  year: number;
  round: number;
  category: string;
  cutoffRank: number;
  userRank: number;
  chance: 'High' | 'Medium' | 'Low';
  probability: number; // percentage 0-100
}

export const predictionEngine = {
  predict: async (params: {
    rank: number;
    category: string;
    branchCode?: string;
    collegeCode?: string;
    year?: number;
    round?: number;
    gender?: 'All' | 'Female';
  }): Promise<PredictionResult[]> => {
    const rank = params.rank;
    const category = params.category || 'GM';
    const branchCode = params.branchCode && params.branchCode !== 'ALL' ? params.branchCode : undefined;
    const collegeCode = params.collegeCode && params.collegeCode !== 'ALL' ? params.collegeCode : undefined;
    const year = params.year ? Number(params.year) : 2025; // Default to most recent year for core prediction
    const round = params.round ? Number(params.round) : 2; // Default to final round for conservative prediction

    // Query cutoffs
    const query: any = { year, round, category };
    if (branchCode) query.branchCode = branchCode;
    if (collegeCode) query.collegeCode = collegeCode;

    const cutoffs = await dbService.getCutoffs(query);
    const colleges = await dbService.getColleges();
    const branches = await dbService.getBranches();

    const collegeMap = new Map<string, College>();
    colleges.forEach(c => collegeMap.set(c.code, c));

    const branchMap = new Map<string, Branch>();
    branches.forEach(b => branchMap.set(b.code, b));

    const results: PredictionResult[] = [];

    for (const cutoff of cutoffs) {
      const college = collegeMap.get(cutoff.collegeCode);
      const branch = branchMap.get(cutoff.branchCode);

      if (!college || !branch) continue;

      // Adjust for female reservation if requested
      let cutoffRank = cutoff.cutoffRank;
      if (params.gender === 'Female') {
        // Female cutoffs are usually 5-10% more relaxed (higher rank allowed)
        cutoffRank = Math.floor(cutoffRank * 1.08);
      }

      let chance: 'High' | 'Medium' | 'Low' = 'Low';
      let probability = 0;

      if (rank <= cutoffRank) {
        chance = 'High';
        // Safe rank: higher probability the lower the rank is relative to cutoff
        const safetyMargin = (cutoffRank - rank) / cutoffRank;
        probability = Math.min(99, Math.floor(85 + safetyMargin * 14));
      } else if (rank <= cutoffRank * 1.15) {
        chance = 'Medium';
        // Medium chance: rank is within 15% of cutoff
        const excessPercentage = (rank - cutoffRank) / (cutoffRank * 0.15);
        probability = Math.floor(84 - excessPercentage * 34); // 50% to 84%
      } else {
        chance = 'Low';
        const excessPercentage = (rank - cutoffRank) / cutoffRank;
        probability = Math.max(5, Math.floor(49 - Math.min(44, excessPercentage * 40))); // 5% to 49%
      }

      results.push({
        college,
        branch,
        year,
        round,
        category,
        cutoffRank,
        userRank: rank,
        chance,
        probability
      });
    }

    // Sort by:
    // 1. Chance Priority: High > Medium > Low
    // 2. College Ranking (Best ranking colleges first)
    // 3. Probability (highest first)
    return results.sort((a, b) => {
      const chanceOrder = { High: 0, Medium: 1, Low: 2 };
      if (chanceOrder[a.chance] !== chanceOrder[b.chance]) {
        return chanceOrder[a.chance] - chanceOrder[b.chance];
      }
      if (a.college.ranking !== b.college.ranking) {
        return a.college.ranking - b.college.ranking;
      }
      return b.probability - a.probability;
    });
  }
};
