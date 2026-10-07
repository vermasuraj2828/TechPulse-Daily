import React, { useState } from 'react';
import { ArrowRight, Clock, ImageOff } from 'lucide-react';
import { Article } from '../types/blog';

interface ArticleCardProps {
  article: Article;
  onReadArticle: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
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
    <article className="group flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full">
      {/* Featured Thumbnail */}
      <div 
        onClick={() => onReadArticle(article)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
      >
        {!hasError ? (
          <img
            src={imgSrc}
            alt={article.title}
            referrerPolicy="no-referrer"
            onError={handleImgError}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1 z-10">{article.category}</span>
            <span className="text-sm font-serif-editorial font-bold text-center text-slate-200 line-clamp-2 px-4 z-10">{article.title}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category · Date · Read Time (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2.5">
            <span>{article.category}</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{article.date}</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readTime}
            </span>
          </div>

          {/* Article Title */}
          <h3 
            onClick={() => onReadArticle(article)}
            className="font-serif-editorial text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-[1.25] mb-3 cursor-pointer line-clamp-2 group-hover:underline underline-offset-4 decoration-indigo-300/80"
          >
            {article.title}
          </h3>

          {/* Short Excerpt */}
          <p className="text-slate-600 text-sm leading-relaxed font-sans-ui line-clamp-3 mb-6">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer: Author + Read More Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-50 border border-indigo-200/60 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 relative">
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
            <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
              {article.author.name}
            </span>
          </div>

          {/* Read More button */}
          <button
            onClick={() => onReadArticle(article)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 hover:underline cursor-pointer"
            aria-label={`Read more: ${article.title}`}
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
