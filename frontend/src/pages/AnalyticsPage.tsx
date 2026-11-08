import React, { useEffect, useState } from 'react';
import type { AnalyticsData } from '../types';
import { fetchAnalytics } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { BarChart2, CheckCircle2, TrendingUp, AlertCircle, RefreshCw, Cpu, Layers } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load model evaluation metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-slate-600 font-medium">Loading genuine ML model evaluation results...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Analytics Unavailable</h2>
        <p className="text-sm text-slate-600">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const modelBarData = data.all_models.map(m => ({
    name: m.model.replace(' Regressor', '').replace(' Regression', ''),
    fullName: m.model,
    test_r2: m.test_r2,
    rmse: m.rmse,
    mae: m.mae
  }));

  const featureImpData = data.best_model.feature_importance
    ? Object.entries(data.best_model.feature_importance)
        .map(([feature, importance]) => ({ feature, importance }))
        .sort((a, b) => b.importance - a.importance)
    : [];

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Empirical Model Evaluation Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Algorithm Performance & Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real metrics calculated from 5-fold cross-validation and 20% holdout testing on the body fat dataset.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Selected Best Model</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 truncate">
            {data.best_model.name}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Best Generalization & Test R²</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Holdout Test R² Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {data.best_model.metrics.test_r2.toFixed(4)}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            CV Mean: {data.best_model.metrics.cv_r2_mean.toFixed(4)} (±{data.best_model.metrics.cv_r2_std.toFixed(3)})
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Mean Absolute Error</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {data.best_model.metrics.mae.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            RMSE: {data.best_model.metrics.rmse.toFixed(2)}% Body Fat
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Dataset Dimensions</span>
            <BarChart2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {data.dataset_summary.total_records}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            {data.dataset_summary.num_features} Features • Target: {data.dataset_summary.target}
          </div>
        </div>
      </div>

      {/* Model Comparison Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Algorithm Comparison (Holdout Test R² Score)</h3>
            <p className="text-xs text-slate-500">Higher R² indicates superior variance explanation on unobserved test subjects.</p>
          </div>
        </div>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelBarData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize: 11, fill: '#475569' }} interval={0} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                formatter={(val: any) => [val, 'Test R²']}
                labelFormatter={(lbl) => `Model: ${lbl}`}
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
              />
              <Bar dataKey="test_r2" radius={[6, 6, 0, 0]}>
                {modelBarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fullName === data.best_model.name ? '#2563EB' : '#94A3B8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Feature Importance & Actual vs Predicted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Importance / Coefficients */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Feature Importance ({data.best_model.name})
            </h3>
            <p className="text-xs text-slate-500">Normalized contribution of each anthropometric feature to model decisions.</p>
          </div>

          <div className="space-y-3 pt-2">
            {featureImpData.map(({ feature, importance }) => (
              <div key={feature}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{feature}</span>
                  <span className="text-blue-600">{importance.toFixed(3)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (importance / (featureImpData[0]?.importance || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actual vs Predicted Scatter */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Actual vs. Predicted Body Fat (%)</h3>
            <p className="text-xs text-slate-500">Evaluating 51 holdout test predictions against ground-truth hydrostatic measurements.</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" dataKey="actual" name="Actual %" unit="%" domain={[0, 45]} tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="predicted" name="Predicted %" unit="%" domain={[0, 45]} tick={{ fontSize: 11 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
                <Scatter name="Test Subjects" data={data.actual_vs_predicted} fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-slate-500">
            Points clustered along the diagonal represent high estimation concordance.
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Complete Model Evaluation Benchmark Table</h3>
          <p className="text-xs text-slate-500">Evaluated uniformly under identical 5-fold cross-validation and random seeds.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Algorithm</th>
                <th className="px-6 py-3.5">CV R² (Mean ± Std)</th>
                <th className="px-6 py-3.5">Train R²</th>
                <th className="px-6 py-3.5">Test R²</th>
                <th className="px-6 py-3.5">MAE (%)</th>
                <th className="px-6 py-3.5">RMSE (%)</th>
                <th className="px-6 py-3.5">Overfit Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.all_models.map((m) => {
                const isBest = m.model === data.best_model.name;
                return (
                  <tr key={m.model} className={isBest ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50/50'}>
                    <td className="px-6 py-3.5 flex items-center space-x-2">
                      {isBest && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                      <span className={isBest ? 'text-blue-900 font-bold' : 'text-slate-900'}>{m.model}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {m.cv_r2_mean.toFixed(4)} <span className="text-[10px] text-slate-400">±{m.cv_r2_std.toFixed(3)}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{m.train_r2.toFixed(4)}</td>
                    <td className="px-6 py-3.5 text-slate-900 font-bold">{m.test_r2.toFixed(4)}</td>
                    <td className="px-6 py-3.5 text-slate-600">{m.mae.toFixed(2)}</td>
                    <td className="px-6 py-3.5 text-slate-600">{m.rmse.toFixed(2)}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.overfit_gap < 0.25
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.overfit_gap.toFixed(4)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
