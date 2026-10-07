import React from 'react';
import { Category } from '../types/blog';
import { CATEGORIES } from '../data/articles';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  articleCounts: Record<Category, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  articleCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none" role="region" aria-label="Category filters">
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200/80 min-w-max">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = articleCounts[category] || 0;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              aria-pressed={isSelected}
            >
              <span>{category}</span>
              <span
                className={`text-[11px] font-mono-code tabular-nums px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
