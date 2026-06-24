import { College, Branch, Category, PredictionResult, BranchTrend, DashboardStats } from '../types.js';

const API_BASE = '/api';

const getHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  const result: Record<string, string> = { ...headers };
  if (token) {
    result['Authorization'] = `Bearer ${token}`;
  }
  return result;
};

export const apiService = {
  getColleges: async (): Promise<College[]> => {
    const res = await fetch(`${API_BASE}/colleges`);
    if (!res.ok) throw new Error('Failed to load colleges');
    const json = await res.json();
    return json.data;
  },

  getBranches: async (): Promise<Branch[]> => {
    const res = await fetch(`${API_BASE}/branches`);
    if (!res.ok) throw new Error('Failed to load engineering branches');
    const json = await res.json();
    return json.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to load reservation categories');
    const json = await res.json();
    return json.data;
  },

  predict: async (params: {
    rank: number;
    category: string;
    branchCode?: string;
    collegeCode?: string;
    year?: number;
    round?: number;
    gender?: 'All' | 'Female';
  }): Promise<PredictionResult[]> => {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to calculate predictions');
    }
    const json = await res.json();
    return json.data;
  },

  getTrends: async (
    collegeCode: string,
    branchCode: string,
    category: string,
    round: number = 1
  ): Promise<BranchTrend> => {
    const query = new URLSearchParams({ collegeCode, branchCode, category, round: String(round) });
    const res = await fetch(`${API_BASE}/trends?${query}`);
    if (!res.ok) throw new Error('Failed to load cutoff trends');
    const json = await res.json();
    return json.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/dashboard-stats`);
    if (!res.ok) throw new Error('Failed to load database metrics');
    const json = await res.json();
    return json.data;
  },

  importCSV: async (csvText: string): Promise<{ success: boolean; message: string; count: number }> => {
    const res = await fetch(`${API_BASE}/import-csv`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ csvData: csvText }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to import CSV cutoffs');
    }
    return await res.json();
  },

  addCollege: async (college: Omit<College, 'id'>): Promise<College> => {
    const res = await fetch(`${API_BASE}/colleges`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(college),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to register college profile');
    }
    const json = await res.json();
    return json.data;
  },

  // --- Auth Services ---
  register: async (email: string, password: string, name: string): Promise<{ success: boolean; token: string; user: any }> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Registration failed');
    }
    return json;
  },

  login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: any }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Login failed');
    }
    return json;
  },

  getMe: async (): Promise<{ success: boolean; user: any }> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to check profile');
    }
    return json;
  },

  logout: async (): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await res.json();
  },

  getGoogleAuthUrl: async (): Promise<{ url: string; isSandbox: boolean }> => {
    const res = await fetch(`${API_BASE}/auth/google/url`);
    if (!res.ok) {
      throw new Error('Failed to retrieve Google Auth URL');
    }
    return await res.json();
  }
};
