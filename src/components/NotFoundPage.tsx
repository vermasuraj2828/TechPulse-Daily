import React from 'react';
import { Compass, ArrowLeft, Search, BookOpen, Sparkles } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types/blog';
import { getArticleUrl, getCategoryUrl } from '../utils/router';

interface NotFoundPageProps {
  attemptedPath: string;
  onNavigateHome: () => void;
  onReadArticle: (article: Article) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  attemptedPath,
  onNavigateHome,
  onReadArticle,
  onOpenSearch,
}) => {
  const suggestedArticles = ARTICLES.slice(0, 3);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-2xl w-full text-center">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-xs font-semibold uppercase tracking-wider mb-6">
          <span>Error 404</span>
          <span>·</span>
          <span>Page Not Found</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          This Story Doesn’t Seem to Exist
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-sans-ui mb-3">
          The requested URL <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono break-all">{attemptedPath}</code> could not be located in our editorial database.
        </p>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          It might have been archived, moved, or entered with an incorrect URL slug.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <a
            href="/"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onNavigateHome();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </a>

          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Search Articles</span>
          </button>
        </div>

        {/* Category shortcuts */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Explore Popular Publication Sections:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Artificial Intelligence', url: '/category/ai' },
              { name: 'Technology', url: '/category/technology' },
              { name: 'Gadgets', url: '/category/gadgets' },
              { name: 'Apps', url: '/category/apps' },
              { name: 'Productivity', url: '/category/productivity' },
              { name: 'Future', url: '/category/future' },
            ].map((cat) => (
              <a
                key={cat.name}
                href={cat.url}
                className="px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        {/* Suggested Articles */}
        <div className="text-left border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Recommended Reading Instead:</span>
          </div>
          <div className="space-y-3">
            {suggestedArticles.map((art) => (
              <a
                key={art.id}
                href={getArticleUrl(art.slug)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onReadArticle(art);
                }}
                className="group block p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all text-left"
              >
                <div className="text-xs font-semibold text-indigo-600 mb-1">{art.category} · {art.readTime}</div>
                <div className="font-serif-editorial text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {art.title}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
