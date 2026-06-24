import React, { useState } from 'react';
import { Sparkles, GraduationCap, TrendingUp, HelpCircle, LayoutDashboard, Menu, X, LogIn, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user: { email: string; name: string; picture?: string } | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onPageChange, user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictor', label: 'Rank Predictor', icon: Sparkles, highlight: true },
    { id: 'colleges', label: 'College Directory', icon: GraduationCap },
    { id: 'trends', label: 'Cutoff Trends', icon: TrendingUp },
    { id: 'about', label: 'KCET Info Hub', icon: HelpCircle }
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="relative bg-white border-b-4 border-black mb-8 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 font-black text-xl tracking-tight text-black hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="bg-lime border-2 border-black p-2 brutalist-shadow-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="font-extrabold uppercase tracking-wide text-md md:text-lg">
                KCET <span className="bg-red text-white px-1.5 py-0.5 border border-black rotate-1 inline-block">PREDICTOR</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider border-2 border-black transition-all ${
                    isActive
                      ? 'bg-black text-white brutalist-shadow-sm'
                      : item.highlight
                      ? 'bg-lime text-black hover:bg-lime-dark brutalist-shadow'
                      : 'bg-white text-black hover:bg-light-gray brutalist-shadow-sm'
                  } ${isActive ? 'translate-x-[2px] translate-y-[2px]' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Desktop User Authentication Controls */}
            <div className="pl-2 border-l-2 border-black flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border-2 border-black bg-[#fbfdfa] px-3 py-1.5 brutalist-shadow-xs">
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name} 
                        className="w-5 h-5 rounded-full border border-black"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-lime border border-black flex items-center justify-center text-[9px] font-black uppercase text-black">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-black text-xs uppercase tracking-wide max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-2.5 bg-red text-white border-2 border-black brutalist-shadow-xs hover:bg-red-dark active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className={`flex items-center gap-2 px-4 py-2.5 font-black text-sm uppercase tracking-wider border-2 border-black transition-all ${
                    currentPage === 'login'
                      ? 'bg-black text-white'
                      : 'bg-[#f0f9eb] text-black hover:bg-lime brutalist-shadow-sm'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white border-2 border-black p-2.5 hover:bg-light-gray active:scale-95 transition-transform"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-white border-b-4 border-black border-t-2 border-t-black p-4 space-y-3 shadow-2xl z-40 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-extrabold text-sm uppercase tracking-widest border-2 border-black transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : item.highlight
                    ? 'bg-lime text-black hover:bg-lime-dark'
                    : 'bg-off-white text-black hover:bg-light-gray'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          {/* Mobile User Authentication Controls */}
          <div className="pt-3 border-t-2 border-dashed border-black mt-2">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 border-2 border-black bg-light-gray">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border-2 border-black"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-lime border-2 border-black flex items-center justify-center text-xs font-black uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <h5 className="font-extrabold text-xs uppercase text-black">{user.name}</h5>
                    <p className="font-mono text-[9px] text-gray uppercase tracking-wider">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 font-extrabold text-sm uppercase tracking-widest border-2 border-black bg-red text-white hover:bg-red-dark"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleNavClick('login');
                }}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 font-extrabold text-sm uppercase tracking-widest border-2 border-black bg-[#f0f9eb] text-black hover:bg-lime"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
