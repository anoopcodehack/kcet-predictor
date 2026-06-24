import React, { useEffect, useState } from 'react';
import { Sparkles, Landmark, GraduationCap, Users, ShieldAlert, FileText, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api.js';
import { DashboardStats } from '../types.js';
import StatsCard from '../components/StatsCard.js';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Neo-Brutalist Hero Jumbotron */}
      <div className="border-4 border-black p-6 md:p-10 bg-lime brutalist-shadow text-black relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-black opacity-5 rotate-12 pointer-events-none" />
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-block bg-black text-lime font-black text-[10px] tracking-widest px-3 py-1 border-2 border-black rotate-[-1deg]">
            KCET SESSION 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none uppercase">
            NAVIGATE KARNATAKA ENGINEERING ADMISSIONS WITH 100% CONFIDENCE
          </h1>
          <p className="text-sm md:text-base font-extrabold text-black/80 max-w-2xl leading-relaxed">
            Stop guessing your seat options. Input your KCET rank to predict and match computer science, electronics, and mechanical engineering allocations across premier government and private engineering institutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => onNavigate('predictor')}
              className="flex items-center justify-center gap-2 bg-black text-white font-black text-sm uppercase px-6 py-3.5 border-3 border-black brutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:bg-dark-gray transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-lime" />
              <span>Launch Rank Predictor</span>
            </button>
            <button
              onClick={() => onNavigate('trends')}
              className="flex items-center justify-center gap-2 bg-white text-black font-black text-sm uppercase px-6 py-3.5 border-3 border-black brutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:bg-light-gray transition-all cursor-pointer"
            >
              <span>Explore Cutoff Trends</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-black mb-4">
          State Counseling Roster Metrics
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 border-3 border-black bg-white brutalist-shadow-sm p-4 space-y-3">
                <div className="h-3 bg-gray/30 w-1/3 rounded" />
                <div className="h-6 bg-gray/30 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 border-3 border-black bg-red-50 text-red font-black text-sm">
            {error}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Participating Colleges"
                value={stats.totalColleges}
                sub="Engineering Institutes cataloged"
                icon={Landmark}
                color="white"
              />
              <StatsCard
                title="Available Specializations"
                value={stats.totalBranches}
                sub="Computer, AI, IS, ECE streams"
                icon={GraduationCap}
                color="lime"
              />
              <StatsCard
                title="Annual Intake Capacity"
                value={`${stats.totalIntake.toLocaleString()} seats`}
                sub="Allocated government & quota seats"
                icon={Users}
                color="white"
              />
              <StatsCard
                title="Average KCET Fee Rate"
                value={`₹${stats.averageFee.toLocaleString('en-IN')}`}
                sub="Governed by state fee limits"
                icon={BookOpen}
                color="gray"
              />
            </div>
          )
        )}
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Quick Option Entry Guidance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header bg-black text-white px-4 py-3 flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-widest text-white">OPTION ENTRY STRATEGIES & CHECKLISTS</span>
              <BookOpen className="w-4 h-4 text-lime" />
            </div>
            <div className="card-body space-y-5 p-6 bg-white">
              <p className="text-xs font-bold text-gray uppercase tracking-wider">
                Crucial tips to secure your best seat during the 2026 option-entry dashboard portal:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 p-3 border-2 border-black bg-amber-50">
                  <ShieldAlert className="w-6 h-6 text-red shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-black uppercase">
                      Rule of Priority Ordering
                    </h4>
                    <p className="text-xs text-dark-gray font-bold mt-1 leading-normal">
                      The KEA portal allocates from Option #1 downwards. Never place a lower-preferred college higher in your list simply because you have a lower rank. Always list your absolute dream choices first!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-3 border-2 border-black bg-emerald-50">
                  <FileText className="w-6 h-6 text-success shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-black uppercase">
                      Understand Seat Category Multipliers
                    </h4>
                    <p className="text-xs text-dark-gray font-bold mt-1 leading-normal">
                      If you hold a Kannada Medium (K) or Rural (R) reservation certificate, your threshold is substantially relaxed. For SC/ST and Category 2A/2B/3A/3B candidates, cutoff ranks can be 1.5x to 4x higher than General Merit (GM). Check predicted results with specific filters.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-3 border-2 border-black bg-light-gray">
                  <AlertCircle className="w-6 h-6 text-black shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-black uppercase">
                      Round 2 Extended Caution
                    </h4>
                    <p className="text-xs text-dark-gray font-bold mt-1 leading-normal">
                      Round 2 cutoffs represent a much safer baseline for rank planning. Round 2 Extended (Casual) has minimal seats and is highly volatile. Build your plan based on Round 2 predictions!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Geographical distributions */}
        <div className="space-y-6">
          <div className="card h-full">
            <div className="card-header bg-black text-white px-4 py-3 flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-widest text-white">DISTRIBUTION BY CITY</span>
              <span className="font-mono text-[9px] text-lime">KARNATAKA</span>
            </div>
            <div className="card-body bg-white p-5 space-y-4">
              <p className="text-xs font-bold text-gray uppercase tracking-wider">
                Concentration of participating premier colleges in state hubs:
              </p>
              
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-light-gray border border-black" />)}
                </div>
              ) : (
                stats && (
                  <div className="space-y-3">
                    {Object.entries(stats.locationCounts).map(([city, count]) => (
                      <div 
                        key={city}
                        className="flex justify-between items-center p-2.5 border-2 border-black bg-white hover:bg-light-gray transition-colors"
                      >
                        <span className="font-extrabold text-sm uppercase">{city} Hub</span>
                        <span className="bg-lime text-black border border-black text-xs font-black px-2 py-0.5">
                          {count} INSTITUTES
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}

              <div className="border-2 border-dashed border-black p-4 text-center mt-4">
                <h4 className="font-extrabold text-xs text-black uppercase mb-1">
                  Ready to test your credentials?
                </h4>
                <p className="text-[11px] font-bold text-gray mb-3">
                  Input your 2026 score details and immediately see your chances.
                </p>
                <button
                  onClick={() => onNavigate('predictor')}
                  className="w-full py-2 bg-lime text-black border-2 border-black font-black uppercase text-xs hover:bg-lime-dark transition-all brutalist-shadow-sm active:translate-x-[1px] active:translate-y-[1px] active:brutalist-shadow-none"
                >
                  Predict Seat Allocation
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
