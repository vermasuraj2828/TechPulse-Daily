import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  ThumbsUp,
  ImageOff
} from 'lucide-react';
import { Article } from '../types/blog';
import { ArticleCard } from './ArticleCard';

interface ArticlePageProps {
  article: Article;
  allArticles: Article[];
  onBackToArticles: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: any) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  allArticles,
  onBackToArticles,
  onSelectArticle,
  onSelectCategory,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll depth tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate previous and next articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : allArticles[allArticles.length - 1];
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : allArticles[0];

  // Related articles (matching category, excluding current)
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .sort((a, b) => (a.category === article.category ? -1 : 1))
    .slice(0, 3);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${article.title}" on TechPulse Daily`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const toggleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Indicator */}
      <div 
        className="fixed top-16 sm:top-20 left-0 h-1 bg-indigo-600 z-50 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <button
          onClick={onBackToArticles}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </button>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header Metadata */}
        <header className="mb-8">
          {/* Category kicker */}
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-4">
            <button
              onClick={() => {
                onSelectCategory(article.category);
                onBackToArticles();
              }}
              className="hover:underline cursor-pointer"
            >
              {article.category}
            </button>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-slate-500 font-normal">In-Depth Editorial</span>
          </div>

          {/* Large Title */}
          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6 text-balance">
            {article.title}
          </h1>

          {/* Subtitle / Deck */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-sans-ui mb-8 text-balance">
            {article.subtitle}
          </p>

          {/* Author Byline & Details */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {article.author.name}
                </div>
                <div className="text-xs text-slate-500">
                  {article.author.role}
                </div>
              </div>
            </div>

            {/* Publication Date & Reading Time */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{article.date}</span>
              </div>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Large Featured Image */}
        <figure className="mb-10">
          <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 aspect-[16/9] relative">
            {!imageError ? (
              <img
                src={article.featuredImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
                <ImageOff className="w-12 h-12 text-slate-500 mb-2" />
                <span className="text-sm text-slate-400">{article.category} Editorial Visual</span>
              </div>
            )}
          </div>
          {article.imageCaption && (
            <figcaption className="text-xs sm:text-sm text-slate-500 italic mt-3 px-1 text-center font-serif-editorial">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* Social Sharing & Action Bar (Sticky or In-flow) */}
        <div className="flex items-center justify-between py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-10 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Share article:</span>
            <button
              onClick={handleShareTwitter}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-md font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              𝕏 Post
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-md font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              LinkedIn
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-md font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                liked
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-indigo-600'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
              <span className="font-mono-code tabular-nums text-xs">{likes}</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="p-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-md text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Bookmark article"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Lead Paragraph with Elegant Editorial styling */}
        <div className="prose prose-slate max-w-none mb-8">
          <p className="text-xl sm:text-2xl text-slate-800 font-serif-editorial leading-relaxed font-normal border-l-2 border-indigo-600 pl-4 sm:pl-6 my-6">
            {article.leadParagraph}
          </p>
        </div>

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/90">
            <h3 className="font-sans-ui text-xs uppercase tracking-wider font-bold text-indigo-600 mb-3 flex items-center gap-1.5">
              <span>Executive Briefing · Key Insights</span>
            </h3>
            <ul className="space-y-2.5">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Complete Article Sections */}
        <div className="space-y-10 my-10">
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug pt-2">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans-ui">
                  {p}
                </p>
              ))}

              {/* Optional Section Bullets */}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <div className="my-5 pl-4 sm:pl-6 border-l border-slate-200 space-y-2">
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <div key={bpIdx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Section Quote */}
              {section.quote && (
                <blockquote className="my-8 p-6 sm:p-8 bg-slate-50/80 rounded-2xl border border-slate-200">
                  <p className="font-serif-editorial italic text-xl sm:text-2xl text-slate-900 leading-relaxed text-center max-w-xl mx-auto">
                    “{section.quote}”
                  </p>
                </blockquote>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-8 pb-10 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Topics:
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Callout: Required prompt sentence */}
        <div className="my-10 p-8 rounded-2xl bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50/50 border border-indigo-100 text-center">
          <h3 className="font-serif-editorial text-2xl font-bold text-slate-900 mb-2">
            Enjoyed this article? Explore more stories from TechPulse Daily.
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6">
            Dive deeper into artificial intelligence, hardware reviews, mobile ecosystems, and the emerging future of digital life.
          </p>
          <button
            onClick={onBackToArticles}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Articles</span>
          </button>
        </div>

        {/* Previous / Next Article Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-6 border-t border-slate-200">
          {prevArticle && (
            <button
              onClick={() => {
                onSelectArticle(prevArticle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors mb-2">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous Article</span>
                </span>
                <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {prevArticle.title}
                </h4>
              </div>
              <span className="text-xs text-slate-400 mt-3">{prevArticle.category}</span>
            </button>
          )}

          {nextArticle && (
            <button
              onClick={() => {
                onSelectArticle(nextArticle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm text-right transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors mb-2 justify-end w-full">
                  <span>Next Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {nextArticle.title}
                </h4>
              </div>
              <span className="text-xs text-slate-400 mt-3">{nextArticle.category}</span>
            </button>
          )}
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-slate-900">
                  Related Stories
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Recommended
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard
                  key={rel.id}
                  article={rel}
                  onReadArticle={(a) => {
                    onSelectArticle(a);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
