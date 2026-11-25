import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Zap, 
  Cpu,
  Network,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { 
  fetchLiveTracking, 
  fetchLightningAnalysis, 
  fetchActiveCyclones,
  fetchLnnForecast,
  fetchGnnSpatial
} from '../services/api';

export default function ForecastIntelligencePage({ regionMode = 'india' }) {
  const [activeSubTab, setActiveSubTab] = useState('lnn'); // 'lnn', 'gnn', 'cyclone'
  const [lnnData, setLnnData] = useState(null);
  const [gnnData, setGnnData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [lightningData, setLightningData] = useState(null);
  const [selectedCyclone, setSelectedCyclone] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchLnnForecast('Konaseema (AP-KNS)').catch(() => null),
      fetchGnnSpatial(1.0, 1.0).catch(() => null),
      fetchLiveTracking('kalbaishakhi').catch(() => null),
      fetchLightningAnalysis().catch(() => null),
      fetchActiveCyclones().catch(() => null)
    ]).then(([lnnRes, gnnRes, trackRes, lightRes, cycRes]) => {
      if (lnnRes?.lnn) setLnnData(lnnRes.lnn);
      if (gnnRes?.gnn) setGnnData(gnnRes.gnn);
      if (trackRes) setTrackingData(trackRes);
      if (lightRes) setLightningData(lightRes);
      if (cycRes?.cyclones?.length > 0) setSelectedCyclone(cycRes.cyclones[0]);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* 02 Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 glass-pill text-[#28191D] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A51F52]"></span>
            <span>02. Predictive Intelligence</span>
            <span>•</span>
            <span>LNN Temporal + GNN Spatial + Cyclone & Lightning</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Scope: {regionMode === 'andhra_pradesh' ? 'Andhra Pradesh Pilot (4 km)' : 'All India (25 km)'}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EBDCD8]">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
              predictive intelligence.
            </h1>
            <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
              Experimental Closed-form Continuous-time (CfC) Liquid Neural Networks, Geographic Graph Attention Networks (ST-GAT), 
              IMD-calibrated cyclone tracks, and probabilistic 15m/30m/60m lightning nowcasting.
            </p>
          </div>

          <div className="inline-flex flex-wrap p-1.5 glass-panel rounded-full shadow-xs gap-1">
            <button
              onClick={() => setActiveSubTab('lnn')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeSubTab === 'lnn' ? 'bg-[#A51F52] text-white shadow-xs' : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>LNN Temporal</span>
            </button>
            <button
              onClick={() => setActiveSubTab('gnn')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeSubTab === 'gnn' ? 'bg-[#A51F52] text-white shadow-xs' : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>GNN Spatial Graph</span>
            </button>
            <button
              onClick={() => setActiveSubTab('cyclone')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeSubTab === 'cyclone' ? 'bg-[#A51F52] text-white shadow-xs' : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Cyclone & Lightning</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: LIQUID NEURAL NETWORK (LNN / CfC) ENGINE */}
      {/* ========================================================================= */}
      {activeSubTab === 'lnn' && lnnData && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBDCD8]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#D3E4B7] text-[#28191D]">
                    {lnnData.model_id}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F4E3E6] text-[#A51F52]">
                    {lnnData.data_provenance}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase mt-2">
                  closed-form continuous-time (cfc) temporal rollout.
                </h2>
                <p className="text-xs text-[#735E60]">
                  Target Location: <strong>{lnnData.location}</strong> • Training Status: {lnnData.training_status}
                </p>
              </div>
              <div className="text-xs font-mono glass-pill px-4 py-2 rounded-2xl">
                <span className="text-[#735E60] block">CHRONOLOGICAL SPLIT (NO LEAKAGE):</span>
                <strong className="text-[#28191D]">Train 70% | Val 15% | Test 15%</strong>
              </div>
            </div>

            {/* 15m / 30m / 60m LNN Forecast Windows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lnnData.forecast_outlook?.map((w, i) => (
                <div key={i} className="glass-panel rounded-2xl p-5 border border-white/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-extrabold text-[#A51F52]">{w.lead_time} Outlook</span>
                    <span className="text-[10px] font-mono bg-[#D3E4B7] text-[#28191D] px-2 py-0.5 rounded-full font-bold">
                      τ = {w.adaptive_tau_sec}s
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#735E60] block font-sans">LIGHTNING PROB</span>
                      <strong className="text-lg text-[#A51F52]">{(w.lightning_probability * 100).toFixed(1)}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#735E60] block font-sans">RAINFALL RATE</span>
                      <strong className="text-lg text-[#28191D]">{w.predicted_rain_mm_hr} mm/h</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#735E60] block font-sans">RADAR dBZ</span>
                      <strong>{w.predicted_dbz} dBZ</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#735E60] block font-sans">UNCERTAINTY</span>
                      <strong>±{w.uncertainty_band_pct}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Causal Historical State Trace */}
            <div className="glass-panel rounded-2xl p-5 border border-white/60 space-y-3">
              <h3 className="text-sm font-bold text-[#28191D] uppercase tracking-wider">
                Causal Sequence Integration (T-60m → T-0)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#EBDCD8] text-[10px] text-[#735E60] uppercase">
                      <th className="py-2 px-3">STEP</th>
                      <th className="py-2 px-3">OBS dBZ</th>
                      <th className="py-2 px-3">OBS RAIN</th>
                      <th className="py-2 px-3">LATENT INSTABILITY</th>
                      <th className="py-2 px-3 text-right">LIQUID τ_eff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4E3E6]">
                    {lnnData.historical_state_trace?.map((st, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-bold text-[#28191D]">{st.time}</td>
                        <td className="py-2 px-3">{st.observed_dbz} dBZ</td>
                        <td className="py-2 px-3">{st.observed_rain_mm_hr} mm/h</td>
                        <td className="py-2 px-3 text-[#A51F52] font-bold">{st.latent_instability_index}</td>
                        <td className="py-2 px-3 text-right">{st.dominant_tau_sec} s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[#735E60]">{lnnData.scientific_note}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GEOGRAPHIC GRAPH NEURAL NETWORK (ST-GAT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'gnn' && gnnData && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBDCD8]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#D3E4B7] text-[#28191D]">
                    {gnnData.model_id}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F4E3E6] text-[#A51F52]">
                    {gnnData.data_provenance}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase mt-2">
                  spatiotemporal graph attention network (andhra pradesh pilot).
                </h2>
                <p className="text-xs text-[#735E60]">
                  {gnnData.graph_stats?.num_nodes} District Nodes • {gnnData.graph_stats?.river_basin_edges} Directed River Edges (Godavari/Krishna/Pennar) • {gnnData.graph_stats?.spatial_adjacency_edges} Spatial Adjacency Edges
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EBDCD8] text-[10px] uppercase font-bold text-[#735E60]">
                    <th className="py-2.5 px-3">DISTRICT</th>
                    <th className="py-2.5 px-3">RIVER BASIN</th>
                    <th className="py-2.5 px-3">GNN HAZARD</th>
                    <th className="py-2.5 px-3">LIGHTNING PROB</th>
                    <th className="py-2.5 px-3">FLOOD SUSCEPT</th>
                    <th className="py-2.5 px-3">RAIN / WIND</th>
                    <th className="py-2.5 px-3 text-right">ATTN α_max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4E3E6] font-mono">
                  {gnnData.district_predictions?.map((d) => (
                    <tr key={d.id} className="hover:bg-white/60 transition">
                      <td className="py-2.5 px-3 font-sans font-bold text-[#28191D]">{d.name}</td>
                      <td className="py-2.5 px-3 font-sans text-[#735E60]">{d.basin}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          d.risk_tier === 'CRITICAL' ? 'bg-[#A51F52] text-white' :
                          d.risk_tier === 'HIGH' ? 'bg-[#d97706] text-white' : 'bg-[#D3E4B7] text-[#28191D]'
                        }`}>
                          {d.gnn_hazard_score} ({d.risk_tier})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#A51F52] font-bold">{(d.localized_lightning_prob * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3">{(d.flood_susceptibility * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3">{d.modelled_rain_mm_hr} mm/h • {d.modelled_wind_kmh} km/h</td>
                      <td className="py-2.5 px-3 text-right text-[#735E60]">{d.peak_neighbor_attention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CYCLONE & LIGHTNING INTELLIGENCE */}
      {/* ========================================================================= */}
      {activeSubTab === 'cyclone' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {selectedCyclone && (
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD8]">
                <div>
                  <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                    cyclone {selectedCyclone.name} — imd advisory & track replay.
                  </h3>
                  <p className="text-xs text-[#735E60]">{selectedCyclone.advisory_source} • {selectedCyclone.data_provenance}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#A51F52] text-white px-3 py-1 rounded-full">
                  {selectedCyclone.current_position?.max_wind_kmh} km/h
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#EBDCD8] text-[10px] uppercase font-bold text-[#735E60]">
                      <th className="py-2 px-3">LEAD</th>
                      <th className="py-2 px-3">COORDINATES</th>
                      <th className="py-2 px-3">WIND</th>
                      <th className="py-2 px-3">PRESSURE</th>
                      <th className="py-2 px-3 text-right">UNCERTAINTY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4E3E6]">
                    {selectedCyclone.forecast_track?.map((pt, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-bold text-[#28191D]">+{pt.forecast_lead_h}h</td>
                        <td className="py-2 px-3">{pt.lat.toFixed(2)}°N, {pt.lon.toFixed(2)}°E</td>
                        <td className="py-2 px-3 text-[#A51F52] font-bold">{pt.wind_kmh} km/h</td>
                        <td className="py-2 px-3">{pt.pressure_hpa} hPa</td>
                        <td className="py-2 px-3 text-right">± {pt.uncertainty_radius_km} km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {lightningData && (
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#EBDCD8]">
                <Zap className="w-4 h-4 text-[#d97706]" />
                <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">lightning jump (2σ).</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 glass-panel rounded-2xl border border-white/60 font-mono space-y-1">
                  <div className="flex justify-between"><span>Total Flashes (1h):</span><strong>{lightningData.total_flashes_last_hour}</strong></div>
                  <div className="flex justify-between"><span>Cloud-to-Ground (CG):</span><strong className="text-[#A51F52]">{lightningData.cg_flashes}</strong></div>
                  <div className="flex justify-between"><span>Intra-Cloud (IC):</span><strong>{lightningData.ic_flashes}</strong></div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F4E3E6]/70 border border-[#ebd0d6] space-y-1">
                  <div className="flex items-center space-x-1 text-[#A51F52] font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Jump Acceleration: +{lightningData.lightning_jump?.acceleration_pct}%</span>
                  </div>
                  <p className="text-[#28191D]">Detected in {lightningData.lightning_jump?.detected_cell}.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
