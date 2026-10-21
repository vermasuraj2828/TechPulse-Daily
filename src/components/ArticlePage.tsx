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
import { Article, Category } from '../types/blog';
import { ArticleCard } from './ArticleCard';
import { getArticleUrl, getCategoryUrl } from '../utils/router';

interface ArticlePageProps {
  article: Article;
  allArticles: Article[];
  onBackToArticles: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: Category) => void;
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
  const [imgSrc, setImgSrc] = useState(article.featuredImage);
  const [hasError, setHasError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Synchronize imgSrc if article changes
  useEffect(() => {
    setImgSrc(article.featuredImage);
    setHasError(false);
  }, [article.id, article.featuredImage]);

  const handleImgError = () => {
    const filename = article.featuredImage.split('/').pop()?.split('?')[0];
    if (!filename) {
      setHasError(true);
      return;
    }

    if (imgSrc.startsWith('/images/')) {
      setImgSrc(`/assets/images/${filename}`);
    } else if (imgSrc.startsWith('/assets/images/')) {
      setImgSrc(`/assets/${filename}`);
    } else if (!imgSrc.startsWith('/images/') && imgSrc !== `/images/${filename}`) {
      setImgSrc(`/images/${filename}`);
    } else {
      setHasError(true);
    }
  };

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

  const canonicalArticleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${getArticleUrl(article.slug)}`
    : `https://tec-plus-daily-1s5c.vercel.app${getArticleUrl(article.slug)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(canonicalArticleUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${article.title}" on TechPulse Daily`);
    const url = encodeURIComponent(canonicalArticleUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(canonicalArticleUrl);
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
        <a
          href="/"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onBackToArticles();
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </a>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header Metadata */}
        <header className="mb-8">
          {/* Category kicker */}
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-4 flex-wrap">
            <a
              href={getCategoryUrl(article.category)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onSelectCategory(article.category);
              }}
              className="hover:underline cursor-pointer"
            >
              {article.category}
            </a>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-slate-500 font-normal">In-Depth Editorial</span>
            {article.slug === 'the-rise-of-ai-powered-search' && (
              <>
                <span className="text-slate-300" aria-hidden="true">/</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  AEO Q&amp;A Format
                </span>
              </>
            )}
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
              <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0 relative">
                <span className="select-none">
                  {article.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
                <img
                  src={article.author.avatar}
                  alt={article.author.avatarAlt || `Portrait of ${article.author.name}, ${article.author.role}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={48}
                  height={48}
                  loading="lazy"
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
            {!hasError ? (
              <img
                src={imgSrc}
                alt={article.imageAlt || `${article.title} - editorial visual`}
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1200}
                height={675}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 z-10">{article.category} Editorial Visual</span>
                <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-center text-slate-100 px-6 z-10">{article.title}</span>
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

              {section.paragraphs.map((p, pIdx) => {
                if (p.startsWith('Direct Answer:')) {
                  const content = p.replace(/^Direct Answer:\s*/, '');
                  return (
                    <div
                      key={pIdx}
                      className="p-4 sm:p-5 my-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-slate-800 shadow-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-700 text-white font-sans-ui">
                          Direct Answer
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 font-sans-ui">
                          AEO Quick Synthesis
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed font-sans-ui">
                        {content}
                      </p>
                    </div>
                  );
                }

                if (p.startsWith('Question:')) {
                  const content = p.replace(/^Question:\s*/, '');
                  return (
                    <h3
                      key={pIdx}
                      className="text-lg sm:text-xl font-bold text-slate-900 pt-3 pb-1 flex items-baseline gap-2 font-serif-editorial"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 shrink-0 font-sans-ui">
                        Q
                      </span>
                      <span>{content}</span>
                    </h3>
                  );
                }

                if (p.startsWith('Answer:')) {
                  const content = p.replace(/^Answer:\s*/, '');
                  return (
                    <div key={pIdx} className="pl-4 sm:pl-5 border-l-2 border-indigo-200/80 my-2">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 font-sans-ui">
                          Answer
                        </span>
                      </div>
                      <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans-ui">
                        {content}
                      </p>
                    </div>
                  );
                }

                return (
                  <p key={pIdx} className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans-ui">
                    {p}
                  </p>
                );
              })}

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
          <a
            href="/"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onBackToArticles();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Articles</span>
          </a>
        </div>

        {/* Previous / Next Article Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-6 border-t border-slate-200">
          {prevArticle && (
            <a
              href={getArticleUrl(prevArticle.slug)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onSelectArticle(prevArticle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm text-left transition-all cursor-pointer flex flex-col justify-between"
              aria-label={`Read previous article: ${prevArticle.title}`}
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
            </a>
          )}

          {nextArticle && (
            <a
              href={getArticleUrl(nextArticle.slug)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onSelectArticle(nextArticle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm text-right transition-all cursor-pointer flex flex-col justify-between"
              aria-label={`Read next article: ${nextArticle.title}`}
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
            </a>
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
