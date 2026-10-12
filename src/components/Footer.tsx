import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Category } from '../types/blog';
import { getCategoryUrl, getAboutUrl, getContactUrl, getPrivacyUrl } from '../utils/router';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onSelectCategory: (cat: Category) => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onNavigateUrl?: (url: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateAbout,
  onSelectCategory,
  onOpenContact,
  onOpenPrivacy,
  onNavigateUrl,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    action: () => void
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl(url);
    } else {
      action();
    }
  };

  const handleArticlesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl('/');
    } else {
      onSelectCategory('All');
      onNavigateHome();
    }
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-200">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/', () => {
                onSelectCategory('All');
                onNavigateHome();
                scrollToTop();
              })}
              className="flex items-center gap-2.5 mb-3 group"
            >
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-indigo-700 transition-colors">
                TP
              </span>
              <span className="font-serif-editorial text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                TechPulse Daily
              </span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-6">
              “Making technology easier to understand.”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              An independent tech publication dissecting artificial intelligence, consumer gadgets, digital productivity, mobile ecosystems, and the emerging architecture of tomorrow’s web.
            </p>
          </div>

          {/* Quick Links with Unique URLs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Publication
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLinkClick(e, '/', () => {
                    onNavigateHome();
                    scrollToTop();
                  })}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#articles-section"
                  onClick={handleArticlesClick}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left block"
                >
                  Articles Catalog
                </a>
              </li>
              <li>
                <a
                  href={getAboutUrl()}
                  onClick={(e) => handleLinkClick(e, getAboutUrl(), () => {
                    onNavigateAbout();
                    scrollToTop();
                  })}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href={getContactUrl()}
                  onClick={(e) => handleLinkClick(e, getContactUrl(), () => {
                    onOpenContact();
                  })}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left block"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={getPrivacyUrl()}
                  onClick={(e) => handleLinkClick(e, getPrivacyUrl(), () => {
                    onOpenPrivacy();
                  })}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left block"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Topics with Unique URLs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { cat: 'AI' as Category, name: 'Artificial Intelligence', url: getCategoryUrl('AI') },
                { cat: 'Gadgets' as Category, name: 'Gadgets & Hardware', url: getCategoryUrl('Gadgets') },
                { cat: 'Apps' as Category, name: 'Apps & Mobile', url: getCategoryUrl('Apps') },
                { cat: 'Productivity' as Category, name: 'Digital Productivity', url: getCategoryUrl('Productivity') },
                { cat: 'Future' as Category, name: 'Future Technology', url: getCategoryUrl('Future') },
              ].map((topic) => (
                <li key={topic.name}>
                  <a
                    href={topic.url}
                    onClick={(e) => handleLinkClick(e, topic.url, () => {
                      onSelectCategory(topic.cat);
                      onNavigateHome();
                      scrollToTop();
                    })}
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left block"
                  >
                    {topic.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Social Presence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Connect
            </h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Follow our daily dispatches across social platforms.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                aria-label="TechPulse Daily on X (Twitter)"
              >
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors text-xs font-bold"
                aria-label="TechPulse Daily on Instagram"
              >
                IG
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors text-xs font-bold"
                aria-label="TechPulse Daily on LinkedIn"
              >
                IN
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TechPulse Daily. All rights reserved. Content crafted for curious minds.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
