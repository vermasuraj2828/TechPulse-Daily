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
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full">
      {/* Featured Thumbnail */}
      <div 
        onClick={() => onReadArticle(article)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
      >
        {!imageError ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-slate-400">
            <ImageOff className="w-8 h-8 mb-2 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">{article.category}</span>
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
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-full h-full object-cover"
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
