import React, { useState, useEffect } from 'react';
import Globe3D from '../components/Globe3D';
import { 
  ShieldAlert, 
  CloudRain, 
  Zap, 
  Wind, 
  AlertTriangle, 
  ArrowUpRight, 
  Play, 
  Clock,
  Waves,
  Globe2,
  MapPin,
  Layers
} from 'lucide-react';
import { fetchActiveCyclones, fetchGnnSpatial, fetchRegionModes } from '../services/api';

export default function CommandCenterPage({
  dashboardData,
  stormsData,
  riskData,
  regionMode = 'india',
  setRegionMode,
  selectedStorm,
  setSelectedStorm,
  onOpenStormModal,
  onNavigateToForecast,
  onNavigateToDisaster,
  onLaunchSimulation
}) {
  const [activeCyclones, setActiveCyclones] = useState([]);
  const [selectedCyclone, setSelectedCyclone] = useState(null);
  const [gnnData, setGnnData] = useState(null);
  const [regionMeta, setRegionMeta] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchActiveCyclones().catch(() => null),
      fetchGnnSpatial(1.0, 1.0).catch(() => null),
      fetchRegionModes().catch(() => null)
    ]).then(([cycRes, gnnRes, regRes]) => {
      if (cycRes?.cyclones?.length > 0) {
        setActiveCyclones(cycRes.cyclones);
        setSelectedCyclone(cycRes.cyclones[0]);
      }
      if (gnnRes?.gnn) {
        setGnnData(gnnRes.gnn);
        setSelectedDistrict(gnnRes.gnn.district_predictions?.[0] || null);
      }
      if (regRes?.regions) {
        setRegionMeta(regRes.regions);
      }
    });
  }, []);

  const storms = stormsData?.storms || [];
  const radarStations = stormsData?.radar_stations || [];
  const lightningEvents = stormsData?.lightning_events || [];
  const activeAlerts = riskData?.active_alerts || [];

  const activeCoverage = regionMeta?.[regionMode] || {
    name: regionMode === 'andhra_pradesh' ? 'Andhra Pradesh (High-Detail Pilot)' : 'All India (National Intelligence)',
    spatial_resolution_km: regionMode === 'andhra_pradesh' ? 4.0 : 25.0,
    temporal_resolution_min: regionMode === 'andhra_pradesh' ? 10 : 15,
    confidence_level: regionMode === 'andhra_pradesh' ? 'High (Coastal DWR + River-Basin Graph)' : 'Moderate-High (Macro-Synoptic)'
  };

  return (
    <div className="space-y-8">
      {/* 01 Header & Editorial Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 glass-pill text-[#28191D] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A51F52] animate-ping"></span>
            <span>01. Earth Intelligence</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>{regionMode === 'andhra_pradesh' ? 'Andhra Pradesh High-Detail Pilot' : 'National India Scope'}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Resolution: {activeCoverage.spatial_resolution_km} km / {activeCoverage.temporal_resolution_min} min</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EBDCD8]">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
              earth intelligence.
            </h1>
            <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
              National-scale atmospheric monitoring across India paired with our high-resolution Andhra Pradesh 
              district, mandal, and river-basin pilot on an interactive 3D CesiumJS Earth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {setRegionMode && (
              <div className="inline-flex p-1 glass-panel rounded-full shadow-xs">
                <button
                  onClick={() => setRegionMode('india')}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                    regionMode === 'india' ? 'bg-[#28191D] text-white' : 'text-[#735E60] hover:text-[#28191D]'
                  }`}
                >
                  All India
                </button>
                <button
                  onClick={() => setRegionMode('andhra_pradesh')}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                    regionMode === 'andhra_pradesh' ? 'bg-[#A51F52] text-white' : 'text-[#735E60] hover:text-[#28191D]'
                  }`}
                >
                  Andhra Pradesh Pilot
                </button>
              </div>
            )}

            <button
              onClick={onLaunchSimulation}
              className="inline-flex items-center space-x-2 glass-pill hover:bg-white text-[#28191D] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-[#28191D]" />
              <span>Scenario Replay</span>
            </button>
          </div>
        </div>
      </section>

      {/* Spatial Coverage & Confidence Disclosure Bar */}
      <section className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <Layers className="w-4 h-4 text-[#A51F52] shrink-0" />
          <div>
            <strong className="text-[#28191D]">{activeCoverage.name}:</strong>{' '}
            <span className="text-[#735E60]">{activeCoverage.coverage_notes || 'Multi-sensor satellite, radar, and graph telemetry.'}</span>
          </div>
        </div>
        <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-[#D3E4B7] text-[#28191D] font-bold shrink-0">
          Confidence: {activeCoverage.confidence_level}
        </span>
      </section>

      {/* Floating Frosted Glass Metric Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={onNavigateToForecast} className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group">
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider">THUNDERSTORM CELLS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E4B7] text-[#28191D]">DERIVED</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">{storms.length}</span>
            <span className="text-xs text-[#735E60] font-sans">active clusters</span>
          </div>
          <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <CloudRain className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>LNN + Radar Tracked</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              LNN Outlook <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        <div onClick={onNavigateToForecast} className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group border-[#ebd0d6]" style={{ background: 'rgba(244, 227, 230, 0.65)' }}>
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider text-[#A51F52]">CYCLONE GUIDANCE</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A51F52] text-white">REPLAY</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">{activeCyclones[0]?.name || 'REMAL'}</span>
            <span className="text-xs text-[#A51F52] font-semibold font-mono">120 km/h</span>
          </div>
          <div className="pt-2 border-t border-[#ebd0d6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Wind className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>978 hPa • Bay of Bengal</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              Forecasts <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        <div onClick={onNavigateToForecast} className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group">
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider">AP GNN DISTRICTS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E4B7] text-[#28191D]">ST-GAT</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">{gnnData?.graph_stats?.num_nodes || 16}</span>
            <span className="text-xs text-[#735E60] font-sans">graph nodes</span>
          </div>
          <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{gnnData?.graph_stats?.river_basin_edges || 8} River Edges</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              Spatial Graph <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        <div onClick={onNavigateToDisaster} className="glass-panel glass-card-hover rounded-3xl p-6 space-y-3 cursor-pointer group">
          <div className="flex items-center justify-between text-xs text-[#735E60]">
            <span className="font-mono uppercase font-bold tracking-wider">FLOOD & QSA LAB</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E4B7] text-[#28191D]">SIMULATED</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-[#28191D] font-headline">3 Basins</span>
            <span className="text-xs text-[#735E60] font-sans">hydrological</span>
          </div>
          <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between text-xs text-[#735E60]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Waves className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Copilot + QSA Ready</span>
            </span>
            <span className="group-hover:translate-x-1 transition text-[#A51F52] font-semibold text-[11px] flex items-center">
              Simulate <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Main 3D Earth Globe Geographic Workspace */}
      <section className="space-y-4">
        <Globe3D
          storms={storms}
          radarStations={radarStations}
          lightningEvents={lightningEvents}
          cyclones={activeCyclones}
          gnnData={gnnData}
          regionMode={regionMode}
          selectedStorm={selectedStorm}
          onSelectStorm={(st) => {
            setSelectedStorm(st);
            onOpenStormModal(st);
          }}
          onSelectCyclone={(cyc) => setSelectedCyclone(cyc)}
          onSelectDistrict={(dist) => setSelectedDistrict(dist)}
        />
      </section>

      {/* Location-Specific AP District Inspector & Active Warnings */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AP District Exposure Inspector */}
        {selectedDistrict && (
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 lg:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EBDCD8]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#A51F52]" />
                <h3 className="text-lg font-bold text-[#28191D] font-headline">
                  Location Inspector: {selectedDistrict.name} ({selectedDistrict.basin})
                </h3>
              </div>
              <span className={`text-xs font-mono px-3 py-0.5 rounded-full font-bold ${
                selectedDistrict.risk_tier === 'CRITICAL' ? 'bg-[#A51F52] text-white' : 'bg-[#D3E4B7] text-[#28191D]'
              }`}>
                GNN HAZARD SCORE: {selectedDistrict.gnn_hazard_score}/100 ({selectedDistrict.risk_tier})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">MODELLED RAINFALL</span>
                <span className="text-base font-mono font-bold text-[#28191D]">{selectedDistrict.modelled_rain_mm_hr} mm/hr</span>
                <span className="text-[10px] text-[#735E60] block">Elev: {selectedDistrict.elevation_m}m</span>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">LIGHTNING PROB</span>
                <span className="text-base font-mono font-bold text-[#A51F52]">{(selectedDistrict.localized_lightning_prob * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-[#735E60] block">ST-GAT Local</span>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">FLOOD SUSCEPTIBILITY</span>
                <span className="text-base font-mono font-bold text-[#28191D]">{(selectedDistrict.flood_susceptibility * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-[#735E60] block">Basin: {selectedDistrict.basin}</span>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-white/60">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">EXPOSED POP</span>
                <span className="text-base font-mono font-bold text-[#28191D]">{selectedDistrict.population_exposed?.toLocaleString()}</span>
                <span className="text-[10px] text-[#735E60] block">Mandals: {selectedDistrict.mandals?.length}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#28191D]">Pilot Mandals:</span>
              {selectedDistrict.mandals?.map((m, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full glass-pill text-[#28191D] font-mono text-[11px]">{m}</span>
              ))}
              <span className="font-bold text-[#28191D] ml-2">Infrastructure:</span>
              {selectedDistrict.critical_infra?.map((inf, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#F4E3E6] text-[#A51F52] font-medium text-[11px]">{inf}</span>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
              <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">active advisories.</h3>
              <span className="text-[10px] font-mono font-bold bg-[#A51F52] text-white px-2.5 py-0.5 rounded-full">{activeAlerts.length} ACTIVE</span>
            </div>
            <div className="space-y-2.5">
              {activeAlerts.slice(0, 3).map((alert, idx) => (
                <div key={idx} className="p-3 rounded-2xl glass-pill space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#A51F52]">{alert.type}</span>
                    <span className="text-[10px] font-mono text-[#735E60]">{alert.severity}</span>
                  </div>
                  <p className="text-xs text-[#28191D] font-medium leading-snug">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onNavigateToForecast}
            className="w-full py-2.5 rounded-full bg-[#28191D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3d272d] transition flex items-center justify-center space-x-1.5"
          >
            <span>Open LNN & GNN Predictions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
