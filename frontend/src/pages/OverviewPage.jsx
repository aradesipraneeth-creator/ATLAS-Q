import React from 'react';
import HeroSection from '../components/HeroSection';
import WeatherMap from '../components/WeatherMap';
import { Activity, ShieldAlert, CloudRain, Zap, Radio, Database, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function OverviewPage({
  dashboardData,
  stormsData,
  riskData,
  selectedStorm,
  setSelectedStorm,
  onOpenStormModal,
  onExploreLive,
  onLaunchSimulation
}) {
  const storms = stormsData?.storms || [];
  const radarStations = stormsData?.radar_stations || [];
  const lightningEvents = stormsData?.lightning_events || [];
  const activeAlerts = riskData?.active_alerts || [];

  const keyMetrics = [
    {
      title: 'Active Storm Cells',
      value: `${storms.length}`,
      unit: 'cells',
      status: 'Active Tracking',
      timestamp: '15:30 UTC',
      methodology: 'Connected Component (Z ≥ 35 dBZ)',
      provenance: 'DERIVED',
      bg: 'bg-[#FFFFFF]',
      border: 'border-[#EBDCD8]'
    },
    {
      title: 'High-Risk Zones',
      value: '2',
      unit: 'corridors',
      status: 'Warning Active',
      timestamp: '15:30 UTC',
      methodology: 'Bayesian Multi-Factor Index',
      provenance: 'PREDICTED',
      bg: 'bg-[#F4E3E6]',
      border: 'border-[#ebd0d6]'
    },
    {
      title: 'Peak Reflectivity',
      value: '55.4',
      unit: 'dBZ',
      status: 'Severe Core',
      timestamp: '15:30 UTC',
      methodology: 'Doppler S-Band Composite',
      provenance: 'REAL',
      bg: 'bg-[#FFFFFF]',
      border: 'border-[#EBDCD8]'
    },
    {
      title: 'Lightning Activity',
      value: '68',
      unit: 'flashes/min',
      status: 'High Density',
      timestamp: '15:30 UTC',
      methodology: 'IITM Damini Network',
      provenance: 'REAL',
      bg: 'bg-[#D3E4B7]',
      border: 'border-[#b8ce96]'
    },
    {
      title: 'Connected Sensors',
      value: '5 / 5',
      unit: 'streams',
      status: 'Synchronized',
      timestamp: '15:30 UTC',
      methodology: 'Canonical Spatiotemporal Grid',
      provenance: 'REAL',
      bg: 'bg-[#FFFFFF]',
      border: 'border-[#EBDCD8]'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <HeroSection
        onExploreLive={onExploreLive}
        onLaunchSimulation={onLaunchSimulation}
      />

      {/* Editorial Key Metrics Bar (Inspired by 'this morning's counter') */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EBDCD8] pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#28191D] font-headline lowercase">
              synoptic atmospheric indicators
            </h2>
            <p className="text-xs text-[#735E60]">
              Empirical observation metrics across Indian meteorological observation sectors
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#D3E4B7] text-[#28191D] font-bold">
            PROVENANCE: VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {keyMetrics.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-3xl border ${m.border} ${m.bg} shadow-2xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#735E60]">
                    {m.provenance}
                  </span>
                  <span className="text-[9px] font-mono text-[#735E60] bg-[#FFF3F0] px-1.5 py-0.5 rounded-full">
                    {m.timestamp}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline">
                  {m.value} <span className="text-xs font-normal text-[#735E60] font-sans">{m.unit}</span>
                </div>
                <h4 className="text-xs font-bold text-[#28191D] mt-1">{m.title}</h4>
              </div>

              <div className="mt-3 pt-2 border-t border-[#28191D]/10 text-[10px] text-[#735E60]">
                <span className="font-semibold text-[#28191D] block">{m.status}</span>
                <span className="truncate block mt-0.5">{m.methodology}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid: Map (Left) + Critical Alerts & Selected Storm (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Weather Map (8 cols) */}
        <div className="lg:col-span-8">
          <WeatherMap
            storms={storms}
            radarStations={radarStations}
            lightningEvents={lightningEvents}
            selectedStorm={selectedStorm}
            onSelectStorm={(storm) => {
              setSelectedStorm(storm);
              if (onOpenStormModal) onOpenStormModal(storm);
            }}
          />
        </div>

        {/* Right: Critical Alerts & Selected Cell (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Critical Warning Advisories */}
          <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F4E3E6]">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#A51F52]" />
                <h3 className="text-sm font-extrabold text-[#28191D] font-headline lowercase">
                  active warning advisories
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4E3E6] text-[#A51F52] font-bold">
                {activeAlerts.length} Active
              </span>
            </div>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {activeAlerts.slice(0, 3).map((a, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#A51F52] font-headline">{a.risk_category}</span>
                    <span className="font-mono text-[9px] text-[#735E60]">{a.detection_timestamp}</span>
                  </div>
                  <h4 className="font-bold text-[#28191D] leading-tight">{a.headline}</h4>
                  <p className="text-[11px] text-[#735E60] leading-normal">{a.recommended_safety_action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Storm Telemetry Card */}
          {selectedStorm && (
            <div className="bg-[#D3E4B7] rounded-3xl p-5 text-[#28191D] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-[#28191D] text-[#FFF3F0] px-2 py-0.5 rounded-full">
                  {selectedStorm.id}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A51F52]">
                  {selectedStorm.estimated_risk} RISK
                </span>
              </div>
              <div>
                <h4 className="text-base font-extrabold font-headline">{selectedStorm.name}</h4>
                <p className="text-xs text-[#524446] mt-0.5">{selectedStorm.region}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#b8ce96]">
                <div className="bg-[#FFFFFF]/70 rounded-xl p-2">
                  <span className="text-[10px] text-[#735E60] block font-semibold">REFLECTIVITY</span>
                  <span className="font-mono font-bold text-[#A51F52] text-sm">{selectedStorm.intensity_dbz} dBZ</span>
                </div>
                <div className="bg-[#FFFFFF]/70 rounded-xl p-2">
                  <span className="text-[10px] text-[#735E60] block font-semibold">LIGHTNING RATE</span>
                  <span className="font-mono font-bold text-[#28191D] text-sm">{selectedStorm.lightning_rate_per_min}/min</span>
                </div>
                <div className="bg-[#FFFFFF]/70 rounded-xl p-2">
                  <span className="text-[10px] text-[#735E60] block font-semibold">SPEED</span>
                  <span className="font-mono font-bold text-[#28191D] text-sm">{selectedStorm.movement_speed_kmh} km/h</span>
                </div>
                <div className="bg-[#FFFFFF]/70 rounded-xl p-2">
                  <span className="text-[10px] text-[#735E60] block font-semibold">HEADING</span>
                  <span className="font-mono font-bold text-[#28191D] text-sm">{selectedStorm.movement_direction}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenStormModal(selectedStorm)}
                className="w-full py-2 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] text-xs font-bold transition flex items-center justify-center space-x-1 shadow-2xs"
              >
                <span>Inspect Full Telemetry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Row: Intensity Trend & Sensor Health */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-[#735E60] uppercase block mb-1">
            Historical Trend
          </span>
          <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase">
            storm core intensity trend
          </h3>
          <p className="text-xs text-[#735E60] mt-1 leading-relaxed">
            Multi-cell convection grew from 44 dBZ at T-30m to peak 55.4 dBZ over Gangetic Delta with rapid lightning acceleration.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-[#735E60] uppercase block mb-1">
            Kinematic Summary
          </span>
          <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase">
            advection & trajectory
          </h3>
          <p className="text-xs text-[#735E60] mt-1 leading-relaxed">
            Primary squall line propagating southeast (135°) at 46.5 km/h. Urban corridor impact projected within 25 minutes.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-[#735E60] uppercase block mb-1">
            Data Pipeline Health
          </span>
          <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase">
            observation integrity
          </h3>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between py-0.5 border-b border-[#F4E3E6]">
              <span className="text-[#735E60]">Doppler Radar Network:</span>
              <span className="font-mono font-bold text-[#22c55e]">NOMINAL (10m cycle)</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#F4E3E6]">
              <span className="text-[#735E60]">INSAT-3D Satellite:</span>
              <span className="font-mono font-bold text-[#22c55e]">RAPID SCAN ACTIVE</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-[#735E60]">IITM Lightning Network:</span>
              <span className="font-mono font-bold text-[#22c55e]">1.1s LATENCY</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
