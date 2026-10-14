import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ARTICLES, CATEGORIES } from './data/articles';
import { Article, Category } from './types/blog';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedArticle } from './components/FeaturedArticle';
import { ArticleCard } from './components/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter';
import { PopularTopics } from './components/PopularTopics';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ArticlePage } from './components/ArticlePage';
import { AboutPage } from './components/AboutPage';
import { NotFoundPage } from './components/NotFoundPage';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Filter } from 'lucide-react';
import {
  Route,
  parseRoute,
  getArticleUrl,
  getCategoryUrl,
  getAboutUrl,
  getContactUrl,
  getPrivacyUrl,
  getSearchUrl,
  updatePageMetadata,
} from './utils/router';
import { getRouteTitle } from './utils/titleRules';
import { getRouteMetaDescription } from './utils/metaDescriptionRules';

export default function App() {
  // Current active structured route
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    return parseRoute(window.location.pathname, window.location.search, window.location.hash);
  });

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Return route for when a modal (search/contact/privacy) was opened on top of a page
  const [previousUrl, setPreviousUrl] = useState<string>('/');

  // Primary lead featured article
  const leadArticle = useMemo(() => {
    return ARTICLES.find((a) => a.featured) || ARTICLES[0];
  }, []);

  // Compute counts for each category
  const articleCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      All: ARTICLES.length,
      AI: 0,
      Technology: 0,
      Gadgets: 0,
      Apps: 0,
      Productivity: 0,
      Future: 0,
    };
    ARTICLES.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Sync route and metadata
  const applyMetadataForRoute = useCallback((route: Route) => {
    switch (route.type) {
      case 'article':
        updatePageMetadata(
          getRouteTitle('article', { slug: route.article.slug, articleTitle: route.article.title }),
          getRouteMetaDescription('article', { slug: route.article.slug, excerpt: route.article.excerpt }),
          getArticleUrl(route.article.slug),
          route.article.featuredImage,
          route.article
        );
        break;
      case 'category':
        updatePageMetadata(
          getRouteTitle('category', { category: route.category }),
          getRouteMetaDescription('category', { category: route.category }),
          getCategoryUrl(route.category)
        );
        break;
      case 'about':
        updatePageMetadata(
          getRouteTitle('about'),
          getRouteMetaDescription('about'),
          getAboutUrl()
        );
        break;
      case 'contact':
        updatePageMetadata(
          getRouteTitle('contact'),
          getRouteMetaDescription('contact'),
          getContactUrl()
        );
        break;
      case 'privacy':
        updatePageMetadata(
          getRouteTitle('privacy'),
          getRouteMetaDescription('privacy'),
          getPrivacyUrl()
        );
        break;
      case 'search':
        updatePageMetadata(
          getRouteTitle('search', { query: route.query }),
          getRouteMetaDescription('search', { query: route.query }),
          getSearchUrl(route.query)
        );
        break;
      case 'not-found':
        updatePageMetadata(
          getRouteTitle('not-found'),
          getRouteMetaDescription('not-found'),
          route.path
        );
        break;
      case 'home':
      default:
        updatePageMetadata(
          getRouteTitle('home'),
          getRouteMetaDescription('home'),
          '/'
        );
        break;
    }
  }, []);

  // Main client-side navigation dispatcher
  const navigate = useCallback((url: string, replace = false, smoothScroll = true) => {
    if (replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }

    const newRoute = parseRoute(window.location.pathname, window.location.search, window.location.hash);
    setCurrentRoute(newRoute);
    applyMetadataForRoute(newRoute);

    // Sync modal visibility based on route
    if (newRoute.type === 'contact') {
      setIsContactOpen(true);
    } else if (newRoute.type === 'privacy') {
      setIsPrivacyOpen(true);
    } else if (newRoute.type === 'search') {
      setSearchInitialQuery(newRoute.query);
      setIsSearchOpen(true);
    }

    if (smoothScroll) {
      if (window.location.hash === '#articles-section') {
        setTimeout(() => {
          const el = document.getElementById('articles-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [applyMetadataForRoute]);

  // Initial load: parse route, normalize legacy hash if present, and update metadata
  useEffect(() => {
    const initialRoute = parseRoute(window.location.pathname, window.location.search, window.location.hash);
    setCurrentRoute(initialRoute);
    applyMetadataForRoute(initialRoute);

    // If loaded with a legacy hash (e.g. #article/foo or #about), normalize to clean URL
    if (window.location.hash) {
      if (initialRoute.type === 'article') {
        window.history.replaceState(null, '', getArticleUrl(initialRoute.article.slug));
      } else if (initialRoute.type === 'about') {
        window.history.replaceState(null, '', getAboutUrl());
      } else if (initialRoute.type === 'contact') {
        window.history.replaceState(null, '', getContactUrl());
      } else if (initialRoute.type === 'privacy') {
        window.history.replaceState(null, '', getPrivacyUrl());
      }
    }

    // Direct modal routes
    if (initialRoute.type === 'contact') {
      setIsContactOpen(true);
    } else if (initialRoute.type === 'privacy') {
      setIsPrivacyOpen(true);
    } else if (initialRoute.type === 'search') {
      setSearchInitialQuery(initialRoute.query);
      setIsSearchOpen(true);
    }

    // Handle browser Back and Forward button events
    const handlePopState = () => {
      const poppedRoute = parseRoute(window.location.pathname, window.location.search, window.location.hash);
      setCurrentRoute(poppedRoute);
      applyMetadataForRoute(poppedRoute);

      if (poppedRoute.type === 'contact') {
        setIsContactOpen(true);
      } else {
        setIsContactOpen(false);
      }

      if (poppedRoute.type === 'privacy') {
        setIsPrivacyOpen(true);
      } else {
        setIsPrivacyOpen(false);
      }

      if (poppedRoute.type === 'search') {
        setSearchInitialQuery(poppedRoute.query);
        setIsSearchOpen(true);
      } else {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyMetadataForRoute]);

  // Selected category in current view
  const currentCategory: Category = useMemo(() => {
    if (currentRoute.type === 'category') {
      return currentRoute.category;
    }
    return 'All';
  }, [currentRoute]);

  // Filtered articles based on selected category
  const filteredArticles = useMemo(() => {
    if (currentCategory === 'All') {
      return ARTICLES;
    }
    return ARTICLES.filter((a) => a.category === currentCategory);
  }, [currentCategory]);

  // Navigation handlers
  const handleOpenArticle = (article: Article) => {
    navigate(getArticleUrl(article.slug));
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateAbout = () => {
    navigate(getAboutUrl());
  };

  const handleSelectCategory = (cat: Category) => {
    if (cat === 'All') {
      navigate('/');
    } else {
      navigate(getCategoryUrl(cat));
    }
  };

  const handleExploreClick = () => {
    if (currentRoute.type !== 'home' && currentRoute.type !== 'category') {
      navigate('/#articles-section');
    } else {
      const el = document.getElementById('articles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectTopic = (cat: Category) => {
    navigate(getCategoryUrl(cat));
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleOpenSearchModal = () => {
    setPreviousUrl(window.location.pathname + window.location.search);
    setIsSearchOpen(true);
    window.history.pushState(null, '', getSearchUrl());
    applyMetadataForRoute({ type: 'search', query: '' });
  };

  const handleCloseSearchModal = () => {
    setIsSearchOpen(false);
    if (window.location.pathname === '/search') {
      navigate(previousUrl || '/', true, false);
    }
  };

  const handleSearchQueryChange = (q: string) => {
    const url = getSearchUrl(q);
    window.history.replaceState(null, '', url);
    applyMetadataForRoute({ type: 'search', query: q });
  };

  const handleOpenContact = () => {
    setPreviousUrl(window.location.pathname + window.location.search);
    setIsContactOpen(true);
    window.history.pushState(null, '', getContactUrl());
    applyMetadataForRoute({ type: 'contact' });
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
    if (window.location.pathname === '/contact') {
      navigate(previousUrl || '/', true, false);
    }
  };

  const handleOpenPrivacy = () => {
    setPreviousUrl(window.location.pathname + window.location.search);
    setIsPrivacyOpen(true);
    window.history.pushState(null, '', getPrivacyUrl());
    applyMetadataForRoute({ type: 'privacy' });
  };

  const handleClosePrivacy = () => {
    setIsPrivacyOpen(false);
    if (window.location.pathname === '/privacy') {
      navigate(previousUrl || '/', true, false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navigation Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        activeView={currentRoute.type}
        onNavigateHome={handleNavigateHome}
        onNavigateAbout={handleNavigateAbout}
        onNavigateUrl={(url) => navigate(url)}
        onOpenSearch={handleOpenSearchModal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute.type === 'article' ? (
          <ArticlePage
            article={currentRoute.article}
            allArticles={ARTICLES}
            onBackToArticles={handleNavigateHome}
            onSelectArticle={handleOpenArticle}
            onSelectCategory={(cat) => handleSelectCategory(cat)}
          />
        ) : currentRoute.type === 'about' ? (
          <AboutPage
            onBackToArticles={handleNavigateHome}
            onOpenContact={handleOpenContact}
          />
        ) : currentRoute.type === 'not-found' ? (
          <NotFoundPage
            attemptedPath={currentRoute.path}
            onNavigateHome={handleNavigateHome}
            onReadArticle={handleOpenArticle}
            onOpenSearch={handleOpenSearchModal}
          />
        ) : (
          /* Homepage or Category Catalog View */
          <>
            {/* Hero Section (Shown on Homepage, or displays focused topic on category view) */}
            <Hero
              onExploreClick={handleExploreClick}
              onOpenTopic={handleSelectTopic}
              selectedCategory={currentCategory}
            />

            {/* Featured Article Section (Shown when viewing root homepage) */}
            {currentCategory === 'All' && (
              <FeaturedArticle
                article={leadArticle}
                onReadArticle={handleOpenArticle}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {/* Latest Articles Grid Section */}
            <section
              id="articles-section"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 scroll-mt-20"
            >
              {/* Section Header & Category Filters */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200/80 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {currentCategory === 'All' ? 'Latest Articles' : `${currentCategory} Articles`}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-sm max-w-xl">
                    {currentCategory === 'All'
                      ? `Browse our complete catalog of ${ARTICLES.length} in-depth technology essays, guides, and forecasts.`
                      : `Displaying stories categorized under ${currentCategory}.`}
                  </p>
                </div>

                {/* Category Filtering Bar with Semantic Links */}
                <div className="w-full md:w-auto">
                  <CategoryFilter
                    selectedCategory={currentCategory}
                    onSelectCategory={handleSelectCategory}
                    articleCounts={articleCounts}
                  />
                </div>
              </div>

              {/* Responsive Article Grid */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onReadArticle={handleOpenArticle}
                      onSelectCategory={handleSelectCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-serif-editorial text-xl font-bold text-slate-900 mb-1">
                    No articles found in this category
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Try switching to another category or resetting to All.
                  </p>
                  <a
                    href="/"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      handleSelectCategory('All');
                    }}
                    className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View All Articles
                  </a>
                </div>
              )}
            </section>

            {/* Popular Topics Section */}
            <PopularTopics onSelectTopic={handleSelectTopic} />

            {/* Newsletter Section */}
            <Newsletter />
          </>
        )}
      </main>

      {/* Global Publication Footer */}
      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateAbout={handleNavigateAbout}
        onSelectCategory={handleSelectCategory}
        onOpenContact={handleOpenContact}
        onOpenPrivacy={handleOpenPrivacy}
        onNavigateUrl={(url) => navigate(url)}
      />

      {/* Global Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        initialQuery={searchInitialQuery}
        onClose={handleCloseSearchModal}
        articles={ARTICLES}
        onSelectArticle={handleOpenArticle}
        onQueryChange={handleSearchQueryChange}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={handleCloseContact}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={handleClosePrivacy}
      />
    </div>
  );
}
