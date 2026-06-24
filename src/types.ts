export interface College {
  code: string;
  name: string;
  location: string;
  type: 'Government' | 'Aided' | 'Private';
  fee: number;
  ranking: number;
  website: string;
  intake: number;
}

export interface Branch {
  code: string;
  name: string;
  duration: number;
  intake: number;
}

export interface Category {
  code: string;
  name: string;
  multiplier: number;
}

export interface PredictionResult {
  college: College;
  branch: Branch;
  year: number;
  round: number;
  category: string;
  cutoffRank: number;
  userRank: number;
  chance: 'High' | 'Medium' | 'Low';
  probability: number;
}

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
  direction: 'Up' | 'Down' | 'Stable';
  percentChange24to25: number;
  forecast2026: number;
}

export interface DashboardStats {
  totalColleges: number;
  totalBranches: number;
  totalCategories: number;
  totalIntake: number;
  averageFee: number;
  typeCounts: {
    Government: number;
    Aided: number;
    Private: number;
  };
  locationCounts: {
    [key: string]: number;
  };
}
