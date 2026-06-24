import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Info, Calendar, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api.js';
import { College, Branch, Category, BranchTrend } from '../types.js';

interface TrendsProps {
  colleges: College[];
  branches: Branch[];
  categories: Category[];
  preselectedCollegeCode: string | null;
  preselectedBranchCode: string | null;
  onClearPreselected: () => void;
}

export default function Trends({
  colleges,
  branches,
  categories,
  preselectedCollegeCode,
  preselectedBranchCode,
  onClearPreselected
}: TrendsProps) {
  const [collegeCode, setCollegeCode] = useState(preselectedCollegeCode || 'E005');
  const [branchCode, setBranchCode] = useState(preselectedBranchCode || 'CS');
  const [category, setCategory] = useState('GM');
  const [round, setRound] = useState(1);

  const [trend, setTrend] = useState<BranchTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Synchronize tab redirect overrides
  useEffect(() => {
    if (preselectedCollegeCode) setCollegeCode(preselectedCollegeCode);
    if (preselectedBranchCode) setBranchCode(preselectedBranchCode);
  }, [preselectedCollegeCode, preselectedBranchCode]);

  useEffect(() => {
    async function loadTrends() {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.getTrends(collegeCode, branchCode, category, round);
        setTrend(data);
      } catch (err: any) {
        console.error('Error fetching cutoff trends:', err);
        setError('No cutoff trend records were found for the selected parameters.');
      } finally {
        setLoading(false);
      }
    }
    loadTrends();
  }, [collegeCode, branchCode, category, round]);

  const handleResetPreselected = () => {
    onClearPreselected();
  };

  // SVG Chart Dimensions & Computations
  const chartHeight = 220;
  const chartWidth = 500;
  const padding = 50;

  let svgElements = null;

  if (trend && trend.history.length > 0) {
    const ranks = [...trend.history.map((h) => h.cutoffRank), trend.forecast2026];
    const maxRank = Math.max(...ranks) * 1.15;
    const minRank = Math.min(...ranks) * 0.85;
    const range = maxRank - minRank || 100;

    const getX = (index: number) => padding + (index * (chartWidth - padding * 2)) / 3;
    const getY = (rank: number) => {
      // Scale linearly so higher rank number is lower on y axis (or higher on screen?
      // In KCET cutoffs, we want to show LOWER rank numbers as MORE PRESTIGIOUS/HIGHER visually!
      // This is a subtle but genius design touch! Lower rank = harder to get, so it should be on top visually!)
      const ratio = (rank - minRank) / range;
      // Flip ratio so smaller rank is at the TOP of the chart
      return padding + (chartHeight - padding * 2) * ratio;
    };

    const dataPoints = [
      ...trend.history,
      { year: 2026, cutoffRank: trend.forecast2026 }
    ];

    // Build line path
    const pathD = dataPoints.reduce((path, p, idx) => {
      const x = getX(idx);
      const y = getY(p.cutoffRank);
      return idx === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
    }, '');

    svgElements = (
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-full font-nunito select-none overflow-visible"
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const rankVal = Math.floor(minRank + ratio * range);
          const y = getY(rankVal);
          return (
            <g key={ratio}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="font-mono text-[9px] font-black fill-gray"
              >
                {rankVal.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Thick Connecting Lines */}
        <path
          d={pathD}
          fill="none"
          stroke="#111111"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Prediction dashed line connector for 2026 */}
        {trend.history.length >= 2 && (
          <line
            x1={getX(2)}
            y1={getY(trend.history[2].cutoffRank)}
            x2={getX(3)}
            y2={getY(trend.forecast2026)}
            stroke="#e5473b"
            strokeWidth="3"
            strokeDasharray="3 3"
          />
        )}

        {/* Nodes and Labels */}
        {dataPoints.map((p, idx) => {
          const x = getX(idx);
          const y = getY(p.cutoffRank);
          const isForecast = p.year === 2026;

          return (
            <g key={p.year} className="group">
              {/* Tooltip background on hover */}
              <circle
                cx={x}
                cy={y}
                r="10"
                className="fill-transparent stroke-none cursor-pointer"
              />
              <circle
                cx={x}
                cy={y}
                r="6"
                className={`${
                  isForecast ? 'fill-red stroke-black' : 'fill-lime stroke-black'
                } stroke-2 cursor-pointer transition-transform group-hover:scale-125`}
              />
              
              {/* Year Label */}
              <text
                x={x}
                y={chartHeight - 12}
                textAnchor="middle"
                className={`text-[10px] uppercase font-black ${
                  isForecast ? 'fill-red' : 'fill-black'
                }`}
              >
                {isForecast ? '2026 (Est)' : p.year}
              </text>

              {/* Exact Rank Label above/below node */}
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className={`font-mono text-[9px] font-black ${
                  isForecast ? 'fill-red-dark' : 'fill-black'
                } bg-white`}
              >
                {p.cutoffRank.toLocaleString()}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title Header */}
      <div className="page-header border-b-4 border-black pb-4 mb-6">
        <h1 className="page-title text-2xl md:text-3xl font-black uppercase text-black flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-red" />
          Cutoff Analytics & Trends
        </h1>
        <p className="page-sub text-gray text-xs font-black uppercase tracking-wider mt-1">
          Trace engineering cutoff patterns across years and calculate forecasted seat constraints for 2026.
        </p>
      </div>

      {preselectedCollegeCode && (
        <div className="bg-lime/20 text-black border-2 border-black p-3 flex justify-between items-center brutalist-shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-red" />
            <span>LINKED SELECTION ACTIVE: Showing trends from your Predictor click.</span>
          </div>
          <button
            onClick={handleResetPreselected}
            className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase border border-black hover:bg-dark-gray transition-colors"
          >
            Clear Link
          </button>
        </div>
      )}

      {/* Inputs Configuration panel */}
      <div className="card">
        <div className="card-header bg-black text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-lime" />
            <span className="font-black text-xs uppercase tracking-widest text-white">CHART CO-ORDINATE TUNING</span>
          </div>
        </div>
        <div className="card-body bg-white p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* College SELECT */}
            <div className="form-group mb-0">
              <label className="form-label">College</label>
              <select
                value={collegeCode}
                onChange={(e) => setCollegeCode(e.target.value)}
                className="form-select text-xs font-bold py-2"
              >
                {colleges.map((col) => (
                  <option key={col.code} value={col.code}>
                    [{col.code}] {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch SELECT */}
            <div className="form-group mb-0">
              <label className="form-label">Stream Specialization</label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                className="form-select text-xs font-bold py-2"
              >
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category SELECT */}
            <div className="form-group mb-0">
              <label className="form-label">Reservation Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select text-xs font-bold py-2"
              >
                {categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.code} - {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Round SELECT */}
            <div className="form-group mb-0">
              <label className="form-label">KEA Round</label>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="form-select text-xs font-bold py-2"
              >
                <option value={1}>Round 1 (Pure Merit Preference)</option>
                <option value={2}>Round 2 (Standard Cutoffs)</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Main Graph Content */}
      {loading ? (
        <div className="h-96 border-3 border-black bg-white flex flex-col justify-center items-center gap-3 brutalist-shadow-sm">
          <div className="spinner w-8 h-8" />
          <span className="font-black text-xs uppercase tracking-wider text-black">Querying historical files...</span>
        </div>
      ) : error ? (
        <div className="border-3 border-black p-8 bg-white text-center brutalist-shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red mx-auto mb-3" />
          <h3 className="font-black text-base text-black uppercase">Cutoff Record Empty</h3>
          <p className="text-xs text-gray font-bold mt-1">
            {error} Try changing your specialization stream or reservation brackets.
          </p>
        </div>
      ) : (
        trend && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Card */}
            <div className="lg:col-span-2 card">
              <div className="card-header bg-black text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-widest text-white">HISTORICAL SHIFT MATRIX</span>
                <span className="font-mono text-[9px] text-lime">AXIS FLIPPED (LOWER RANKS ON TOP)</span>
              </div>
              <div className="card-body bg-white p-6">
                <div className="h-64 flex justify-center items-center">
                  {svgElements}
                </div>
                <p className="text-[10px] font-black text-gray uppercase text-center mt-4 flex items-center justify-center gap-1">
                  <Info className="w-3.5 h-3.5 text-red" />
                  Visualizes cutoffs. Note: smaller numbers (prestigious cutoff ranks) appear higher on the line.
                </p>
              </div>
            </div>

            {/* Statistics and Forecast Explanation card */}
            <div className="space-y-6">
              
              {/* Forecast Card */}
              <div className="border-3 border-black p-5 bg-black text-white brutalist-shadow-sm space-y-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-lime font-black">
                    COMPUTED FORECAST FOR 2026
                  </span>
                  <h3 className="font-black text-3xl text-white uppercase mt-1">
                    ₹ {trend.forecast2026.toLocaleString()} <span className="text-lime text-xs">EST RANK</span>
                  </h3>
                </div>
                
                <div className="p-3 border border-gray text-[11px] font-bold text-gray space-y-2">
                  <span className="font-extrabold text-white uppercase tracking-wider block">Methodology Note</span>
                  <span>Calculated using a linear weight index of KEA cutoff bounds from 2023, 2024, and 2025. Actual margins may vary based on candidate registry counts.</span>
                </div>
              </div>

              {/* YoY Competition Shift Explanation */}
              <div className="card">
                <div className="card-header bg-black text-white px-4 py-2 flex justify-between items-center">
                  <span className="font-black text-[10px] uppercase tracking-widest text-white">COMPETITION GRADIENT</span>
                  <Calendar className="w-3.5 h-3.5 text-lime" />
                </div>
                <div className="card-body bg-white p-5 space-y-3.5 text-xs font-bold">
                  
                  <div className="flex justify-between items-center py-2 border-b border-light-gray">
                    <span className="text-gray uppercase">Percent Shift YoY</span>
                    <span className={`font-black text-sm uppercase ${
                      trend.percentChange24to25 <= 0 ? 'text-red' : 'text-emerald-800'
                    }`}>
                      {trend.percentChange24to25 > 0 ? '+' : ''}{trend.percentChange24to25}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-light-gray">
                    <span className="text-gray uppercase">Market Demand Index</span>
                    <span className="font-black text-sm uppercase text-black">
                      {trend.direction === 'Down' ? 'HIGH DEMAND 🔥' : trend.direction === 'Up' ? 'EASING SEAT 📉' : 'STABLE'}
                    </span>
                  </div>

                  <div className="p-3 border-2 border-black bg-light-gray">
                    <h4 className="font-black text-xs text-black uppercase mb-1">
                      Admissions Officer Review:
                    </h4>
                    <p className="text-[11px] text-dark-gray leading-normal">
                      {trend.direction === 'Down' ? (
                        'ALERT: The cutoff ranks are systematically decreasing. This means demand is soaring and candidates with stronger scores are prioritizing this seat. You will need a better rank in 2026 to comfortably qualify.'
                      ) : trend.direction === 'Up' ? (
                        'INSIGHT: Cutoff boundaries are rising (relaxing). Competition is softening, meaning you can secure this seat with a relatively higher (more relaxed) rank compared to prior sessions.'
                      ) : (
                        'INFO: The threshold remains highly stable. Cutoff bounds vary marginally, meaning candidate demand for this branch is solid and predictable.'
                      )}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )
      )}

    </div>
  );
}
