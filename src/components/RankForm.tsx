import React, { useState } from 'react';
import { Search, Sparkles, Filter, Info } from 'lucide-react';
import { College, Branch, Category } from '../types.js';

interface RankFormProps {
  colleges: College[];
  branches: Branch[];
  categories: Category[];
  onSubmit: (params: {
    rank: number;
    category: string;
    branchCode: string;
    collegeCode: string;
    round: number;
    gender: 'All' | 'Female';
  }) => void;
  isSearching: boolean;
}

export default function RankForm({ colleges, branches, categories, onSubmit, isSearching }: RankFormProps) {
  const [rank, setRank] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('last_kcet_search');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.rank ? String(parsed.rank) : '';
      }
    } catch (e) {}
    return '';
  });
  const [category, setCategory] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('last_kcet_search');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.category || 'GM';
      }
    } catch (e) {}
    return 'GM';
  });
  const [branchCode, setBranchCode] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('last_kcet_search');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.branchCode || 'ALL';
      }
    } catch (e) {}
    return 'ALL';
  });
  const [collegeCode, setCollegeCode] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('last_kcet_search');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.collegeCode || 'ALL';
      }
    } catch (e) {}
    return 'ALL';
  });
  const [round, setRound] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('last_kcet_search');
      if (stored) {
        const parsed = JSON.parse(stored);
        return typeof parsed.round === 'number' ? parsed.round : 2;
      }
    } catch (e) {}
    return 2;
  });
  const [gender, setGender] = useState<'All' | 'Female'>(() => {
    try {
      const stored = localStorage.getItem('last_kcet_search');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.gender || 'All';
      }
    } catch (e) {}
    return 'All';
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedRank = parseInt(rank);
    if (!rank || isNaN(parsedRank) || parsedRank <= 0) {
      setError('Please enter a valid KCET rank greater than 0.');
      return;
    }

    if (parsedRank > 250000) {
      setError('Rank exceeds maximum KCET candidate limit (2,50,000).');
      return;
    }

    onSubmit({
      rank: parsedRank,
      category,
      branchCode,
      collegeCode,
      round,
      gender
    });
  };

  return (
    <div className="card w-full">
      <div className="card-header bg-black text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lime" />
          <span className="font-black text-xs uppercase tracking-widest text-white">ADMISSIONS CALCULATOR</span>
        </div>
        <span className="font-mono text-[10px] text-gray bg-dark-gray px-1.5 py-0.5 border border-black">V1.2.6</span>
      </div>

      <div className="card-body bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rank Input */}
            <div className="form-group">
              <label className="form-label flex items-center gap-1">
                Enter KCET Rank <span className="text-red font-black">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="form-input text-lg font-black tracking-tight"
                  min="1"
                  max="250000"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-gray font-bold">
                  RANK
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray mt-1 flex items-center gap-1">
                <Info className="w-3 h-3 text-red" />
                Enter your genuine or estimated KCET rank.
              </p>
            </div>

            {/* Category Select */}
            <div className="form-group">
              <label className="form-label">Seat Category (Quota)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select text-sm font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.code} - {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] font-bold text-gray mt-1">
                GM = General Merit, R = Rural, K = Kannada.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Gender Select */}
            <div className="form-group">
              <label className="form-label">Candidate Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'All' | 'Female')}
                className="form-select text-sm font-bold"
              >
                <option value="All">All/General (Co-Ed)</option>
                <option value="Female">Female Candidate</option>
              </select>
            </div>

            {/* Counseling Round */}
            <div className="form-group">
              <label className="form-label">Counseling Round</label>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="form-select text-sm font-bold"
              >
                <option value={1}>Round 1 Cutoffs</option>
                <option value={2}>Round 2 Cutoffs (Recommended)</option>
              </select>
            </div>

            {/* Branch Preference filter */}
            <div className="form-group">
              <label className="form-label">Branch Stream</label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                className="form-select text-sm font-bold"
              >
                <option value="ALL">Show All Engineering Streams</option>
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="form-group">
            <label className="form-label">Target College (Optional)</label>
            <select
              value={collegeCode}
              onChange={(e) => setCollegeCode(e.target.value)}
              className="form-select text-sm font-bold"
            >
              <option value="ALL">All Colleges in Karnataka Directory</option>
              {colleges.map((col) => (
                <option key={col.code} value={col.code}>
                  [{col.code}] {col.name} - ({col.location})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red border-2 border-red px-4 py-3 font-extrabold text-xs brutalist-shadow-sm flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSearching}
              className={`find-btn w-full sm:w-auto text-base py-3 px-8 flex justify-center items-center gap-3 ${
                isSearching ? 'opacity-70 cursor-not-allowed bg-gray' : ''
              }`}
            >
              {isSearching ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-t-black" />
                  <span>CALCULATING POSSIBILITIES...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-black" />
                  <span>PREDICT MY COLLEGE SEAT</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
