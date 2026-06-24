import React from 'react';
import { ExternalLink, TrendingUp, Landmark, MapPin, Award, DollarSign, Users } from 'lucide-react';
import { PredictionResult } from '../types.js';

interface CollegeCardProps {
  key?: string;
  prediction: PredictionResult;
  onViewTrends: (collegeCode: string, branchCode: string) => void;
}

export default function CollegeCard({ prediction, onViewTrends }: CollegeCardProps) {
  const { college, branch, cutoffRank, userRank, chance, probability, year, round, category } = prediction;

  // Visual treatments based on admission probability
  const chanceColors = {
    High: {
      bg: 'bg-emerald-50 text-emerald-800 border-success',
      badge: 'bg-success text-white',
      bar: 'bg-success'
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-800 border-lime-dark',
      badge: 'bg-lime text-black',
      bar: 'bg-lime-dark'
    },
    Low: {
      bg: 'bg-red-50 text-red-800 border-red',
      badge: 'bg-red text-white',
      bar: 'bg-red'
    }
  };

  const style = chanceColors[chance];

  return (
    <div className="card w-full hover:-translate-x-1 hover:-translate-y-1 hover:box-shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
      {/* Top Banner indicating chance */}
      <div className={`border-b-3 border-black px-4 py-2 flex items-center justify-between font-black text-xs uppercase tracking-wider ${style.bg}`}>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase font-bold tracking-normal bg-black text-white px-1.5 py-0.5 border border-black mr-2">
            CODE: {college.code}
          </span>
          <span>{chance} CHANCE OF ADMISSION</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 border-2 border-black font-extrabold text-[10px] ${style.badge}`}>
            {probability}% PROBABILITY
          </span>
        </div>
      </div>

      <div className="card-body bg-white p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          <div className="space-y-2 flex-1">
            {/* College Name & Website */}
            <div className="flex items-start gap-1.5 flex-wrap">
              <h3 className="font-black text-lg text-black leading-tight tracking-tight uppercase">
                {college.name}
              </h3>
              <a
                href={college.website}
                target="_blank"
                rel="noreferrer referrer"
                className="inline-flex items-center text-gray hover:text-black p-1 transition-colors"
                title="Visit College Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Sub-meta metrics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-black" />
                {college.location}, KA
              </span>
              <span className="flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-black" />
                {college.type} Management
              </span>
              <span className="flex items-center gap-1 text-black bg-lime/20 border border-lime px-1 rounded-sm">
                <Award className="w-3.5 h-3.5" />
                State Rank #{college.ranking}
              </span>
            </div>
          </div>

          {/* Fee Tag */}
          <div className="bg-black text-white px-3 py-1.5 border-2 border-black brutalist-shadow-sm flex flex-col items-center justify-center text-center self-start md:self-auto shrink-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray">Annual Fee</span>
            <span className="font-black text-sm text-lime">
              ₹{college.fee.toLocaleString('en-IN')}
            </span>
          </div>

        </div>

        {/* Selected Engineering Stream Indicator */}
        <div className="my-4 p-3 bg-light-gray border-2 border-black">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="font-mono text-[9px] font-black uppercase text-gray tracking-wider block">
                Selected Stream
              </span>
              <span className="font-black text-sm text-black uppercase">
                {branch.name} ({branch.code})
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[9px] font-black uppercase text-gray tracking-wider block">
                Intake Capacity
              </span>
              <span className="font-black text-sm text-black">
                {branch.intake} SEATS
              </span>
            </div>
          </div>
        </div>

        {/* Cutoff Stats Comparison */}
        <div className="grid grid-cols-2 gap-4 my-4 p-3 border-2 border-dashed border-black">
          <div>
            <span className="font-bold text-[10px] uppercase text-gray tracking-wider block">
              Historical Cutoff ({year} R{round} {category})
            </span>
            <span className="font-black text-base text-black">
              {cutoffRank.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-bold text-[10px] uppercase text-gray tracking-wider block">
              Your Rank
            </span>
            <span className="font-black text-base text-red">
              {userRank.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Probability Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-dark-gray">
            <span>Admission Odds Indicator</span>
            <span>{probability}% Safe</span>
          </div>
          <div className="w-full bg-light-gray h-3.5 border-2 border-black p-0.5">
            <div 
              className={`h-full border border-black ${style.bar} transition-all duration-500`}
              style={{ width: `${probability}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={() => onViewTrends(college.code, branch.code)}
            className="flex items-center justify-center gap-2 bg-white text-black font-extrabold text-xs uppercase px-4 py-2.5 border-2 border-black brutalist-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutalist-shadow active:translate-x-0 active:translate-y-0 active:brutalist-shadow-sm transition-all"
          >
            <TrendingUp className="w-4 h-4 text-red" />
            <span>View Cutoff Trends</span>
          </button>
          
          <a
            href={college.website}
            target="_blank"
            rel="noreferrer referrer"
            className="flex items-center justify-center gap-2 bg-black text-white font-extrabold text-xs uppercase px-4 py-2.5 border-2 border-black brutalist-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutalist-shadow active:translate-x-0 active:translate-y-0 active:brutalist-shadow-sm transition-all text-center"
          >
            <ExternalLink className="w-4 h-4 text-lime" />
            <span>Visit College Portal</span>
          </a>
        </div>

      </div>
    </div>
  );
}
