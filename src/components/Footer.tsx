import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Category } from '../types/blog';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onSelectCategory: (cat: Category) => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateAbout,
  onSelectCategory,
  onOpenContact,
  onOpenPrivacy,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticlesClick = () => {
    onSelectCategory('All');
    onNavigateHome();
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-200">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                TP
              </span>
              <span className="font-serif-editorial text-2xl font-bold tracking-tight text-slate-900">
                TechPulse Daily
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-6">
              “Making technology easier to understand.”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An independent tech publication dissecting artificial intelligence, consumer gadgets, digital productivity, mobile ecosystems, and the emerging architecture of tomorrow’s web.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Publication
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    onNavigateHome();
                    scrollToTop();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={handleArticlesClick}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateAbout();
                    scrollToTop();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Topics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('AI');
                    handleArticlesClick();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Artificial Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Gadgets');
                    handleArticlesClick();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Gadgets & Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Apps');
                    handleArticlesClick();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Apps & Mobile Ecosystems
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Productivity');
                    handleArticlesClick();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Digital Productivity
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Future');
                    handleArticlesClick();
                  }}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Future Technology
                </button>
              </li>
            </ul>
          </div>

          {/* Social Presence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Connect
            </h4>
            <div className="flex flex-col space-y-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-indigo-600 transition-colors group"
                aria-label="X (formerly Twitter)"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:border-indigo-300">
                  𝕏
                </span>
                <span>Follow on X</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-indigo-600 transition-colors group"
                aria-label="Instagram"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:border-indigo-300">
                  IG
                </span>
                <span>Instagram</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-indigo-600 transition-colors group"
                aria-label="LinkedIn"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:border-indigo-300">
                  in
                </span>
                <span>LinkedIn</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-indigo-600 transition-colors group"
                aria-label="YouTube"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 group-hover:border-indigo-300">
                  YT
                </span>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 TechPulse Daily. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Written & Curated for Modern Technologists</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
