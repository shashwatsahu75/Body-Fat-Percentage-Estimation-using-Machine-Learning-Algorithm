import React, { useState } from 'react';
import type { BodyMeasurements, PredictionResult } from '../types';
import { predictBodyFat } from '../services/api';
import { ResultsView } from '../components/ResultsView';
import { Calculator, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export const PredictPage: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Form State in internal imperial/dataset units (lbs, inches, cm)
  const [formData, setFormData] = useState<BodyMeasurements>({
    Age: 28,
    Weight: 175.0, // lbs
    Height: 70.0,  // inches
    Neck: 38.0,    // cm
    Chest: 99.5,   // cm
    Abdomen: 88.0, // cm
    Hip: 99.0,     // cm
    Thigh: 59.0,   // cm
    Knee: 38.5,    // cm
    Ankle: 23.0,   // cm
    Biceps: 32.5,  // cm
    Forearm: 28.5, // cm
    Wrist: 18.2    // cm
  });

  const handleChange = (field: keyof BodyMeasurements, rawValue: string) => {
    const val = parseFloat(rawValue);
    if (isNaN(val)) return;

    let processedVal = val;
    if (unitSystem === 'metric') {
      if (field === 'Weight') processedVal = val * 2.20462;
      else if (field === 'Height') processedVal = val / 2.54;
      else processedVal = val;
    } else {
      if (field !== 'Age' && field !== 'Weight' && field !== 'Height') {
        processedVal = val * 2.54; // imperial inches to cm
      }
    }

    setFormData(prev => ({ ...prev, [field]: Number(processedVal.toFixed(2)) }));
  };

  const getDisplayValue = (field: keyof BodyMeasurements): string => {
    const stored = formData[field];
    if (unitSystem === 'metric') {
      if (field === 'Weight') return (stored * 0.453592).toFixed(1);
      if (field === 'Height') return (stored * 2.54).toFixed(1);
      return stored.toFixed(1);
    } else {
      if (field === 'Age' || field === 'Weight' || field === 'Height') return stored.toString();
      return (stored / 2.54).toFixed(1);
    }
  };

  const loadPreset = (preset: 'fit' | 'average' | 'athletic') => {
    if (preset === 'fit') {
      setFormData({
        Age: 25,
        Weight: 165.0,
        Height: 71.0,
        Neck: 37.5,
        Chest: 95.0,
        Abdomen: 81.5,
        Hip: 96.0,
        Thigh: 56.5,
        Knee: 37.5,
        Ankle: 22.5,
        Biceps: 32.0,
        Forearm: 28.0,
        Wrist: 17.8
      });
    } else if (preset === 'average') {
      setFormData({
        Age: 38,
        Weight: 185.0,
        Height: 69.5,
        Neck: 38.5,
        Chest: 102.0,
        Abdomen: 94.0,
        Hip: 101.5,
        Thigh: 60.5,
        Knee: 39.0,
        Ankle: 23.5,
        Biceps: 33.0,
        Forearm: 29.0,
        Wrist: 18.3
      });
    } else {
      setFormData({
        Age: 22,
        Weight: 173.0,
        Height: 72.0,
        Neck: 38.5,
        Chest: 93.6,
        Abdomen: 83.0,
        Hip: 98.7,
        Thigh: 58.7,
        Knee: 37.3,
        Ankle: 23.4,
        Biceps: 30.5,
        Forearm: 28.9,
        Wrist: 18.2
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (formData.Age < 10 || formData.Age > 110) {
        throw new Error('Age must be between 10 and 110 years.');
      }
      if (formData.Weight < 60 || formData.Weight > 450) {
        throw new Error('Weight must be within reasonable physiological range (60 - 450 lbs).');
      }
      if (formData.Height < 45 || formData.Height > 90) {
        throw new Error('Height must be within reasonable physiological range (45 - 90 inches).');
      }

      const res = await predictBodyFat(formData);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'An error occurred during estimation. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="py-8">
        <ResultsView
          result={result}
          onReset={() => setResult(null)}
          unitSystem={unitSystem}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Interactive Machine Learning Estimator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Enter Your Body Measurements
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Provide your circumferences recorded using standard anatomical tape measurements. Select your preferred measurement system below.
        </p>

        {/* Unit Selector Toggle */}
        <div className="mt-6 inline-flex p-1 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setUnitSystem('imperial')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              unitSystem === 'imperial'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Imperial (lbs, in)
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem('metric')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              unitSystem === 'metric'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metric (kg, cm)
          </button>
        </div>

        {/* Sample Presets */}
        <div className="mt-4 flex justify-center items-center space-x-2 text-xs text-slate-500">
          <span>Sample Profiles:</span>
          <button
            type="button"
            onClick={() => loadPreset('athletic')}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Athletic
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => loadPreset('fit')}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Fit
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => loadPreset('average')}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Average
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <div className="font-semibold">Inference Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Measurement Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8">
        {/* Section 1: Demographics & Core */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>1. Basic Body Metrics</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  required
                  value={formData.Age}
                  onChange={(e) => handleChange('Age', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">years</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  required
                  value={getDisplayValue('Weight')}
                  onChange={(e) => handleChange('Weight', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {unitSystem === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Height ({unitSystem === 'metric' ? 'cm' : 'inches'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  required
                  value={getDisplayValue('Height')}
                  onChange={(e) => handleChange('Height', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {unitSystem === 'metric' ? 'cm' : 'in'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Circumferences */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>2. Torso Circumferences ({unitSystem === 'metric' ? 'cm' : 'inches'})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Abdomen (Belly Button)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={getDisplayValue('Abdomen')}
                  onChange={(e) => handleChange('Abdomen', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-blue-600 font-medium">
                  {unitSystem === 'metric' ? 'cm' : 'in'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">Strongest single ML predictor</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chest</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={getDisplayValue('Chest')}
                  onChange={(e) => handleChange('Chest', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {unitSystem === 'metric' ? 'cm' : 'in'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hip (Max)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={getDisplayValue('Hip')}
                  onChange={(e) => handleChange('Hip', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {unitSystem === 'metric' ? 'cm' : 'in'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Neck</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={getDisplayValue('Neck')}
                  onChange={(e) => handleChange('Neck', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {unitSystem === 'metric' ? 'cm' : 'in'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Extremity Circumferences */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            <span>3. Extremity Circumferences ({unitSystem === 'metric' ? 'cm' : 'inches'})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Thigh</label>
              <input
                type="number"
                step="0.1"
                required
                value={getDisplayValue('Thigh')}
                onChange={(e) => handleChange('Thigh', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Knee</label>
              <input
                type="number"
                step="0.1"
                required
                value={getDisplayValue('Knee')}
                onChange={(e) => handleChange('Knee', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ankle</label>
              <input
                type="number"
                step="0.1"
                required
                value={getDisplayValue('Ankle')}
                onChange={(e) => handleChange('Ankle', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Biceps</label>
              <input
                type="number"
                step="0.1"
                required
                value={getDisplayValue('Biceps')}
                onChange={(e) => handleChange('Biceps', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Forearm</label>
              <input
                type="number"
                step="0.1"
                required
                value={getDisplayValue('Forearm')}
                onChange={(e) => handleChange('Forearm', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wrist</label>
              <input
                type="number"
                step="0.1"
                required
                value={getDisplayValue('Wrist')}
                onChange={(e) => handleChange('Wrist', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running ML Inference...</span>
              </>
            ) : (
              <>
                <span>Calculate Body Fat Percentage</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
