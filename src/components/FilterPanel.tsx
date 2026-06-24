import React from 'react';
import { Filter, Sliders, ArrowUpDown, MapPin, Landmark, Heart } from 'lucide-react';

interface FilterPanelProps {
  locations: string[];
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  
  selectedType: string;
  onTypeChange: (type: string) => void;
  
  selectedChance: string;
  onChanceChange: (chance: string) => void;
  
  sortBy: string;
  onSortByChange: (sort: string) => void;

  maxFee: number;
  onMaxFeeChange: (fee: number) => void;

  onReset: () => void;
}

export default function FilterPanel({
  locations,
  selectedLocation,
  onLocationChange,
  selectedType,
  onTypeChange,
  selectedChance,
  onChanceChange,
  sortBy,
  onSortByChange,
  maxFee,
  onMaxFeeChange,
  onReset
}: FilterPanelProps) {
  return (
    <div className="card w-full mb-6">
      <div className="card-header bg-black text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-lime" />
          <span className="font-black text-xs uppercase tracking-widest text-white">RESERVE SEAT FILTERS</span>
        </div>
        <button
          onClick={onReset}
          className="font-mono text-[9px] text-black bg-lime hover:bg-lime-dark px-2 py-0.5 border border-black font-extrabold uppercase transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="card-body bg-white p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          {/* Location Filter */}
          <div className="form-group mb-0">
            <label className="form-label flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red" />
              City/Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="form-select text-xs py-2 font-bold"
            >
              <option value="ALL">All Cities</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* College Type Filter */}
          <div className="form-group mb-0">
            <label className="form-label flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-red" />
              College Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="form-select text-xs py-2 font-bold"
            >
              <option value="ALL">All Management Types</option>
              <option value="Government">Government Only</option>
              <option value="Aided">Aided Only</option>
              <option value="Private">Private Only</option>
            </select>
          </div>

          {/* Admission Chance Filter */}
          <div className="form-group mb-0">
            <label className="form-label flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-red" />
              Admission Chance
            </label>
            <select
              value={selectedChance}
              onChange={(e) => onChanceChange(e.target.value)}
              className="form-select text-xs py-2 font-bold"
            >
              <option value="ALL">All Probability Levels</option>
              <option value="High">High Chance (&gt;85%)</option>
              <option value="Medium">Medium Chance (50%-85%)</option>
              <option value="Low">Low Chance (&lt;50%)</option>
            </select>
          </div>

          {/* Sort Criteria dropdown */}
          <div className="form-group mb-0">
            <label className="form-label flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-red" />
              Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="form-select text-xs py-2 font-bold"
            >
              <option value="rank_asc">College Ranking (Top First)</option>
              <option value="prob_desc">Odds of Admission (Highest First)</option>
              <option value="fee_asc">Annual Tuition (Lowest First)</option>
              <option value="fee_desc">Annual Tuition (Highest First)</option>
              <option value="cutoff_desc">Cutoff Rank (Strict First)</option>
            </select>
          </div>

          {/* Max Fee filter slider */}
          <div className="form-group mb-0">
            <label className="form-label flex items-center justify-between">
              <span>Max Annual Fee</span>
              <span className="font-black text-black">
                ₹{maxFee >= 120000 ? 'Any' : maxFee.toLocaleString('en-IN')}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="35000"
                max="120000"
                step="5000"
                value={maxFee}
                onChange={(e) => onMaxFeeChange(Number(e.target.value))}
                className="w-full accent-black cursor-pointer h-2 bg-light-gray rounded-lg appearance-none border-2 border-black"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
