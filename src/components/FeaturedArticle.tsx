import React, { useState } from 'react';
import { ArrowRight, Clock, User, ImageOff } from 'lucide-react';
import { Article } from '../types/blog';

interface FeaturedArticleProps {
  article: Article;
  onReadArticle: (article: Article) => void;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  article,
  onReadArticle,
}) => {
  const [imgSrc, setImgSrc] = useState(article.featuredImage);
  const [hasError, setHasError] = useState(false);

  const handleImgError = () => {
    const filename = article.featuredImage.split('/').pop()?.split('?')[0];
    if (filename && imgSrc !== `/images/${filename}`) {
      setImgSrc(`/images/${filename}`);
    } else {
      setHasError(true);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Featured Editorial
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          Lead Story
        </span>
      </div>

      <div className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Large Image Column (7 cols on desktop) */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px] overflow-hidden bg-slate-900">
            {!hasError ? (
              <img
                src={imgSrc}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 z-10">{article.category} Lead Story</span>
                <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-center text-slate-100 px-6 z-10 leading-snug">{article.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Content Column (5 cols on desktop) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Unboxed Metadata Line */}
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-3 tracking-wide">
                <span>{article.category}</span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="text-slate-500 font-normal">{article.date}</span>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="text-slate-500 font-normal flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 
                onClick={() => onReadArticle(article)}
                className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-[1.2] cursor-pointer mb-4 text-balance hover:underline underline-offset-6 decoration-indigo-300/80"
              >
                {article.title}
              </h3>

              {/* Short Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans-ui line-clamp-3 sm:line-clamp-4 mb-6">
                {article.excerpt}
              </p>
            </div>

            <div>
              {/* Author Strip */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 relative">
                  <span className="select-none">
                    {article.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {article.author.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {article.author.role}
                  </div>
                </div>
              </div>

              {/* Read Article Button */}
              <button
                onClick={() => onReadArticle(article)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer group/btn"
              >
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
