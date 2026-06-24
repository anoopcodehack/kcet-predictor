import React from 'react';
import { ExternalLink, TrendingUp, HelpCircle } from 'lucide-react';
import { PredictionResult } from '../types.js';

interface PredictionTableProps {
  predictions: PredictionResult[];
  onViewTrends: (collegeCode: string, branchCode: string) => void;
}

export default function PredictionTable({ predictions, onViewTrends }: PredictionTableProps) {
  if (predictions.length === 0) return null;

  return (
    <div className="card w-full overflow-hidden">
      <div className="card-header bg-black text-white px-4 py-2.5 flex items-center justify-between">
        <span className="font-black text-xs uppercase tracking-widest text-white">GRID MATRIX OVERVIEW</span>
        <span className="font-mono text-[9px] text-gray bg-dark-gray px-1.5 py-0.5 border border-black">
          {predictions.length} RESULTS
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-gray border-b-3 border-black text-[11px] font-black uppercase text-black">
              <th className="p-3 border-r-2 border-black font-mono">Rank</th>
              <th className="p-3 border-r-2 border-black">College Institution</th>
              <th className="p-3 border-r-2 border-black">Course Code</th>
              <th className="p-3 border-r-2 border-black text-right">KCET Fee</th>
              <th className="p-3 border-r-2 border-black text-right">Cutoff</th>
              <th className="p-3 border-r-2 border-black text-center">Odds</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black text-xs font-bold text-black">
            {predictions.map((row) => {
              const { college, branch, cutoffRank, userRank, chance, probability } = row;
              
              let chanceBadge = '';
              if (chance === 'High') {
                chanceBadge = 'bg-success/20 text-success border-success';
              } else if (chance === 'Medium') {
                chanceBadge = 'bg-lime/20 text-black border-lime-dark';
              } else {
                chanceBadge = 'bg-red/10 text-red border-red';
              }

              return (
                <tr key={`${college.code}-${branch.code}`} className="hover:bg-off-white/80 transition-colors">
                  {/* State Rank */}
                  <td className="p-3 border-r-2 border-black font-mono text-center">
                    #{college.ranking}
                  </td>
                  
                  {/* College Name & Type */}
                  <td className="p-3 border-r-2 border-black max-w-sm">
                    <div className="font-extrabold uppercase truncate tracking-tight" title={college.name}>
                      {college.name}
                    </div>
                    <div className="text-[10px] text-gray uppercase flex gap-2 items-center mt-0.5">
                      <span>[{college.code}]</span>
                      <span>•</span>
                      <span>{college.location}</span>
                      <span>•</span>
                      <span>{college.type}</span>
                    </div>
                  </td>
                  
                  {/* Course Code & Name */}
                  <td className="p-3 border-r-2 border-black text-center font-extrabold">
                    <span className="bg-light-gray border border-black px-1.5 py-0.5 rounded-sm" title={branch.name}>
                      {branch.code}
                    </span>
                  </td>
                  
                  {/* KCET Fee */}
                  <td className="p-3 border-r-2 border-black text-right font-mono font-bold text-emerald-800">
                    ₹{college.fee.toLocaleString('en-IN')}
                  </td>
                  
                  {/* Cutoff Rank */}
                  <td className="p-3 border-r-2 border-black text-right font-mono font-extrabold">
                    {cutoffRank.toLocaleString()}
                  </td>
                  
                  {/* Odds Indicator */}
                  <td className="p-3 border-r-2 border-black text-center">
                    <span className={`inline-block px-2 py-0.5 border-2 text-[10px] font-black uppercase ${chanceBadge}`}>
                      {probability}% {chance}
                    </span>
                  </td>
                  
                  {/* Action buttons */}
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onViewTrends(college.code, branch.code)}
                        className="bg-lime hover:bg-lime-dark border-2 border-black p-1.5 brutalist-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:brutalist-shadow-none transition-all"
                        title="View Trends Graph"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-black" />
                      </button>
                      
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noreferrer referrer"
                        className="bg-black hover:bg-dark-gray border-2 border-black p-1.5 brutalist-shadow-sm text-white active:translate-x-0.5 active:translate-y-0.5 active:brutalist-shadow-none transition-all"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-lime" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
