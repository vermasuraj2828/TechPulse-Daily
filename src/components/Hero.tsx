import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Compass, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types/blog';

interface HeroProps {
  onExploreClick: () => void;
  onOpenTopic: (category: Category) => void;
  selectedCategory?: Category;
}

const ROTATING_TOPICS = [
  { word: 'Technology', category: 'Technology' as Category, color: 'from-indigo-600 via-indigo-700 to-violet-600' },
  { word: 'Artificial Intelligence', category: 'AI' as Category, color: 'from-blue-600 via-indigo-600 to-purple-600' },
  { word: 'Next-Gen Gadgets', category: 'Gadgets' as Category, color: 'from-violet-600 via-indigo-600 to-sky-600' },
  { word: 'Digital Life', category: 'Apps' as Category, color: 'from-indigo-600 via-teal-600 to-emerald-600' },
  { word: 'Cognitive Work', category: 'Productivity' as Category, color: 'from-amber-600 via-indigo-600 to-violet-600' },
  { word: 'The Next Decade', category: 'Future' as Category, color: 'from-indigo-600 via-fuchsia-600 to-rose-600' },
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenTopic, selectedCategory = 'All' }) => {
  const [topicIndex, setTopicIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Sync with selectedCategory if user changed it outside
  useEffect(() => {
    if (selectedCategory !== 'All') {
      const idx = ROTATING_TOPICS.findIndex((t) => t.category === selectedCategory);
      if (idx !== -1) {
        setTopicIndex(idx);
        setIsPaused(true);
      }
    } else {
      setIsPaused(false);
    }
  }, [selectedCategory]);

  // Automatic rotation when not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTopicIndex((prev) => (prev + 1) % ROTATING_TOPICS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentTopic = ROTATING_TOPICS[topicIndex];

  const handleTopicClick = (index: number) => {
    setTopicIndex(index);
    setIsPaused(true);
    onOpenTopic(ROTATING_TOPICS[index].category);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-200/70 pt-10 pb-16 lg:pt-16 lg:pb-22">
      {/* Subtle background ambient dot grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Editorial Issue Marker & Live Topic Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 mb-5 tracking-wide uppercase bg-slate-100/70 border border-slate-200/70 px-3.5 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-700 font-semibold">TechPulse Daily</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Vol. 2026 Edition</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-indigo-600 font-medium">Independent Editorial</span>
          </div>

          {/* Primary Main Headline with Dynamic Keyword Transformation */}
          <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.14] text-balance mb-6 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] flex flex-col justify-center items-center">
            <span>The Future of</span>
            <span className="relative inline-block mt-1 sm:mt-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTopic.word}
                  initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block bg-gradient-to-r ${currentTopic.color} bg-clip-text text-transparent underline decoration-indigo-200/80 decoration-wavy underline-offset-8 decoration-2`}
                >
                  {currentTopic.word}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="mt-1 sm:mt-2">Starts Today</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-sans-ui max-w-2xl mx-auto mb-8 text-balance">
            “Discover the latest ideas, innovations, AI breakthroughs, gadgets, and digital trends shaping the way we live and work.”
          </p>

          {/* Interactive Headline Topic Quick-Switches */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10 max-w-2xl mx-auto">
            <span className="text-xs text-slate-400 font-medium mr-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Focus:
            </span>
            {ROTATING_TOPICS.map((topic, idx) => (
              <button
                key={topic.word}
                onClick={() => handleTopicClick(idx)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  idx === topicIndex
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={`Switch headline to focus on ${topic.word}`}
              >
                {topic.word}
              </button>
            ))}
            {isPaused && (
              <button
                onClick={() => setIsPaused(false)}
                className="text-xs px-2 py-1 text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                title="Resume automatic title cycling"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto-rotate</span>
              </button>
            )}
          </div>

          {/* CTA & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Articles</span>
              <ArrowDown className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => onOpenTopic('AI')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Read AI Breakthroughs</span>
            </button>
          </div>

          {/* Editorial metrics strip */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center max-w-xl mx-auto">
            <div>
              <div className="font-serif-editorial text-2xl font-bold text-slate-900">11</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">In-Depth Essays</div>
            </div>
            <div>
              <div className="font-serif-editorial text-2xl font-bold text-slate-900">6</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Core Domains</div>
            </div>
            <div>
              <div className="font-serif-editorial text-2xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Hype-Free Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
