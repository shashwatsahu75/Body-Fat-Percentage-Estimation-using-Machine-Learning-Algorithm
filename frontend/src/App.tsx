import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { PredictPage } from './pages/PredictPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { fetchHealth } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'predict' | 'analytics' | 'methodology'>('landing');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetchHealth();
        setBackendOnline(res.status === 'healthy');
      } catch {
        setBackendOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'landing' && (
          <LandingPage
            onStartPredicting={() => setActiveTab('predict')}
            onExploreAnalytics={() => setActiveTab('analytics')}
          />
        )}
        {activeTab === 'predict' && <PredictPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'methodology' && <MethodologyPage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
