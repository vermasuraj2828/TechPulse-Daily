import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-lg font-bold text-slate-900">
                Privacy Policy & Reader Rights
              </h3>
              <p className="text-xs text-slate-500">Effective Date: October 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed font-sans-ui">
          <div>
            <h4 className="font-serif-editorial text-base font-bold text-slate-900 mb-1">
              1. Our Data Ethics Charter
            </h4>
            <p>
              At TechPulse Daily, we believe reader privacy is a fundamental civil right. We do not sell, rent, or monetize personal reader identifiers with third-party data brokers or behavioral advertising ad exchanges.
            </p>
          </div>

          <div>
            <h4 className="font-serif-editorial text-base font-bold text-slate-900 mb-1">
              2. Information We Collect
            </h4>
            <p>
              When you voluntarily subscribe to our "Stay Ahead of Tech" newsletter, we store your email address solely for dispatching editorial editions. You may unsubscribe at any moment with a single click.
            </p>
          </div>

          <div>
            <h4 className="font-serif-editorial text-base font-bold text-slate-900 mb-1">
              3. Telemetry & Local Storage
            </h4>
            <p>
              We avoid invasive surveillance trackers. Preferences such as bookmarks and read status are kept strictly in your local browser sandbox and never relayed to foreign tracking servers.
            </p>
          </div>

          <div>
            <h4 className="font-serif-editorial text-base font-bold text-slate-900 mb-1">
              4. Security Measures
            </h4>
            <p>
              All communication with TechPulse Daily is encrypted in transit via modern Transport Layer Security (TLS 1.3) with strict HTTP transport policies.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
