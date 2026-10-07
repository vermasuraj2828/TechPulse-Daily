import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, FileText } from 'lucide-react';
import { Article } from '../types/blog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredArticles = trimmed
    ? articles.filter((article) => {
        const inTitle = article.title.toLowerCase().includes(trimmed);
        const inCategory = article.category.toLowerCase().includes(trimmed);
        const inExcerpt = article.excerpt.toLowerCase().includes(trimmed);
        const inLead = article.leadParagraph.toLowerCase().includes(trimmed);
        const inTags = article.tags.some((t) => t.toLowerCase().includes(trimmed));
        const inSections = article.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(trimmed) ||
            s.paragraphs.some((p) => p.toLowerCase().includes(trimmed))
        );
        return inTitle || inCategory || inExcerpt || inLead || inTags || inSections;
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 lg:p-20 flex items-start justify-center animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, categories, AI breakthroughs, gadgets..."
            className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 text-base sm:text-lg focus:outline-none"
            aria-label="Search articles"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono-code text-slate-400 bg-white border border-slate-200 rounded">
              ESC
            </kbd>
          )}
          <button
            onClick={onClose}
            className="sm:hidden p-1 text-slate-400 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-3">
          {trimmed ? (
            filteredArticles.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                  <span>Found {filteredArticles.length} matching {filteredArticles.length === 1 ? 'article' : 'articles'}</span>
                  <span>Press item to read</span>
                </div>

                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="group p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                        <span>{article.category}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 font-normal">{article.date}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 font-normal flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {article.readTime}
                        </span>
                      </div>

                      <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {article.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform self-end sm:self-center">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No results state - exact text required */
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif-editorial text-xl font-bold text-slate-900 mb-2">
                  No articles found. Try another search term.
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  We could not find any stories matching "{query}". Try searching for keywords like "AI", "productivity", "smartphones", or "robotics".
                </p>
              </div>
            )
          ) : (
            /* Suggested / Quick picks when empty */
            <div className="py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                Suggested Topics to Search
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Artificial Intelligence', 'Smartphones', 'Productivity', 'Smart Homes', 'Search', 'Future Internet'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                All 10 Indexed Articles
              </div>
              <div className="space-y-2">
                {articles.slice(0, 5).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onSelectArticle(a);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <span className="truncate pr-4 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {a.title}
                    </span>
                    <span className="text-slate-400 font-mono-code text-[11px] shrink-0">
                      {a.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400 flex items-center justify-between px-6">
          <span>Search spans titles, summaries, topics, and full text</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
