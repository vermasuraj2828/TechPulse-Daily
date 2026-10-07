import React from 'react';
import { Cpu, Smartphone, AppWindow, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { POPULAR_TOPICS } from '../data/articles';
import { Category } from '../types/blog';

interface PopularTopicsProps {
  onSelectTopic: (category: Category) => void;
}

export const PopularTopics: React.FC<PopularTopicsProps> = ({ onSelectTopic }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-600" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'AppWindow':
        return <AppWindow className="w-5 h-5 text-indigo-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-t border-slate-200/80">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Popular Topics
            </h2>
          </div>
          <p className="text-slate-600 text-sm max-w-xl">
            Explore our core coverage pillars shaping the modern digital landscape.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {POPULAR_TOPICS.map((topic) => (
          <button
            key={topic.name}
            onClick={() => onSelectTopic(topic.category)}
            className="group text-left p-5 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-indigo-200 rounded-xl hover:shadow-sm transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-indigo-200 transition-all">
                {getIcon(topic.icon)}
              </div>
              <h3 className="font-serif-editorial text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                {topic.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans-ui line-clamp-2">
                {topic.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-indigo-600">
              <span>{topic.count} {topic.count === 1 ? 'Article' : 'Articles'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
