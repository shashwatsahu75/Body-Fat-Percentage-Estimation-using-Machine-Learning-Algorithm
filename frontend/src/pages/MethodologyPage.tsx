import React from 'react';
import { BookOpen, ShieldAlert, Award, CheckCircle } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12 animate-fadeIn text-left">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scientific & Algorithmic Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Machine Learning Methodology & Dataset Architecture
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Detailed breakdown of data collection, preprocessing pipelines, model selection criteria, and physiological estimation boundaries.
        </p>
      </div>

      {/* Section 1: Clinical Background */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
          <span>What is Body Fat Percentage & Why Circumferences?</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            Body Fat Percentage is the proportion of total body mass composed of adipose tissue relative to lean mass (skeletal muscle, bone mineral content, organs, and intracellular water). Unlike standard Body Mass Index (BMI), which only evaluates gross weight relative to stature squared, body fat estimation isolates structural composition.
          </p>
          <p>
            In clinical exercise physiology and epidemiological research, body density is historically captured via underwater hydrostatic weighing using Archimedes’ principle, from which percentage fat is derived using the standard <strong>Siri Equation</strong>:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-blue-800 border border-slate-200">
            % Body Fat = (495 / Body Density) - 450
          </div>
          <p>
            Because hydrostatic tanks and dual-energy x-ray absorptiometry (DEXA) are prohibitive in everyday settings, machine learning models trained on precise circumference metrics allow consumers and clinicians to approximate true adiposity with low error rates.
          </p>
        </div>
      </section>

      {/* Section 2: Data Leakage Prevention */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
          <span>Dataset Integrity & Prevention of Data Leakage</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600 space-y-4 leading-relaxed">
          <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wide">Critical Feature Selection Decision</h4>
              <p className="text-xs mt-1">
                The uploaded <code>bodyfat.csv</code> dataset includes a <code>Density</code> column which exhibits an artificial -0.988 linear correlation with <code>BodyFat</code> due to Siri’s deterministic formula.
              </p>
            </div>
          </div>
          <p>
            If <code>Density</code> were provided as an input feature, machine learning algorithms would trivially discover the linear inverse relationship, yielding an artificial R² ≈ 0.99 that is completely useless in real-world scenarios where users cannot calculate their own body density.
          </p>
          <p>
            We strictly drop <code>Density</code> from model features, forcing the regression models to generalize purely based on observable physical measurements: <em>Age, Weight, Height, Neck, Chest, Abdomen, Hip, Thigh, Knee, Ankle, Biceps, Forearm, and Wrist</em>.
          </p>
        </div>
      </section>

      {/* Section 3: Algorithms Evaluated */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">3</span>
          <span>Algorithms Evaluated & Model Selection</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>We trained and rigorously benchmarked 10 distinct regression algorithms under identical cross-validation splits:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Linear Regression (Baseline OLS)</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Ridge Regression (L2 Regularization)</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Lasso Regression (L1 Sparsity)</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>4. Decision Tree Regressor</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>5. Random Forest Regressor</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>6. Gradient Boosting Regressor</span>
            </li>
            <li className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 flex items-center space-x-2 text-blue-900 font-bold">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>7. Extra Trees Regressor (Selected Best)</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>8. Support Vector Regression (SVR - RBF Kernel)</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>9. K-Nearest Neighbors Regressor</span>
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>10. XGBoost Regressor</span>
            </li>
          </ul>
          <p className="pt-2">
            <strong>Why Extra Trees Regressor?</strong> Extremely Randomized Trees randomize both feature selection and cut-point thresholds during splits, reducing variance more aggressively than standard Random Forest on collinear anthropometric dimensions. It achieved the highest test R² = 0.6784 and the lowest holdout test Root Mean Squared Error (3.868%).
          </p>
        </div>
      </section>

      {/* Section 4: Limitations & Guidelines */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">4</span>
          <span>Project Scope & Limitations</span>
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600 space-y-3 leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Demographic Representation:</strong> The primary dataset consists of 252 adult male subjects. Consequently, the regression surface is calibrated for male fat distribution (visceral and android distribution). Predictions for female physiology will exhibit higher uncertainty due to gynoid fat deposition patterns.
            </li>
            <li>
              <strong>Measurement Error:</strong> Circumference results are sensitive to tape placement tension and respiration phase. For optimal precision, measure relaxed after exhalation without pulling the tape tightly enough to indent the dermal tissue.
            </li>
            <li>
              <strong>Non-Medical Utility:</strong> This application is engineered for educational, tracking, and fitness assessment purposes. Consult certified healthcare providers for formal clinical health diagnostics.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
