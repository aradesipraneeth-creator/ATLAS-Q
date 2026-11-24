import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CommandCenterPage from './pages/CommandCenterPage';
import ForecastIntelligencePage from './pages/ForecastIntelligencePage';
import DisasterManagementPage from './pages/DisasterManagementPage';
import AboutPage from './pages/AboutPage';
import StormDetailModal from './components/StormDetailModal';
import ScenarioModal from './components/ScenarioModal';
import { fetchHealth, fetchDashboard, fetchStorms, fetchRiskAnalysis } from './services/api';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
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

  const alertsCount = riskData?.active_alerts?.length || 3;

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
                initializing atlas-q disaster intelligence platform...
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
              {/* PAGE 01: COMMAND CENTER */}
              {(activeTab === 'command-center' || activeTab === 'overview') && (
                <CommandCenterPage
                  dashboardData={dashboardData}
                  stormsData={stormsData}
                  riskData={riskData}
                  selectedStorm={selectedStorm}
                  setSelectedStorm={setSelectedStorm}
                  onOpenStormModal={(storm) => setModalStorm(storm)}
                  onNavigateToForecast={() => setActiveTab('forecast-intelligence')}
                  onNavigateToDisaster={() => setActiveTab('disaster-management')}
                  onLaunchSimulation={() => setIsScenarioOpen(true)}
                />
              )}

              {/* PAGE 02: FORECAST INTELLIGENCE */}
              {(activeTab === 'forecast-intelligence' || activeTab === 'live-radar' || activeTab === 'storm-tracking' || activeTab === 'lightning') && (
                <ForecastIntelligencePage />
              )}

              {/* PAGE 03: DISASTER MANAGEMENT */}
              {(activeTab === 'disaster-management' || activeTab === 'risk-intelligence' || activeTab === 'ai-optimization') && (
                <DisasterManagementPage />
              )}

              {/* PAGE 04: ABOUT ATLAS-Q */}
              {(activeTab === 'about' || activeTab === 'data-sources' || activeTab === 'reports' || activeTab === 'settings') && (
                <AboutPage />
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
            setActiveTab('forecast-intelligence');
          }}
        />
      )}

      {/* Editorial Berry Footer */}
      <footer className="mt-16 bg-[#A51F52] text-white rounded-t-[2.5rem] sm:rounded-t-[3.5rem] pt-12 pb-8 px-6 sm:px-12 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/20">
            {/* Left Headline */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#F4E3E6] font-bold block">
                SIH 2026 • PS 26072
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter font-headline lowercase">
                atmospheric intelligence.<br />
                disaster preparedness.<br />
                smarter decisions.
              </h2>
              <p className="text-xs text-[#F4E3E6] leading-relaxed max-w-sm">
                AI-powered platform for severe thunderstorm nowcasting, tropical cyclone track forecasting, multi-hazard risk assessment, and quantum-inspired disaster response optimization.
              </p>
            </div>

            {/* Middle: 4 Primary Destinations Navigation */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F4E3E6] block mb-2">
                  Operations
                </span>
                <ul className="space-y-2 text-[#FFF3F0]">
                  <li>
                    <button onClick={() => setActiveTab('command-center')} className="hover:underline">
                      01 — Command Center
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('forecast-intelligence')} className="hover:underline">
                      02 — Forecast Intelligence
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F4E3E6] block mb-2">
                  Decision Support
                </span>
                <ul className="space-y-2 text-[#FFF3F0]">
                  <li>
                    <button onClick={() => setActiveTab('disaster-management')} className="hover:underline">
                      03 — Disaster Management
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('about')} className="hover:underline">
                      04 — About ATLAS-Q
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Operational Status */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F4E3E6] block">
                Operational Framework
              </span>
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                <span className="text-white font-bold block">National Cyclone Protocol</span>
                <span className="text-white/80 block text-[11px]">IMD RSMC New Delhi Standard Guidelines & NDMA Disaster Matrix</span>
              </div>
              <p className="text-[10px] text-white/70">
                Data sources: INSAT-3D/3DR, DWR S-Band Radars, Ground Lightning Network, Open-Meteo.
              </p>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F4E3E6] gap-3">
            <span>© 2026 ATLAS-Q Meteorological & Disaster Intelligence Platform. All rights reserved.</span>
            <span className="text-center sm:text-right font-mono">
              STATUS: READY FOR SIH 2026 EVALUATION
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
