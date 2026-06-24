import { dbService } from '../config/db.js';

export interface TrendPoint {
  year: number;
  cutoffRank: number;
}

export interface BranchTrend {
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  category: string;
  round: number;
  history: TrendPoint[];
  direction: 'Up' | 'Down' | 'Stable'; // Up means cutoff rank went up (easier), Down means cutoff went down (harder)
  percentChange24to25: number;
  forecast2026: number;
}

export const trendEngine = {
  getTrends: async (params: {
    collegeCode: string;
    branchCode: string;
    category: string;
    round?: number;
  }): Promise<BranchTrend> => {
    const { collegeCode, branchCode, category } = params;
    const round = params.round ? Number(params.round) : 1; // Default to Round 1 for trends

    const cutoffs = await dbService.getCutoffs({
      collegeCode,
      branchCode,
      category,
      round
    });

    const colleges = await dbService.getColleges();
    const branches = await dbService.getBranches();

    const college = colleges.find(c => c.code === collegeCode);
    const branch = branches.find(b => b.code === branchCode);

    const collegeName = college ? college.name : 'Unknown College';
    const branchName = branch ? branch.name : 'Unknown Branch';

    // Map cutoffs to history points sorted by year
    const history: TrendPoint[] = cutoffs
      .map(c => ({ year: c.year, cutoffRank: c.cutoffRank }))
      .sort((a, b) => a.year - b.year);

    // Calculate YoY shifts
    let direction: 'Up' | 'Down' | 'Stable' = 'Stable';
    let percentChange24to25 = 0;
    
    const rank23 = history.find(h => h.year === 2023)?.cutoffRank;
    const rank24 = history.find(h => h.year === 2024)?.cutoffRank;
    const rank25 = history.find(h => h.year === 2025)?.cutoffRank;

    if (rank24 && rank25) {
      percentChange24to25 = ((rank25 - rank24) / rank24) * 100;
      if (percentChange24to25 > 2) {
        direction = 'Up'; // Cutoff rank is increasing (becoming easier to get in)
      } else if (percentChange24to25 < -2) {
        direction = 'Down'; // Cutoff rank is decreasing (becoming harder/more competitive)
      }
    }

    // Forecast 2026 Cutoff (simple linear regression or weighted moving average)
    let forecast2026 = 0;
    if (rank23 && rank24 && rank25) {
      // Linear extrapolation: y = mx + c
      // x values: 0 (2023), 1 (2024), 2 (2025), 3 (2026)
      // slope m1 = rank24 - rank23
      // slope m2 = rank25 - rank24
      // average slope m = (m1 + m2) / 2
      const m = ((rank24 - rank23) + (rank25 - rank24)) / 2;
      forecast2026 = Math.floor(rank25 + m);
    } else if (rank24 && rank25) {
      const m = rank25 - rank24;
      forecast2026 = Math.floor(rank25 + m);
    } else if (rank25) {
      forecast2026 = Math.floor(rank25 * 0.95); // Default factor
    }

    // Sanity boundary check
    if (forecast2026 < 10) forecast2026 = 10;
    if (forecast2026 > 180000) forecast2026 = 180000;

    return {
      collegeCode,
      collegeName,
      branchCode,
      branchName,
      category,
      round,
      history,
      direction,
      percentChange24to25: parseFloat(percentChange24to25.toFixed(2)),
      forecast2026
    };
  }
};
