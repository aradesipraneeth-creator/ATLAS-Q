import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import LiveAnalysisPage from './pages/LiveAnalysisPage';
import StormTrackingPage from './pages/StormTrackingPage';
import RiskMapPage from './pages/RiskMapPage';
import SystemArchitecturePage from './pages/SystemArchitecturePage';
import AboutPage from './pages/AboutPage';
import StormDetailModal from './components/StormDetailModal';
import { fetchHealth, fetchDashboard, fetchStorms, fetchRiskAnalysis, fetchArchitecture } from './services/api';
import { Loader2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemOnline, setSystemOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [stormsData, setStormsData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [archData, setArchData] = useState(null);

  // Selected storm for trajectory and inspection
  const [selectedStorm, setSelectedStorm] = useState(null);
  const [modalStorm, setModalStorm] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify API health first
      const health = await fetchHealth();
      if (health.status === 'ok') {
        setSystemOnline(true);
      }

      // Fetch all endpoints concurrently
      const [dash, storms, risk, arch] = await Promise.all([
        fetchDashboard(),
        fetchStorms(),
        fetchRiskAnalysis(),
        fetchArchitecture()
      ]);

      setDashboardData(dash);
      setStormsData(storms);
      setRiskData(risk);
      setArchData(arch);

      // Default selected storm to the highest intensity one
      if (storms?.storms?.length > 0) {
        setSelectedStorm(storms.storms[0]);
      }
    } catch (err) {
      console.error('Failed to load ATLAS-Q API data:', err);
      setError(err.message || 'Unable to connect to ATLAS-Q backend service');
      setSystemOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* Global Application Header */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          systemOnline={systemOnline}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading && !dashboardData ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600">
                Initializing ATLAS-Q Multimodal Sensor Feeds & AI Engine...
              </p>
            </div>
          ) : error && !dashboardData ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-red-900 mb-1">Backend Connection Error</h3>
              <p className="text-xs text-red-700 mb-4">{error}</p>
              <button
                onClick={loadAllData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 shadow-xs transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : (
            <div>
              {activeTab === 'dashboard' && (
                <DashboardPage
                  dashboardData={dashboardData}
                  stormsData={stormsData}
                  riskData={riskData}
                  archData={archData}
                  selectedStorm={selectedStorm}
                  setSelectedStorm={setSelectedStorm}
                  onOpenStormModal={(storm) => setModalStorm(storm)}
                />
              )}

              {activeTab === 'live-analysis' && (
                <LiveAnalysisPage
                  stormsData={stormsData}
                  archData={archData}
                  selectedStorm={selectedStorm}
                  setSelectedStorm={setSelectedStorm}
                  onOpenStormModal={(storm) => setModalStorm(storm)}
                />
              )}

              {activeTab === 'storm-tracking' && (
                <StormTrackingPage
                  stormsData={stormsData}
                  selectedStorm={selectedStorm}
                  setSelectedStorm={setSelectedStorm}
                />
              )}

              {activeTab === 'risk-map' && (
                <RiskMapPage
                  riskData={riskData}
                  stormsData={stormsData}
                />
              )}

              {activeTab === 'architecture' && (
                <SystemArchitecturePage
                  archData={archData}
                />
              )}

              {activeTab === 'about' && (
                <AboutPage />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {modalStorm && (
        <StormDetailModal
          storm={modalStorm}
          onClose={() => setModalStorm(null)}
          onSelectForTracking={(storm) => {
            setSelectedStorm(storm);
            setActiveTab('storm-tracking');
          }}
        />
      )}

      {/* Global Scientific Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div>
              <span className="font-bold text-slate-800 font-mono">ATLAS-Q</span>
              <span className="mx-2">•</span>
              <span>SIH 2026 Problem Statement PS 26072</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
              Phase 1 Prototype Demo
            </span>
            <span>FastAPI Backend + React Frontend</span>
            <span>Render Deployable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
