import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewPage from './pages/OverviewPage';
import LiveRadarPage from './pages/LiveRadarPage';
import StormTrackingPage from './pages/StormTrackingPage';
import LightningPage from './pages/LightningPage';
import RiskIntelligencePage from './pages/RiskIntelligencePage';
import OptimizationPage from './pages/OptimizationPage';
import DataSourcesPage from './pages/DataSourcesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import StormDetailModal from './components/StormDetailModal';
import ScenarioModal from './components/ScenarioModal';
import { fetchHealth, fetchDashboard, fetchStorms, fetchRiskAnalysis } from './services/api';
import { Loader2, AlertCircle, RefreshCw, Zap, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemOnline, setSystemOnline] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data States
  const [dashboardData, setDashboardData] = useState(null);
  const [stormsData, setStormsData] = useState(null);
  const [riskData, setRiskData] = useState(null);

  // Modal States
  const [selectedStorm, setSelectedStorm] = useState(null);
  const [modalStorm, setModalStorm] = useState(null);
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify health
      const health = await fetchHealth();
      if (health.status === 'ok') {
        setSystemOnline(true);
      }

      // Fetch overview streams concurrently
      const [dash, storms, risk] = await Promise.all([
        fetchDashboard(),
        fetchStorms(),
        fetchRiskAnalysis()
      ]);

      setDashboardData(dash);
      setStormsData(storms);
      setRiskData(risk);

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

  const alertsCount = riskData?.active_alerts?.length || 2;

  return (
    <div className="min-h-screen bg-[#FFF3F0] text-[#28191D] font-sans flex flex-col justify-between selection:bg-[#A51F52] selection:text-white">
      <div>
        {/* Global Editorial Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          systemOnline={systemOnline}
          alertsCount={alertsCount}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
          onLaunchDemo={() => setIsScenarioOpen(true)}
        />

        {/* Main Application Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading && !dashboardData ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <Loader2 className="w-8 h-8 text-[#A51F52] animate-spin" />
              <p className="text-sm font-headline font-bold text-[#28191D] lowercase">
                initializing atlas-q meteorological intelligence...
              </p>
            </div>
          ) : error && !dashboardData ? (
            <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-[2rem] p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
              <AlertCircle className="w-10 h-10 text-[#A51F52] mx-auto mb-3" />
              <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase mb-1">
                gateway connection error
              </h3>
              <p className="text-xs text-[#735E60] mb-5">{error}</p>
              <button
                onClick={loadAllData}
                className="px-6 py-2.5 bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] rounded-full text-xs font-bold inline-flex items-center space-x-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && (
                <OverviewPage
                  dashboardData={dashboardData}
                  stormsData={stormsData}
                  riskData={riskData}
                  selectedStorm={selectedStorm}
                  setSelectedStorm={setSelectedStorm}
                  onOpenStormModal={(storm) => setModalStorm(storm)}
                  onExploreLive={() => setActiveTab('live-radar')}
                  onLaunchSimulation={() => setIsScenarioOpen(true)}
                />
              )}

              {activeTab === 'live-radar' && (
                <LiveRadarPage
                  onSelectStorm={(storm) => setSelectedStorm(storm)}
                  onOpenModal={(storm) => setModalStorm(storm)}
                />
              )}

              {activeTab === 'storm-tracking' && (
                <StormTrackingPage
                  stormsData={stormsData}
                />
              )}

              {activeTab === 'lightning' && (
                <LightningPage />
              )}

              {activeTab === 'risk-intelligence' && (
                <RiskIntelligencePage />
              )}

              {activeTab === 'ai-optimization' && (
                <OptimizationPage />
              )}

              {activeTab === 'data-sources' && (
                <DataSourcesPage />
              )}

              {activeTab === 'reports' && (
                <ReportsPage />
              )}

              {activeTab === 'settings' && (
                <SettingsPage />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Scenario Demonstration Player Modal */}
      <ScenarioModal
        isOpen={isScenarioOpen}
        onClose={() => setIsScenarioOpen(false)}
      />

      {/* Storm Detail Inspection Modal */}
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

      {/* Editorial Berry Footer (Inspired by reference bakery website 'come and visit' block) */}
      <footer className="mt-16 bg-[#A51F52] text-white rounded-t-[2.5rem] sm:rounded-t-[3.5rem] pt-12 pb-8 px-6 sm:px-12 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/20">
            {/* Left Headline */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#F4E3E6] font-bold block">
                SIH 2026 • PS 26072
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter font-headline lowercase">
                understand storms.<br />
                before they strike.
              </h2>
              <p className="text-xs text-[#F4E3E6] leading-relaxed max-w-sm">
                Autonomous AI-powered thunderstorm intelligence and multimodal nowcasting platform engineered for national disaster preparedness and aviation safety.
              </p>
            </div>

            {/* Middle: Navigation shortcuts */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F4E3E6] block mb-2">
                  Intelligence
                </span>
                <ul className="space-y-1.5 text-[#FFF3F0]">
                  <li><button onClick={() => setActiveTab('overview')} className="hover:underline">Overview</button></li>
                  <li><button onClick={() => setActiveTab('live-radar')} className="hover:underline">Live Radar (DWR)</button></li>
                  <li><button onClick={() => setActiveTab('storm-tracking')} className="hover:underline">Storm Tracking</button></li>
                  <li><button onClick={() => setActiveTab('lightning')} className="hover:underline">Lightning Density</button></li>
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F4E3E6] block mb-2">
                  Analytics
                </span>
                <ul className="space-y-1.5 text-[#FFF3F0]">
                  <li><button onClick={() => setActiveTab('risk-intelligence')} className="hover:underline">Risk Intelligence</button></li>
                  <li><button onClick={() => setActiveTab('ai-optimization')} className="hover:underline">QIO Optimization</button></li>
                  <li><button onClick={() => setActiveTab('data-sources')} className="hover:underline">Data Provenance</button></li>
                  <li><button onClick={() => setActiveTab('reports')} className="hover:underline">Incident Reports</button></li>
                </ul>
              </div>
            </div>

            {/* Right: Technical specifications */}
            <div className="md:col-span-3 text-xs space-y-2 text-[#F4E3E6]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1">
                Architecture Spec
              </span>
              <p className="text-[11px] leading-relaxed">
                FastAPI Python Backend + React 18 SPA + Render Single-Service Deployment.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsScenarioOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#D3E4B7] text-[#28191D] font-bold text-xs inline-flex items-center space-x-1.5 hover:bg-[#c2d7a2] transition shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 fill-[#28191D]" />
                  <span>Launch Simulation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Micro Footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F4E3E6] gap-2">
            <div>
              &copy; {new Date().getFullYear()} ATLAS-Q • Atmospheric Thunderstorm & Lightning Analysis System
            </div>
            <div className="flex items-center space-x-3 font-mono">
              <span>Status: NOMINAL</span>
              <span>•</span>
              <span>Render Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
