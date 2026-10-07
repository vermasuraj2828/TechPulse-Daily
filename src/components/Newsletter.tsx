import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-12 lg:my-16 overflow-hidden relative shadow-xl">
      {/* Decorative subtle ambient backdrop */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%), radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)'
        }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-12 sm:py-16 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6 border border-indigo-400/20">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          Stay Ahead of Tech
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
          “Get the latest technology stories, AI trends, useful apps, and gadget updates delivered to your inbox.”
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left text-sm">
              <span className="font-semibold block">You are officially subscribed!</span>
              <span className="text-emerald-300/80 text-xs">Expect our curated Sunday briefing. Welcome aboard.</span>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="ml-4 text-xs underline text-emerald-300 hover:text-white"
            >
              Reset
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  aria-label="Email address for newsletter"
                  disabled={status === 'loading'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-70 active:scale-[0.99]"
              >
                <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                {status !== 'loading' && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {status === 'error' && (
              <p className="mt-3 text-xs text-rose-400 text-left sm:text-center animate-in fade-in">
                {errorMessage}
              </p>
            )}

            <p className="text-slate-400 text-xs mt-4">
              Zero spam. High-signal tech analysis only. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
