import React, { useState, useEffect } from 'react';
import { Sparkles, LayoutGrid, Table, FileSpreadsheet, RefreshCw, Layers, Printer } from 'lucide-react';
import { apiService } from '../services/api.js';
import { College, Branch, Category, PredictionResult } from '../types.js';
import RankForm from '../components/RankForm.js';
import FilterPanel from '../components/FilterPanel.js';
import CollegeCard from '../components/CollegeCard.js';
import PredictionTable from '../components/PredictionTable.js';
import PrintReportView from '../components/PrintReportView.js';

interface PredictorProps {
  colleges: College[];
  branches: Branch[];
  categories: Category[];
  onViewTrends: (collegeCode: string, branchCode: string) => void;
  initialRankState?: number | null;
}

export default function Predictor({ colleges, branches, categories, onViewTrends, initialRankState }: PredictorProps) {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  
  // Search parameters for tracking
  const [lastSearchRank, setLastSearchRank] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState<{
    rank: number;
    category: string;
    branchCode: string;
    collegeCode: string;
    round: number;
    gender: 'All' | 'Female';
  } | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Client-side Filtering & Sorting States
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedChance, setSelectedChance] = useState('ALL');
  const [sortBy, setSortBy] = useState('rank_asc');
  const [maxFee, setMaxFee] = useState(120000);

  // Layout View: 'cards' or 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Extract unique locations from colleges for filter options
  const locations = Array.from(new Set(colleges.map((c) => c.location))).sort();

  // Handle Predict Trigger
  const handlePredict = async (params: {
    rank: number;
    category: string;
    branchCode: string;
    collegeCode: string;
    round: number;
    gender: 'All' | 'Female';
  }) => {
    setIsSearching(true);
    setHasSearched(false);
    setError('');
    
    try {
      // Save search parameters to localStorage to seamlessly persist state across tabs
      localStorage.setItem('last_kcet_search', JSON.stringify(params));

      const results = await apiService.predict({
        rank: params.rank,
        category: params.category,
        branchCode: params.branchCode,
        collegeCode: params.collegeCode,
        round: params.round,
        gender: params.gender
      });

      setPredictions(results);
      setLastSearchRank(params.rank);
      setSearchParams(params);
      setHasSearched(true);
    } catch (err: any) {
      console.error('Prediction calculation error:', err);
      setError(err.message || 'An error occurred while compiling seat matching.');
    } finally {
      setIsSearching(false);
    }
  };

  // Restore search from localStorage on mount for seamless new tab loading
  useEffect(() => {
    const stored = localStorage.getItem('last_kcet_search');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.rank) {
          handlePredict(parsed);
        }
      } catch (e) {
        console.warn('Failed to auto-restore last search', e);
      }
    }
  }, []);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedLocation('ALL');
    setSelectedType('ALL');
    setSelectedChance('ALL');
    setSortBy('rank_asc');
    setMaxFee(120000);
  };

  // Apply Client-Side Filters & Sorting
  const filteredPredictions = predictions.filter((pred) => {
    // 1. Location check
    if (selectedLocation !== 'ALL' && pred.college.location !== selectedLocation) {
      return false;
    }

    // 2. Management Type check
    if (selectedType !== 'ALL' && pred.college.type !== selectedType) {
      return false;
    }

    // 3. Chance check
    if (selectedChance !== 'ALL' && pred.chance !== selectedChance) {
      return false;
    }

    // 4. Max Fee check
    if (pred.college.fee > maxFee) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Apply sorting rules
    switch (sortBy) {
      case 'rank_asc':
        return a.college.ranking - b.college.ranking; // Top ranked college first
      case 'prob_desc':
        return b.probability - a.probability; // Safest/Highest odds first
      case 'fee_asc':
        return a.college.fee - b.college.fee; // Cheapest first
      case 'fee_desc':
        return b.college.fee - a.college.fee; // Most expensive first
      case 'cutoff_desc':
        return a.cutoffRank - b.cutoffRank; // Hardest cutoff (lowest rank number) first
      default:
        return 0;
    }
  });

  if (showPrintPreview) {
    return (
      <PrintReportView
        predictions={filteredPredictions}
        searchParams={searchParams}
        onClose={() => setShowPrintPreview(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title Header */}
      <div className="page-header border-b-4 border-black pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red" />
            KCET Predictor <span className="text-red">2026</span>
          </h1>
          <p className="page-sub">
            Real-time seat allotment probability based on 2023-2025 cutoffs
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="tag bg-white">Database: v2.4.1</div>
          <div className="tag bg-white">Nodes: Active</div>
        </div>
      </div>

      {/* Main Form input block */}
      <RankForm
        colleges={colleges}
        branches={branches}
        categories={categories}
        onSubmit={handlePredict}
        isSearching={isSearching}
      />

      {error && (
        <div className="bg-red-50 text-red border-3 border-black p-4 brutalist-shadow-sm font-extrabold text-sm uppercase">
          🚨 Search Error: {error}
        </div>
      )}

      {/* Predictions Outcome Sections */}
      {hasSearched && (
        <div className="space-y-6">
          
          {/* Status banner */}
          <div className="bg-white border-3 border-black p-4 brutalist-shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-gray block">
                SEARCH RUN COMPLETED
              </span>
              <h2 className="font-black text-lg text-black uppercase leading-tight">
                Found {predictions.length} matching seats for Rank {lastSearchRank?.toLocaleString()}!
              </h2>
              <p className="text-xs text-gray font-bold mt-1">
                Narrow down these allocations using the filters below or export your selections.
              </p>
            </div>
            
            {/* View toggles & PDF Report */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setShowPrintPreview(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-lime hover:bg-lime-dark text-black border-2 border-black font-black uppercase text-xs brutalist-shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-4.5 h-4.5" />
                <span>Print PDF Report</span>
              </button>

              <div className="flex border-2 border-black divide-x-2 divide-black self-stretch sm:self-auto shrink-0">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 sm:flex-initial flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs uppercase ${
                    viewMode === 'cards' ? 'bg-black text-white' : 'bg-white text-black hover:bg-light-gray'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 sm:flex-initial flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs uppercase ${
                    viewMode === 'table' ? 'bg-black text-white' : 'bg-white text-black hover:bg-light-gray'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  Grid Table
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedChance={selectedChance}
            onChanceChange={setSelectedChance}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            maxFee={maxFee}
            onMaxFeeChange={setMaxFee}
            onReset={handleResetFilters}
          />

          {/* Dynamic Filter outcome size */}
          <div className="flex justify-between items-center bg-black text-white px-4 py-2.5 border-2 border-black">
            <span className="font-extrabold text-xs uppercase tracking-wider text-lime">
              Showing {filteredPredictions.length} out of {predictions.length} predictions
            </span>
            <span className="font-mono text-[9px] text-gray">
              Filter Active: {selectedLocation !== 'ALL' || selectedType !== 'ALL' || selectedChance !== 'ALL' || maxFee < 120000 ? 'YES' : 'NO'}
            </span>
          </div>

          {/* Core Results container */}
          {filteredPredictions.length === 0 ? (
            <div className="border-3 border-dashed border-black p-10 bg-white text-center brutalist-shadow-sm">
              <Layers className="w-10 h-10 text-gray mx-auto mb-3" />
              <h3 className="font-black text-base text-black uppercase">No matching seats match your filter parameters</h3>
              <p className="text-xs text-gray font-bold mt-1">
                Try widening your "Max Annual Fee", adding "All Cities" or changing the "Admission Chance" to include Medium or Low.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-lime text-black border-2 border-black text-xs font-black uppercase brutalist-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPredictions.map((pred) => (
                <CollegeCard
                  key={`${pred.college.code}-${pred.branch.code}`}
                  prediction={pred}
                  onViewTrends={onViewTrends}
                />
              ))}
            </div>
          ) : (
            <PredictionTable
              predictions={filteredPredictions}
              onViewTrends={onViewTrends}
            />
          )}

        </div>
      )}

    </div>
  );
}
