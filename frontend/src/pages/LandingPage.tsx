import React from 'react';
import { ArrowRight, BarChart, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onStartPredicting: () => void;
  onExploreAnalytics: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPredicting, onExploreAnalytics }) => {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Production Machine Learning Architecture</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Understand Your Body. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Estimate Your Body Fat.
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Hydrostatic underwater weighing and DEXA scans are costly and inaccessible. Our machine learning system calculates accurate continuous body fat percentage from non-invasive anthropometric body circumferences.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={onStartPredicting}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Estimate My Body Fat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onExploreAnalytics}
                  className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
                >
                  <span>Explore ML Insights</span>
                  <BarChart className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl font-bold text-slate-900">10 Models</div>
                  <div className="text-xs text-slate-500 font-medium">Evaluated & Compared</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">0.678 R²</div>
                  <div className="text-xs text-slate-500 font-medium">Extra Trees Test Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">3.12% MAE</div>
                  <div className="text-xs text-slate-500 font-medium">Mean Absolute Error</div>
                </div>
              </div>
            </div>

            {/* Custom SVG Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Anthropometric Pipeline</span>
                </div>

                <div className="space-y-4">
                  {/* Visual SVG diagram */}
                  <svg className="w-full h-48 mx-auto" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="20" width="80" height="140" rx="12" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                    <text x="50" y="45" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">Input Features</text>
                    <text x="50" y="65" textAnchor="middle" fill="#64748B" fontSize="8">Abdomen (cm)</text>
                    <text x="50" y="85" textAnchor="middle" fill="#64748B" fontSize="8">Chest / Hip</text>
                    <text x="50" y="105" textAnchor="middle" fill="#64748B" fontSize="8">Weight & Height</text>
                    <text x="50" y="125" textAnchor="middle" fill="#64748B" fontSize="8">Circumferences</text>

                    {/* Arrow 1 */}
                    <path d="M100 90 H130" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />
                    <polygon points="130,87 136,90 130,93" fill="#3B82F6" />

                    {/* Preprocessing */}
                    <rect x="140" y="45" width="80" height="90" rx="12" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
                    <text x="180" y="75" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">Ensemble</text>
                    <text x="180" y="92" textAnchor="middle" fill="#2563EB" fontSize="8">Extra Trees</text>
                    <text x="180" y="108" textAnchor="middle" fill="#60A5FA" fontSize="8">Random Forest</text>

                    {/* Arrow 2 */}
                    <path d="M225 90 H245" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />
                    <polygon points="245,87 251,90 245,93" fill="#3B82F6" />

                    {/* Prediction Output */}
                    <rect x="255" y="55" width="55" height="70" rx="10" fill="#ECFDF5" stroke="#6EE7B7" strokeWidth="1.5" />
                    <text x="282" y="82" textAnchor="middle" fill="#065F46" fontSize="9" fontWeight="bold">BodyFat %</text>
                    <text x="282" y="104" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="bold">18.4%</text>
                  </svg>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border border-slate-200/60">
                    <span>Target Variable</span>
                    <span className="font-semibold text-slate-900">Siri Body Fat % (Continuous)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Simple & Reliable</h2>
          <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">How the Estimation Works</p>
          <p className="mt-4 text-slate-600">Three streamlined steps from raw body measurements to machine-learning insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Measure Circumferences</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Input circumference values recorded using a flexible tape measure across standard anatomical reference points including abdomen, chest, neck, and limbs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mb-6">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Regression Inference</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The FastAPI backend feeds your normalized measurements to our cross-validated Extra Trees regression pipeline, avoiding data leakage and synthetic biases.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg mb-6">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Clinical Context & Visuals</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Receive your predicted body fat percentage alongside reference physiological categories, personalized explanations, and model confidence metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-slate-100/70 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Engineered for Accuracy</h2>
              <p className="mt-2 text-3xl font-bold text-slate-900">Why Anthropometric ML Outperforms Basic BMI</p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Standard Body Mass Index (BMI) only takes weight and height into account, treating muscular athletes as overweight and failing to measure visceral adipose tissue. Our regression models leverage targeted abdominal and circumference ratios.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Zero Data Leakage</h4>
                    <p className="text-xs text-slate-500">Body density calculated via hydrostatic weighing was strictly omitted from feature inputs to preserve true real-world utility.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Dual Metric / Imperial Support</h4>
                    <p className="text-xs text-slate-500">Seamless unit toggle for weight (lbs/kg), height (in/cm), and circumferences (cm/in) with zero precision degradation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Cross-Validated Generalization</h4>
                    <p className="text-xs text-slate-500">Models evaluated with 5-fold cross-validation and independent 20% hold-out test set to avoid synthetic overfit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4">Top Predictor Features (Correlation)</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Abdomen Circumference</span>
                    <span className="text-blue-600">+0.81</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Chest Circumference</span>
                    <span className="text-blue-600">+0.70</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Hip Circumference</span>
                    <span className="text-blue-600">+0.63</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '63%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Total Body Weight</span>
                    <span className="text-blue-600">+0.61</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '61%' }}></div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500 italic">
                Abdominal circumference is universally established as the single strongest anthropometric proxy for central adiposity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 mt-2">Clear answers to common questions about body fat estimation.</p>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h4 className="text-base font-semibold text-slate-900 mb-2">Is this a medical diagnosis?</h4>
            <p className="text-sm text-slate-600">
              No. This application provides a statistical regression estimate based on population body measurement datasets. It is not intended to substitute for clinical DEXA scans or professional physician evaluations.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h4 className="text-base font-semibold text-slate-900 mb-2">Why is Body Density excluded from the inputs?</h4>
            <p className="text-sm text-slate-600">
              In laboratory settings, body fat is mathematically calculated directly from body density using Siri’s equation. Using body density as an input feature creates near-100% data leakage and makes the model useless for ordinary users at home who only have a tape measure.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h4 className="text-base font-semibold text-slate-900 mb-2">How should measurements be taken?</h4>
            <p className="text-sm text-slate-600">
              Use a standard flexible measuring tape pulled flat against bare skin without compressing the tissue. For the abdomen, measure horizontally at the level of the umbilicus (belly button) at the end of a normal exhalation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-10 sm:p-14 text-center shadow-xl">
          <h3 className="text-3xl font-bold tracking-tight mb-4">Ready to calculate your body fat percentage?</h3>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Get an instant, data-backed estimate using our trained Extra Trees Regressor model right now.
          </p>
          <button
            onClick={onStartPredicting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            Launch Prediction Form
          </button>
        </div>
      </section>
    </div>
  );
};
