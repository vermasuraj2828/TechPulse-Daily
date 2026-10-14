import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, FileText } from 'lucide-react';
import { Article } from '../types/blog';
import { getArticleUrl } from '../utils/router';

interface SearchModalProps {
  isOpen: boolean;
  initialQuery?: string;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onQueryChange?: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  initialQuery = '',
  onClose,
  articles,
  onSelectArticle,
  onQueryChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen, initialQuery]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (onQueryChange) {
      onQueryChange(val);
    }
  };

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredArticles = trimmed
    ? articles.filter((article) => {
        const inTitle = article.title.toLowerCase().includes(trimmed);
        const inCategory = article.category.toLowerCase().includes(trimmed);
        const inExcerpt = article.excerpt.toLowerCase().includes(trimmed);
        const inLead = article.leadParagraph.toLowerCase().includes(trimmed);
        const inTags = article.tags.some((t) => t.toLowerCase().includes(trimmed));
        return inTitle || inCategory || inExcerpt || inLead || inTags;
      })
    : [];

  const handleArticleClick = (e: React.MouseEvent, article: Article) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onSelectArticle(article);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex items-start justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mt-12 sm:mt-20 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search AI, gadgets, apps, technology essays..."
            className="w-full bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400 text-base sm:text-lg"
            aria-label="Search articles"
          />
          {query ? (
            <button
              onClick={() => handleInputChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono-code text-slate-400 bg-white border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
          {trimmed ? (
            filteredArticles.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Found {filteredArticles.length} Result{filteredArticles.length === 1 ? '' : 's'}</span>
                  <span className="font-mono-code">“{query}”</span>
                </div>

                {filteredArticles.map((article) => (
                  <a
                    key={article.id}
                    href={getArticleUrl(article.slug)}
                    onClick={(e) => handleArticleClick(e, article)}
                    className="group p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                    aria-label={`Read article: ${article.title}`}
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
                      <span className="sr-only">: {article.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </a>
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
            <div className="py-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                Suggested Topics to Search
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Artificial Intelligence', 'Smartphones', 'Productivity', 'Smart Homes', 'Search', 'Wearables'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleInputChange(term)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                All {articles.length} Indexed Articles
              </div>
              <div className="space-y-2">
                {articles.slice(0, 5).map((article) => (
                  <a
                    key={article.id}
                    href={getArticleUrl(article.slug)}
                    onClick={(e) => handleArticleClick(e, article)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 group transition-colors block"
                    aria-label={`Read article: ${article.title}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                      <span className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors font-medium line-clamp-1">
                        {article.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-4 font-mono-code">{article.category}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Search matches titles, categories, tags, and full text</span>
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
