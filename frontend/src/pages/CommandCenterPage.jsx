import React, { useState, useEffect } from 'react';
import Globe3D from '../components/Globe3D';
import { 
  Activity, 
  ShieldAlert, 
  CloudRain, 
  Zap, 
  Radio, 
  Compass, 
  Wind, 
  Layers, 
  AlertTriangle, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  Clock,
  Waves,
  Eye,
  Globe2
} from 'lucide-react';
import { fetchActiveCyclones } from '../services/api';

export default function CommandCenterPage({
  dashboardData,
  stormsData,
  riskData,
  selectedStorm,
  setSelectedStorm,
  onOpenStormModal,
  onNavigateToForecast,
  onNavigateToDisaster,
  onLaunchSimulation
}) {
  const [activeCyclones, setActiveCyclones] = useState([]);
  const [selectedCyclone, setSelectedCyclone] = useState(null);

  useEffect(() => {
    fetchActiveCyclones()
      .then(res => {
        if (res?.cyclones?.length > 0) {
          setActiveCyclones(res.cyclones);
          setSelectedCyclone(res.cyclones[0]);
        }
      })
      .catch(err => console.warn('Could not load active cyclones:', err));
  }, []);

  const storms = stormsData?.storms || [];
  const radarStations = stormsData?.radar_stations || [];
  const lightningEvents = stormsData?.lightning_events || [];
  const activeAlerts = riskData?.active_alerts || [];

  return (
    <div className="space-y-8">
      {/* 01 Header & Editorial Hero with Glassmorphism */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 glass-pill text-[#28191D] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A51F52] animate-ping"></span>
            <span>01 — Command Center</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>3D Earth Intelligence</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Cycle: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EBDCD8]">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
              operational command.
            </h1>
            <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
              Real-time atmospheric intelligence uniting an interactive 3D Earth focused on the Indian subcontinent, 
              convective thunderstorm nowcasting, tropical cyclone track forecasting, and multi-sector disaster response.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchSimulation}
              className="inline-flex items-center space-x-2 glass-pill hover:bg-white text-[#28191D] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-[#28191D]" />
              <span>Simulate Scenarios</span>
            </button>
            <button
              onClick={onNavigateToDisaster}
              className="inline-flex items-center space-x-2 bg-[#A51F52] hover:bg-[#8e1945] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Deploy Resources</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Frosted Glass Metric Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Thunderstorms */}
        <div 
          onClick={onNavigateToForecast}
          className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider">THUNDERSTORM CELLS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E4B7] text-[#28191D]">
              DERIVED
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">
              {storms.length}
            </span>
            <span className="text-xs text-[#735E60] font-sans">tracked clusters</span>
          </div>
          <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <CloudRain className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Peak: 55.4 dBZ</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              Inspect <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Metric 2: Active Cyclone Systems */}
        <div 
          onClick={onNavigateToForecast}
          className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group border-[#ebd0d6]"
          style={{ background: 'rgba(244, 227, 230, 0.65)' }}
        >
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider text-[#A51F52]">TROPICAL CYCLONE</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A51F52] text-white">
              VSCS
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">
              {activeCyclones.length > 0 ? activeCyclones[0].name : '1'}
            </span>
            <span className="text-xs text-[#A51F52] font-semibold font-mono">120 km/h</span>
          </div>
          <div className="pt-2 border-t border-[#ebd0d6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Wind className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Central: 978 hPa</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              3D Track <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Metric 3: Total Lightning Density */}
        <div 
          onClick={onNavigateToForecast}
          className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider">LIGHTNING FLASH RATE</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E4B7] text-[#28191D]">
              REAL
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">
              68
            </span>
            <span className="text-xs text-[#735E60] font-sans">flashes / min</span>
          </div>
          <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Jump: +34% (Elevated)</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              CG / IC <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Metric 4: Disaster Readiness */}
        <div 
          onClick={onNavigateToDisaster}
          className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider">SHELTER READINESS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E4B7] text-[#28191D]">
              QSA ACTIVE
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">
              72%
            </span>
            <span className="text-xs text-[#735E60] font-sans">capacity filled</span>
          </div>
          <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Waves className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Surge Threat: 2.8m</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              Allocate <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Main 3D Earth Globe Geographic Workspace */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
              3d india geographic earth & atmospheric layers.
            </h2>
            <p className="text-xs text-[#735E60]">
              Interactive WebGL 3D globe visualization focused on the Indian subcontinent with 3D storm cylinders, cyclone trajectory paths, and lightning observation points.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">
              Engine: CesiumJS 3D • WGS84
            </span>
          </div>
        </div>

        {/* 3D Globe Container */}
        <Globe3D
          storms={storms}
          radarStations={radarStations}
          lightningEvents={lightningEvents}
          cyclones={activeCyclones}
          selectedStorm={selectedStorm}
          onSelectStorm={(st) => {
            setSelectedStorm(st);
            onOpenStormModal(st);
          }}
          onSelectCyclone={(cyc) => {
            setSelectedCyclone(cyc);
          }}
        />
      </section>

      {/* Cyclone & Severe Incident Spotlight in Glass Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cyclone Remal / Tropical Storm Card */}
        {selectedCyclone && (
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 lg:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD8]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A51F52] animate-pulse"></span>
                <h3 className="text-lg font-bold text-[#28191D] font-headline">
                  Tropical Cyclone {selectedCyclone.name} ({selectedCyclone.current_position?.classification?.category})
                </h3>
              </div>
              <span className="text-xs font-mono bg-[#A51F52] text-white px-3 py-0.5 rounded-full font-bold">
                IMD BULLETIN {selectedCyclone.bulletin_no}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">CURRENT POSITION</span>
                <span className="text-sm font-mono font-bold text-[#28191D]">
                  {selectedCyclone.current_position?.lat}°N, {selectedCyclone.current_position?.lon}°E
                </span>
                <span className="text-[10px] text-[#735E60] block">Heading: {selectedCyclone.current_position?.movement_direction} @ {selectedCyclone.current_position?.movement_speed_kmh} km/h</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">CENTRAL PRESSURE</span>
                <span className="text-sm font-mono font-bold text-[#A51F52]">
                  {selectedCyclone.current_position?.central_pressure_hpa} hPa
                </span>
                <span className="text-[10px] text-[#735E60] block">Eye Diameter: {selectedCyclone.current_position?.eye_diameter_km} km</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">MAX SUSTAINED WIND</span>
                <span className="text-sm font-mono font-bold text-[#28191D]">
                  {selectedCyclone.current_position?.max_wind_kmh} km/h
                </span>
                <span className="text-[10px] text-[#A51F52] font-semibold block">Gusts: {selectedCyclone.current_position?.gust_kmh} km/h</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">LANDFALL PROJECTION</span>
                <span className="text-sm font-bold text-[#28191D]">
                  {selectedCyclone.landfall_estimate?.expected_time_utc}
                </span>
                <span className="text-[10px] text-[#735E60] block">Surge: ~{selectedCyclone.landfall_estimate?.surge_height_m}m</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/60 space-y-2">
              <span className="text-xs font-bold text-[#28191D] uppercase tracking-wider block">
                Official Coastal Impact Warnings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedCyclone.impact_warnings?.map((w, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl glass-pill">
                    <AlertTriangle className="w-4 h-4 text-[#A51F52] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#28191D]">{w.type}: </span>
                      <span className="text-[#735E60]">{w.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Alerts in Frosted Glass */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
              <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                active warnings.
              </h3>
              <span className="text-[10px] font-mono font-bold bg-[#A51F52] text-white px-2.5 py-0.5 rounded-full">
                {activeAlerts.length} ISSUED
              </span>
            </div>

            <div className="space-y-2.5">
              {activeAlerts.slice(0, 3).map((alert, idx) => (
                <div key={idx} className="p-3 rounded-2xl glass-pill space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#A51F52]">{alert.type}</span>
                    <span className="text-[10px] font-mono text-[#735E60]">{alert.severity}</span>
                  </div>
                  <p className="text-xs text-[#28191D] font-medium leading-snug">{alert.message}</p>
                  <span className="text-[10px] text-[#735E60] block font-mono">Issued for {alert.region}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToForecast}
            className="w-full py-2.5 rounded-full bg-[#28191D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3d272d] transition flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <span>Explore Forecast Intelligence</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
