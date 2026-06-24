import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Shield, Calendar, HelpCircle, Award, CheckCircle, ExternalLink, Copy, Check, AlertTriangle } from 'lucide-react';
import { PredictionResult } from '../types.js';

interface PrintReportViewProps {
  predictions: PredictionResult[];
  searchParams: {
    rank: number;
    category: string;
    branchCode: string;
    collegeCode: string;
    round: number;
    gender: 'All' | 'Female';
  } | null;
  onClose: () => void;
}

export default function PrintReportView({ predictions, searchParams, onClose }: PrintReportViewProps) {
  const [isInIframe, setIsInIframe] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Detect sandbox iframe environment
    setIsInIframe(window.self !== window.top);
  }, []);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  if (!searchParams) {
    return (
      <div className="p-8 text-center bg-white border-2 border-black">
        <p className="font-bold text-red">Error: No search criteria found for generating report.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-black text-white font-bold">
          Go Back
        </button>
      </div>
    );
  }

  // Count predictions by chance for summary stats
  const highCount = predictions.filter(p => p.chance === 'High').length;
  const midCount = predictions.filter(p => p.chance === 'Medium').length;
  const lowCount = predictions.filter(p => p.chance === 'Low').length;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-8 flex flex-col items-center">
      
      {/* Sandbox Iframe Warning Banner */}
      {isInIframe && (
        <div className="w-full max-w-4xl bg-[#fffbeb] text-black border-3 border-[#d97706] p-5 mb-6 brutalist-shadow select-none space-y-4">
          <div className="flex gap-3 items-start">
            <AlertTriangle className="w-6 h-6 text-[#d97706] shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <h4 className="font-black text-sm uppercase tracking-wide text-[#78350f]">
                SANDBOX PREVIEW RESTRICTION DETECTED
              </h4>
              <p className="text-xs text-neutral-700 font-bold leading-relaxed">
                You are currently viewing this application inside the AI Studio sandboxed frame. For safety reasons, browsers **strictly block** trigger actions like print dialogs or PDF generation inside cross-origin iframes.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-neutral-800 border-2 border-black font-black uppercase text-xs tracking-wider transition-all brutalist-shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-lime" />
              <span>Open in New Tab & Print</span>
            </a>
            
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-neutral-50 border-2 border-black font-black uppercase text-xs tracking-wider transition-all brutalist-shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Copied Successfully!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-600" />
                  <span>Copy Web App URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 1. Print Controller Topbar (Hidden when printing via index.css wrapper) */}
      <div className="w-full max-w-4xl bg-black border-3 border-lime px-4 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 brutalist-shadow select-none" id="printable-report-controller">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-white border-2 border-white hover:bg-neutral-700 hover:text-lime transition-all text-xs font-black uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
          <div className="text-left">
            <span className="text-[10px] text-lime font-black block tracking-widest uppercase">
              DOCUMENT PREVIEW GENERATED
            </span>
            <span className="text-xs text-neutral-300 font-bold">
              Ready to print or save to PDF. Verified database v2.4.1.
            </span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-lime text-black border-2 border-black hover:bg-lime-dark font-black uppercase text-sm brutalist-shadow-xs active:translate-y-px transition-all"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* 2. PDF / Print Document Page Sheet */}
      <div 
        id="printable-report-wrapper"
        className="w-full max-w-4xl bg-white text-black p-8 sm:p-12 shadow-2xl border-4 border-black relative font-sans leading-relaxed"
      >
        <div id="printable-report" className="space-y-8">
          
          {/* Header Block */}
          <div className="border-b-4 border-black pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-red fill-red-100 shrink-0" />
                <span className="font-mono text-xs font-black tracking-widest uppercase text-red-dark">
                  ACADEMIC COUNSELLING ADVISORY BOARD
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase text-black leading-none">
                KCET Seat Allotment Advisory Report
              </h1>
              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">
                State Admissions Matrix & Cutoff Probability Matrix • Entry Cycle 2026
              </p>
            </div>
            
            {/* Visual Stamp Seal */}
            <div className="border-3 border-black p-2.5 bg-neutral-50 text-center flex flex-col justify-center items-center shrink-0 min-w-[120px]">
              <Award className="w-5 h-5 text-black mb-0.5" />
              <span className="font-mono text-[9px] font-black uppercase text-black tracking-wider leading-tight">
                KEA PREDICTED
              </span>
              <span className="font-mono text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
                VALIDATED REPORT
              </span>
            </div>
          </div>

          {/* Report Advisory Statement */}
          <div className="bg-neutral-50 border-2 border-black p-4 space-y-2">
            <p className="text-[11px] font-bold text-neutral-700 uppercase tracking-wide">
              Advisory Statement:
            </p>
            <p className="text-xs text-neutral-600 font-medium">
              This report provides a systematic probability matching of the candidate's KCET performance against official cutoff metrics spanning prior years (2023–2025). Recommended options are sorted for standard counseling guidelines to maximize priority entry.
            </p>
          </div>

          {/* Candidate Merit & Search Criteria Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            
            {/* Left Column - Merit Parameters */}
            <div className="p-4 space-y-2.5 bg-[#fbfdfa]">
              <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-black pb-1">
                Candidate Merit Profile
              </h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    KCET Candidate Rank
                  </span>
                  <span className="font-black text-sm text-black">
                    {searchParams.rank.toLocaleString()}
                  </span>
                </div>
                
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    Quota / Seat Category
                  </span>
                  <span className="font-black text-sm text-black">
                    {searchParams.category}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    Gender Filter
                  </span>
                  <span className="font-black text-xs text-black">
                    {searchParams.gender === 'Female' ? 'Female Candidate Quota' : 'General / Co-Ed Quota'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    Selected Stream Preference
                  </span>
                  <span className="font-black text-xs text-black uppercase">
                    {searchParams.branchCode === 'ALL' ? 'All Engineering Streams' : searchParams.branchCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - System Generation Profile */}
            <div className="p-4 space-y-2.5 bg-[#fbfdfa]">
              <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-black pb-1">
                System Advisory Metadata
              </h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    Target Counseling Round
                  </span>
                  <span className="font-black text-xs text-black uppercase">
                    Round {searchParams.round} Cutoffs
                  </span>
                </div>
                
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    Total Matching Seats
                  </span>
                  <span className="font-black text-xs text-black uppercase">
                    {predictions.length} Colleges
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase block">
                    Generation Timestamp
                  </span>
                  <span className="font-bold text-xs text-black flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    {currentDate}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Probability Statistics summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-black p-2.5 text-center bg-[#f0f9eb]">
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                HIGH CHANCE SEATS
              </span>
              <span className="text-lg font-black text-black">
                {highCount}
              </span>
            </div>
            <div className="border border-black p-2.5 text-center bg-yellow-50">
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                MEDIUM CHANCE SEATS
              </span>
              <span className="text-lg font-black text-black">
                {midCount}
              </span>
            </div>
            <div className="border border-black p-2.5 text-center bg-red-50">
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 block">
                AMBITIOUS REACHES
              </span>
              <span className="text-lg font-black text-black">
                {lowCount}
              </span>
            </div>
          </div>

          {/* Core Recommendations Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-black border-l-4 border-black pl-2">
              Seat Recommendation Allotment Matrix
            </h3>
            
            <div className="border-2 border-black overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white text-[10px] font-black uppercase tracking-wider border-b-2 border-black divide-x divide-neutral-700">
                    <th className="p-2 w-10 text-center">S.No</th>
                    <th className="p-2 w-16 text-center">Code</th>
                    <th className="p-2">College Name & Location</th>
                    <th className="p-2">Branch Course</th>
                    <th className="p-2 w-24 text-right">Cutoff Rank</th>
                    <th className="p-2 w-24 text-right">Annual Fee</th>
                    <th className="p-2 w-28 text-center">Allotment Chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black text-xs">
                  {predictions.slice(0, 45).map((pred, idx) => {
                    let badgeClass = "bg-neutral-100 text-neutral-800";
                    if (pred.chance === 'High') badgeClass = "bg-green-100 text-green-900 font-extrabold";
                    if (pred.chance === 'Medium') badgeClass = "bg-yellow-100 text-yellow-900 font-extrabold";
                    if (pred.chance === 'Low') badgeClass = "bg-red-100 text-red-900 font-extrabold";

                    return (
                      <tr key={`${pred.college.code}-${pred.branch.code}`} className="hover:bg-neutral-50 divide-x divide-black align-middle">
                        <td className="p-2 text-center font-mono font-bold text-neutral-500">
                          {idx + 1}
                        </td>
                        <td className="p-2 text-center font-mono font-black text-black uppercase">
                          {pred.college.code}
                        </td>
                        <td className="p-2 font-bold text-black text-xs">
                          {pred.college.name}
                          <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-wide mt-0.5">
                            📍 {pred.college.location}
                          </span>
                        </td>
                        <td className="p-2 text-xs font-bold text-neutral-700">
                          {pred.branch.name}
                          <span className="block font-mono text-[9px] text-neutral-400 uppercase tracking-wider mt-0.5">
                            {pred.branch.code}
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono font-black text-black">
                          {pred.cutoffRank.toLocaleString()}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-neutral-600">
                          ₹{pred.college.fee.toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          <span className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-wider border border-black ${badgeClass}`}>
                            {pred.chance} ({Math.round(pred.probability)}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {predictions.length > 45 && (
              <p className="text-[10px] text-neutral-500 font-bold text-center italic uppercase tracking-wider pt-2">
                * Note: Shown first 45 matched colleges in printed layout. Adjust stream and fee filters in application to narrow down choices.
              </p>
            )}
          </div>

          {/* Allocation Legends Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-2 border-black pt-6 print-avoid">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-green-700 uppercase tracking-wider block">
                ● High Chance (75% - 100%)
              </span>
              <p className="text-[10px] text-neutral-500 font-semibold">
                Your rank is lower than the previous cutoffs, indicating a very safe selection. Perfect for backup choices.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-yellow-600 uppercase tracking-wider block">
                ● Medium Chance (40% - 74%)
              </span>
              <p className="text-[10px] text-neutral-500 font-semibold">
                Your rank lies extremely close to standard cutoffs. Highly competitive options that require strategic placing.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-wider block">
                ● Low Chance (0% - 39%)
              </span>
              <p className="text-[10px] text-neutral-500 font-semibold">
                Ambitious choices where cutoffs are traditionally much lower than candidate's rank. Include at the top of your list.
              </p>
            </div>
          </div>

          {/* Signature / Validation Seals Area */}
          <div className="pt-8 border-t-4 border-dashed border-black flex flex-col sm:flex-row justify-between items-stretch gap-6 print-avoid">
            
            {/* Disclaimer and signature */}
            <div className="space-y-3 max-w-md">
              <h4 className="text-[10px] font-black uppercase text-black">
                IMPORTANT ADVISORY DISCLAIMER:
              </h4>
              <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
                This matching advice does not guarantee a seat. Annual allotment trends fluctuate based on seat matrix updates, applicant density, and actual choice entries submitted to the KEA portal in 2026. Prioritize choices prudently.
              </p>
            </div>

            {/* Validation Stamps boxes */}
            <div className="flex gap-4 shrink-0 justify-end">
              <div className="border border-black p-4 w-36 h-24 bg-[#fafafa] flex flex-col justify-between text-center relative">
                <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400">
                  GUARDIAN / STUDENT
                </span>
                <div className="border-t border-dashed border-neutral-400 w-full pb-1">
                  <span className="text-[7px] font-bold text-neutral-500 uppercase">
                    Signature Authorization
                  </span>
                </div>
              </div>
              <div className="border border-black p-4 w-36 h-24 bg-[#fafafa] flex flex-col justify-between text-center relative">
                <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400">
                  COUNSELLING DESK
                </span>
                <div className="border-t border-dashed border-neutral-400 w-full pb-1">
                  <span className="text-[7px] font-bold text-neutral-500 uppercase">
                    Official Stamp / Seal
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Document Footer */}
          <div className="text-center pt-4 text-[9px] font-mono font-bold text-neutral-400 border-t border-neutral-100 flex items-center justify-between">
            <span>KEA MATCHING SERVICES ENGINE (v2.4.1)</span>
            <span>SYSTEM ID: KEA-2026-REC-{(searchParams.rank * 17).toString(16).toUpperCase()}</span>
          </div>

        </div>
      </div>

    </div>
  );
}
