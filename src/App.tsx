import React, { useState, useEffect } from 'react';
import { apiService } from './services/api.js';
import { College, Branch, Category } from './types.js';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Predictor from './pages/Predictor.js';
import Colleges from './pages/Colleges.js';
import Trends from './pages/Trends.js';
import About from './pages/About.js';
import Login from './pages/Login.js';
import { Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<{ email: string; name: string; picture?: string } | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Page bridging states
  const [preselectedCollegeCode, setPreselectedCollegeCode] = useState<string | null>(null);
  const [preselectedBranchCode, setPreselectedBranchCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialDataAndSession() {
      try {
        setLoading(true);
        setError('');
        
        // Restore user session first
        const storedUser = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');
        if (storedUser && token) {
          try {
            setUser(JSON.parse(storedUser));
            // Quietly verify token against backend
            const profile = await apiService.getMe();
            if (profile.success) {
              setUser(profile.user);
              localStorage.setItem('auth_user', JSON.stringify(profile.user));
            } else {
              handleLogoutQuietly();
            }
          } catch (e) {
            console.warn('Silent session check failed or server is offline. Falling back to local storage cache.', e);
          }
        }

        const [colList, branchList, catList] = await Promise.all([
          apiService.getColleges(),
          apiService.getBranches(),
          apiService.getCategories()
        ]);

        setColleges(colList);
        setBranches(branchList);
        setCategories(catList);
      } catch (err: any) {
        console.error('Failed to load initial directory parameters:', err);
        setError(
          'Could not connect to the KCET Predictor database. Please check your network and try again.'
        );
      } finally {
        setLoading(false);
      }
    }
    loadInitialDataAndSession();
  }, []);

  const handleLoginSuccess = (token: string, loggedUser: { email: string; name: string; picture?: string }) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      console.error('Logout failed', e);
    }
    handleLogoutQuietly();
  };

  const handleLogoutQuietly = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setCurrentPage('home');
  };

  const handleViewTrendsFromPredictor = (collegeCode: string, branchCode: string) => {
    setPreselectedCollegeCode(collegeCode);
    setPreselectedBranchCode(branchCode);
    setCurrentPage('trends');
  };

  const handleClearPreselected = () => {
    setPreselectedCollegeCode(null);
    setPreselectedBranchCode(null);
  };

  const handleRetryLoad = () => {
    window.location.reload();
  };

  // Screen routing rendering matching current page state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={(page) => setCurrentPage(page)} />;
      case 'predictor':
        return (
          <Predictor
            colleges={colleges}
            branches={branches}
            categories={categories}
            onViewTrends={handleViewTrendsFromPredictor}
          />
        );
      case 'colleges':
        return <Colleges />;
      case 'trends':
        return (
          <Trends
            colleges={colleges}
            branches={branches}
            categories={categories}
            preselectedCollegeCode={preselectedCollegeCode}
            preselectedBranchCode={preselectedBranchCode}
            onClearPreselected={handleClearPreselected}
          />
        );
      case 'about':
        return <About />;
      case 'login':
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentPage('home')}
          />
        );
      default:
        return <Home onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex flex-col items-center justify-center p-6 text-center">
        <div className="border-4 border-black p-8 bg-white brutalist-shadow max-w-sm space-y-4">
          <div className="w-12 h-12 border-4 border-black border-t-lime rounded-full animate-spin mx-auto" />
          <h2 className="font-black text-lg uppercase tracking-tight text-black">
            Initializing KCET Database
          </h2>
          <p className="text-xs font-bold text-gray uppercase">
            Loading colleges, seat pools, and previous cutoffs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9f9f7] flex flex-col items-center justify-center p-6 text-center">
        <div className="border-4 border-black p-8 bg-red-50 brutalist-shadow max-w-md space-y-4">
          <AlertTriangle className="w-12 h-12 text-red mx-auto" />
          <h2 className="font-black text-xl uppercase tracking-tight text-black">
            Database Sync Failure
          </h2>
          <p className="text-xs font-bold text-dark-gray uppercase leading-relaxed">
            {error}
          </p>
          <button
            onClick={handleRetryLoad}
            className="find-btn text-xs py-2.5 px-6 font-black uppercase flex items-center gap-1.5 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f7] text-black">
      
      {/* Top Header Navigation */}
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} user={user} onLogout={handleLogout} />

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {renderPage()}

        {/* Status Bar */}
        <div className="status-bar">
          <div>Engine: Brutalist-V3 / MongoDB-Cluster-0</div>
          <div>Total Seats Analyzed: 45,290 • Last Updated: Live</div>
        </div>
      </main>

      {/* Standard Clean Footer */}
      <footer className="bg-white border-t-4 border-black py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="font-black uppercase tracking-wider text-xs text-black">
            KEA Karnataka Common Entrance Test Seat Planner © 2026
          </p>
          <p className="text-[10px] text-gray uppercase font-bold">
            Predictive estimations are for structural educational evaluation only. Always refer to official KEA notifications.
          </p>
        </div>
      </footer>

    </div>
  );
}
