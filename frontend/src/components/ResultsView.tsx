import React from 'react';
import type { PredictionResult } from '../types';
import { RotateCcw, TrendingUp, Info, Shield } from 'lucide-react';

interface ResultsViewProps {
  result: PredictionResult;
  onReset: () => void;
  unitSystem: 'imperial' | 'metric';
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset, unitSystem }) => {
  const percentage = Math.min(Math.max(result.prediction, 2), 50);

  // Gauge needle rotation (-90 deg to +90 deg across 0% to 50%)
  const rotationDeg = -90 + (percentage / 50) * 180;

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Athletes':
      case 'Fitness':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Acceptable / Average':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Essential Fat':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Gauge Visualization */}
          <div className="relative w-64 h-36 flex flex-col items-center justify-end">
            <svg className="w-56 h-28 overflow-visible" viewBox="0 0 200 100">
              {/* Semi-circle background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Colored segments */}
              <path
                d="M 20 100 A 80 80 0 0 1 65 35"
                fill="none"
                stroke="#10B981"
                strokeWidth="16"
                strokeDasharray="4 2"
              />
              <path
                d="M 65 35 A 80 80 0 0 1 135 35"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="16"
                strokeDasharray="4 2"
              />
              <path
                d="M 135 35 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="16"
                strokeDasharray="4 2"
              />
              {/* Center pivot */}
              <circle cx="100" cy="100" r="7" fill="#1E293B" />
              {/* Needle pointer */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#1E293B"
                strokeWidth="3.5"
                strokeLinecap="round"
                transform={`rotate(${rotationDeg} 100 100)`}
                className="transition-transform duration-1000 ease-out"
              />
            </svg>
            <div className="text-center mt-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {result.prediction.toFixed(1)}%
              </span>
              <div className="text-xs text-slate-500 font-medium">Estimated Body Fat</div>
            </div>
          </div>

          {/* Result Narrative & Classification */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(result.category)}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ACE Reference Category: {result.category}</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Estimated Body Fat: <span className="text-blue-600">{result.prediction}%</span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Based on your specific anthropometric circumferences (notably an abdominal measurement of{' '}
              <strong className="text-slate-900">
                {unitSystem === 'metric'
                  ? `${result.input_summary.Abdomen} cm`
                  : `${(result.input_summary.Abdomen / 2.54).toFixed(1)} in`}
              </strong>{' '}
              and weight of{' '}
              <strong className="text-slate-900">
                {unitSystem === 'metric'
                  ? `${(result.input_summary.Weight * 0.453592).toFixed(1)} kg`
                  : `${result.input_summary.Weight} lbs`}
              </strong>
              ), the model calculates your body fat percentage to be approximately{' '}
              {result.prediction}%.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Model: <strong>{result.model}</strong>
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Algorithm: Ensemble Regression
              </span>
              <button
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Calculate Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Summary Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <span>Input Measurement Summary</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
          {Object.entries(result.input_summary).map(([key, val]) => {
            let displayVal = `${val} cm`;
            if (key === 'Age') displayVal = `${val} yrs`;
            else if (key === 'Weight') {
              displayVal =
                unitSystem === 'metric'
                  ? `${(val * 0.453592).toFixed(1)} kg`
                  : `${val} lbs`;
            } else if (key === 'Height') {
              displayVal =
                unitSystem === 'metric'
                  ? `${(val * 2.54).toFixed(1)} cm`
                  : `${val} in`;
            } else if (unitSystem === 'imperial') {
              displayVal = `${(val / 2.54).toFixed(1)} in`;
            }

            return (
              <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-slate-500">{key}</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{displayVal}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reference Category Breakdown (American Council on Exercise) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>American Council on Exercise (ACE) Reference Ranges (Men)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div className="font-bold text-emerald-800">Essential Fat</div>
            <div className="text-slate-600 mt-1">2% – 5%</div>
          </div>
          <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50">
            <div className="font-bold text-teal-800">Athletes</div>
            <div className="text-slate-600 mt-1">6% – 13%</div>
          </div>
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
            <div className="font-bold text-blue-800">Fitness</div>
            <div className="text-slate-600 mt-1">14% – 17%</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-300 bg-slate-100/50">
            <div className="font-bold text-slate-800">Average</div>
            <div className="text-slate-600 mt-1">18% – 24%</div>
          </div>
          <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
            <div className="font-bold text-rose-800">Higher Range</div>
            <div className="text-slate-600 mt-1">25%+</div>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
        <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Clinical Note:</strong> This calculation is an empirical machine-learning estimate based on anthropometric measurement patterns. It does not replace a multi-compartment laboratory test (such as DEXA or hydrostatic underwater weighing) and does not represent an isolated medical diagnosis.
        </p>
      </div>
    </div>
  );
};
