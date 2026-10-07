import React, { useState } from 'react';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { Category } from '../types/blog';

interface HeaderProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  activeView: 'home' | 'article' | 'about';
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  activeView,
  onNavigateHome,
  onNavigateAbout,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; cat?: Category; isAbout?: boolean }[] = [
    { label: 'Home' },
    { label: 'AI', cat: 'AI' },
    { label: 'Technology', cat: 'Technology' },
    { label: 'Gadgets', cat: 'Gadgets' },
    { label: 'Apps', cat: 'Apps' },
    { label: 'Future', cat: 'Future' },
    { label: 'About', isAbout: true },
  ];

  const handleNavClick = (link: { label: string; cat?: Category; isAbout?: boolean }) => {
    setMobileMenuOpen(false);
    if (link.isAbout) {
      onNavigateAbout();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.cat) {
      onSelectCategory(link.cat);
      if (activeView !== 'home') {
        onNavigateHome();
      }
      setTimeout(() => {
        const el = document.getElementById('articles-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      // Home
      onSelectCategory('All');
      onNavigateHome();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => {
                onSelectCategory('All');
                onNavigateHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
              aria-label="TechPulse Daily Home"
            >
              <div className="relative">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
                  TP
                </span>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif-editorial text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    TechPulse Daily
                  </span>
                </div>
                <span className="hidden lg:inline-block text-[11px] tracking-wider text-slate-400 font-sans-ui">
                  Independent Tech · AI · Gadgets · Digital Life
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.isAbout
                  ? activeView === 'about'
                  : activeView === 'home' &&
                    ((!link.cat && currentCategory === 'All') ||
                      (link.cat && currentCategory === link.cat));

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-sm font-medium transition-colors cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
              aria-label="Search articles"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline text-xs text-slate-500 font-medium">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono-code text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.isAbout
                  ? activeView === 'about'
                  : activeView === 'home' &&
                    ((!link.cat && currentCategory === 'All') ||
                      (link.cat && currentCategory === link.cat));

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-base font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search TechPulse Daily
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
