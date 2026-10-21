import React from 'react';
import { Compass, ArrowLeft, Search, BookOpen, Sparkles, Home, Info, Mail, ShieldCheck, Newspaper } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types/blog';
import { getArticleUrl, getCategoryUrl } from '../utils/router';

interface NotFoundPageProps {
  attemptedPath: string;
  onNavigateHome: () => void;
  onReadArticle: (article: Article) => void;
  onOpenSearch: () => void;
  onNavigateUrl?: (url: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  attemptedPath,
  onNavigateHome,
  onReadArticle,
  onOpenSearch,
  onNavigateUrl,
}) => {
  const suggestedArticles = ARTICLES.slice(0, 3);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onNavigateUrl) {
      onNavigateUrl(path);
    } else {
      onNavigateHome();
    }
  };

  const mainPages = [
    {
      title: 'Homepage & Latest Stories',
      path: '/',
      description: 'Explore today’s lead stories, breaking news, and in-depth tech journalism.',
      icon: Home,
    },
    {
      title: 'About TechPulse Daily',
      path: '/about',
      description: 'Learn about our independent newsroom, editorial standards, and masthead.',
      icon: Info,
    },
    {
      title: 'Contact Editorial Desk',
      path: '/contact',
      description: 'Send a news tip, pitch a story, or reach our technology editors directly.',
      icon: Mail,
    },
    {
      title: 'Privacy Policy',
      path: '/privacy',
      description: 'Read our comprehensive reader privacy protections and data practices.',
      icon: ShieldCheck,
    },
  ];

  const categories = [
    { name: 'Artificial Intelligence', path: '/category/ai', count: ARTICLES.filter(a => a.category === 'AI').length },
    { name: 'Technology', path: '/category/technology', count: ARTICLES.filter(a => a.category === 'Technology').length },
    { name: 'Gadgets', path: '/category/gadgets', count: ARTICLES.filter(a => a.category === 'Gadgets').length },
    { name: 'Apps', path: '/category/apps', count: ARTICLES.filter(a => a.category === 'Apps').length },
    { name: 'Productivity', path: '/category/productivity', count: ARTICLES.filter(a => a.category === 'Productivity').length },
    { name: 'Future', path: '/category/future', count: ARTICLES.filter(a => a.category === 'Future').length },
  ];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-3xl w-full text-center">
        {/* Friendly Error Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Status 404 / 484 · Page Not Found</span>
        </div>

        {/* Friendly Headline */}
        <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Looking for Something We Couldn’t Find?
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-sans-ui mb-3">
          The requested address <code className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-mono break-all font-semibold">{attemptedPath || '/484'}</code> is not available in our editorial catalog.
        </p>
        <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">
          Technology moves quickly—the story might have been moved, updated, or entered with a typo. Let’s get you right back to what you’re looking for.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
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

        {/* Main Pages Navigation Grid */}
        <div className="text-left mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Main Pages &amp; Key Destinations:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mainPages.map((page) => {
              const Icon = page.icon;
              return (
                <a
                  key={page.path}
                  href={page.path}
                  onClick={(e) => handleLinkClick(e, page.path)}
                  className="group p-4 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-300 rounded-xl transition-all flex items-start gap-3.5"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif-editorial text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {page.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {page.description}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Category Shortcuts */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Browse Publication Categories:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.path}
                href={cat.path}
                onClick={(e) => handleLinkClick(e, cat.path)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                aria-label={`Browse ${cat.name} section`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full font-mono">{cat.count}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recommended Reading */}
        <div className="text-left border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Recommended Reading:</span>
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
                aria-label={`Read recommended story: ${art.title}`}
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
