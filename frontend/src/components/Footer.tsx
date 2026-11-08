import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">AuraFit ML</span>
              <span className="text-xs text-slate-500 block">Body Fat Percentage Estimation</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 max-w-md">
            Production-grade Machine Learning regression engine. Developed for educational and personal health analytics.
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} AuraFit ML. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
