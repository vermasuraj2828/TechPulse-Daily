import React, { useState, useEffect, useMemo } from 'react';
import { ARTICLES } from './data/articles';
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
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Compass, Filter } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [activeView, setActiveView] = useState<'home' | 'article' | 'about'>('home');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // The primary lead featured article
  const leadArticle = useMemo(() => {
    return ARTICLES.find((a) => a.featured) || ARTICLES[0];
  }, []);

  // Filtered articles for the grid
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') {
      return ARTICLES;
    }
    return ARTICLES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

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

  // Handle URL hash routing on initial load and hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#article/')) {
        const slug = hash.replace('#article/', '');
        const matched = ARTICLES.find((a) => a.slug === slug);
        if (matched) {
          setCurrentArticle(matched);
          setActiveView('article');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } else if (hash === '#about') {
        setActiveView('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update document title dynamically based on active view and state
  useEffect(() => {
    if (activeView === 'article' && currentArticle) {
      document.title = `${currentArticle.title} — TechPulse Daily`;
    } else if (activeView === 'about') {
      document.title = 'About TechPulse Daily — Making Technology Easier to Understand';
    } else if (selectedCategory !== 'All') {
      document.title = `${selectedCategory} Stories & Breakthroughs — TechPulse Daily`;
    } else {
      document.title = 'TechPulse Daily — The Future of Technology Starts Today';
    }
  }, [activeView, currentArticle, selectedCategory]);

  const handleOpenArticle = (article: Article) => {
    setCurrentArticle(article);
    setActiveView('article');
    window.location.hash = `#article/${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAbout = () => {
    setActiveView('about');
    window.location.hash = '#about';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
  };

  const handleExploreClick = () => {
    const el = document.getElementById('articles-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTopic = (cat: Category) => {
    setSelectedCategory(cat);
    if (activeView !== 'home') {
      setActiveView('home');
      window.location.hash = '';
    }
    setTimeout(() => {
      const el = document.getElementById('articles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navigation Header */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        activeView={activeView}
        onNavigateHome={handleNavigateHome}
        onNavigateAbout={handleNavigateAbout}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'article' && currentArticle ? (
          <ArticlePage
            article={currentArticle}
            allArticles={ARTICLES}
            onBackToArticles={handleNavigateHome}
            onSelectArticle={handleOpenArticle}
            onSelectCategory={(cat) => {
              handleSelectCategory(cat);
              handleNavigateHome();
            }}
          />
        ) : activeView === 'about' ? (
          <AboutPage
            onBackToArticles={handleNavigateHome}
            onOpenContact={() => setIsContactOpen(true)}
          />
        ) : (
          /* Homepage View */
          <>
            {/* Hero Section */}
            <Hero
              onExploreClick={handleExploreClick}
              onOpenTopic={handleSelectTopic}
              selectedCategory={selectedCategory}
            />

            {/* Featured Article Section (Shown when viewing All or AI) */}
            {selectedCategory === 'All' && (
              <FeaturedArticle
                article={leadArticle}
                onReadArticle={handleOpenArticle}
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
                      {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-sm max-w-xl">
                    {selectedCategory === 'All'
                      ? 'Browse our complete catalog of 10 in-depth technology essays, technical guides, and future forecasts.'
                      : `Displaying stories categorized under ${selectedCategory}.`}
                  </p>
                </div>

                {/* Category Filtering Bar */}
                <div className="w-full md:w-auto">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
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
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View All Articles
                  </button>
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
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Global Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={ARTICLES}
        onSelectArticle={handleOpenArticle}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
