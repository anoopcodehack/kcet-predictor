import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, ExternalLink, Plus, MapPin, Landmark, Award, BookOpen, Layers } from 'lucide-react';
import { apiService } from '../services/api.js';
import { College } from '../types.js';

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // New College Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<'Government' | 'Aided' | 'Private'>('Private');
  const [newFee, setNewFee] = useState('96574');
  const [newRanking, setNewRanking] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newIntake, setNewIntake] = useState('600');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const loadColleges = async () => {
    try {
      const data = await apiService.getColleges();
      setColleges(data);
    } catch (err) {
      console.error('Error fetching colleges directory:', err);
      setError('Failed to fetch colleges directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newCode || !newName || !newLocation || !newRanking || !newWebsite) {
      setFormError('Please fill out all college details.');
      return;
    }

    try {
      await apiService.addCollege({
        code: newCode.toUpperCase().trim(),
        name: newName.trim(),
        location: newLocation.trim(),
        type: newType,
        fee: Number(newFee),
        ranking: Number(newRanking),
        website: newWebsite.trim(),
        intake: Number(newIntake)
      });

      setFormSuccess(`College ${newCode} successfully registered!`);
      // Reset
      setNewCode('');
      setNewName('');
      setNewLocation('');
      setNewRanking('');
      setNewWebsite('');
      
      // Reload colleges
      await loadColleges();
    } catch (err: any) {
      setFormError(err.message || 'Failed to register the college profile.');
    }
  };

  // Filter and search logic
  const filteredColleges = colleges.filter((col) => {
    const matchesSearch = 
      col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'ALL' || col.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="page-header border-b-4 border-black pb-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl md:text-3xl font-black uppercase text-black flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-red" />
            Karnataka Participating Colleges
          </h1>
          <p className="page-sub text-gray text-xs font-black uppercase tracking-wider mt-1">
            Browse and query engineering profiles, locations, rankings, and annual state-governed fees.
          </p>
        </div>
        
        {/* Admin Addition Toggle */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 self-start md:self-auto bg-black text-white px-4 py-2.5 border-2 border-black font-extrabold text-xs uppercase brutalist-shadow hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-lime" />
          {showAddForm ? 'Close Registration Form' : 'Register New College'}
        </button>
      </div>

      {/* Admin registration form */}
      {showAddForm && (
        <div className="card w-full border-dashed border-4">
          <div className="card-header bg-black text-white px-4 py-3 flex justify-between items-center">
            <span className="font-black text-xs uppercase tracking-widest text-lime">COLLEGE REGISTRATION PORTAL (ADMIN)</span>
            <span className="text-[10px] font-mono text-gray font-bold">MONGODB SECURE API</span>
          </div>
          <div className="card-body bg-white p-6">
            <form onSubmit={handleAddCollege} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="form-group">
                  <label className="form-label">KEA College Code</label>
                  <input
                    type="text"
                    placeholder="e.g. E005"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="form-input text-xs font-bold py-2"
                    required
                  />
                </div>

                <div className="form-group col-span-1 sm:col-span-2">
                  <label className="form-label">Institution Name</label>
                  <input
                    type="text"
                    placeholder="e.g. RV College of Engineering"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="form-input text-xs font-bold py-2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City/Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="form-input text-xs font-bold py-2"
                    required
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="form-group">
                  <label className="form-label">Management Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'Government' | 'Aided' | 'Private')}
                    className="form-select text-xs py-2 font-bold"
                  >
                    <option value="Government">Government</option>
                    <option value="Aided">Aided</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Fee (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 96574"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    className="form-input text-xs font-bold py-2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State NIRF/KEA Rank</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={newRanking}
                    onChange={(e) => setNewRanking(e.target.value)}
                    className="form-input text-xs font-bold py-2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Student Intake</label>
                  <input
                    type="number"
                    placeholder="e.g. 1060"
                    value={newIntake}
                    onChange={(e) => setNewIntake(e.target.value)}
                    className="form-input text-xs font-bold py-2"
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label className="form-label">Official Portal Website (URL)</label>
                <input
                  type="url"
                  placeholder="e.g. https://rvce.edu.in"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  className="form-input text-xs font-bold py-2"
                  required
                />
              </div>

              {formError && (
                <div className="text-red font-black text-xs bg-red-50 border-2 border-red px-3 py-2">
                  ❌ Form Error: {formError}
                </div>
              )}

              {formSuccess && (
                <div className="text-success font-black text-xs bg-emerald-50 border-2 border-success px-3 py-2">
                  ✅ Success: {formSuccess}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="find-btn py-2 px-6 text-xs font-black uppercase"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Query Filter Options */}
      <div className="card">
        <div className="card-body bg-white p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by college name, code (e.g. E005), or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-sm font-bold pl-10"
              />
              <Search className="w-5 h-5 text-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Management filter */}
            <div className="w-full md:w-64">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-select text-sm font-bold"
              >
                <option value="ALL">All College Types</option>
                <option value="Government">Government Colleges Only</option>
                <option value="Aided">Aided Colleges Only</option>
                <option value="Private">Private Colleges Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Directory listing cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white border-3 border-black brutalist-shadow p-6 space-y-4">
              <div className="h-4 bg-gray/20 w-1/4 rounded" />
              <div className="h-8 bg-gray/20 w-3/4 rounded" />
              <div className="h-10 bg-gray/20 w-full rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border-3 border-black bg-red-50 text-red font-black">
          {error}
        </div>
      ) : filteredColleges.length === 0 ? (
        <div className="border-3 border-dashed border-black p-10 bg-white text-center brutalist-shadow-sm">
          <Layers className="w-10 h-10 text-gray mx-auto mb-3" />
          <h3 className="font-black text-base text-black uppercase">No colleges match your query criteria</h3>
          <p className="text-xs text-gray font-bold mt-1">
            Try adjusting your search keywords or clearing management filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((col) => (
            <div 
              key={col.code}
              className="card flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:box-shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="card-header bg-black text-white px-4 py-2.5 flex justify-between items-center">
                <span className="font-mono text-[10px] font-extrabold text-lime uppercase">
                  CODE: {col.code}
                </span>
                <span className="bg-red text-white text-[9px] font-black uppercase px-1.5 py-0.5 border border-black rotate-1">
                  STATE RANK #{col.ranking}
                </span>
              </div>

              <div className="card-body bg-white p-5 space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <h3 className="font-black text-base text-black leading-tight uppercase">
                    {col.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-light-gray border border-black px-2 py-0.5 uppercase">
                      <MapPin className="w-3 h-3" />
                      {col.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-lime/25 border border-lime-dark px-2 py-0.5 uppercase">
                      <Landmark className="w-3 h-3" />
                      {col.type}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-black/10 grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-[8px] uppercase font-bold text-gray tracking-wider block">
                      KEA Fee Rate
                    </span>
                    <span className="font-black text-sm text-black">
                      ₹{col.fee.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase font-bold text-gray tracking-wider block">
                      Total Seat Pool
                    </span>
                    <span className="font-black text-sm text-black">
                      {col.intake} SEATS
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={col.website}
                    target="_blank"
                    rel="noreferrer referrer"
                    className="w-full flex items-center justify-center gap-1.5 bg-black text-white py-2 border-2 border-black text-xs font-black uppercase brutalist-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0 transition-all text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-lime" />
                    Visit Official Site
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
