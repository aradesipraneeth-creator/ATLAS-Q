import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Waves, 
  Play, 
  RefreshCw,
  Clock,
  MessageSquare,
  Send,
  Sliders
} from 'lucide-react';
import { 
  fetchDisasterImpact, 
  runDisasterOptimization, 
  fetchFloodSimulation, 
  askDisasterCopilot 
} from '../services/api';

const COPILOT_PRESETS = [
  "Which Andhra Pradesh districts intersect this cyclone scenario?",
  "Which locations have elevated lightning probability over the next 30 minutes?",
  "Which settlements intersect the simulated flood extent?",
  "Which shelter allocation solution satisfies the current capacity constraints?"
];

export default function DisasterManagementPage({ regionMode = 'andhra_pradesh' }) {
  const [activeTab, setActiveTab] = useState('flood'); // 'flood', 'copilot', 'qsa'
  const [impactData, setImpactData] = useState(null);
  const [floodData, setFloodData] = useState(null);
  const [qsaResults, setQsaResults] = useState(null);

  // What-if sliders
  const [rainMult, setRainMult] = useState(1.2);
  const [surgeM, setSurgeM] = useState(1.8);
  const [simulatingFlood, setSimulatingFlood] = useState(false);

  // QSA states
  const [optimizing, setOptimizing] = useState(false);
  const [problemType, setProblemType] = useState('shelter_dispatch');

  // Copilot states
  const [copilotQuery, setCopilotQuery] = useState(COPILOT_PRESETS[0]);
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [askingCopilot, setAskingCopilot] = useState(false);

  useEffect(() => {
    fetchDisasterImpact().then(res => setImpactData(res.impact)).catch(() => {});
    fetchFloodSimulation(rainMult, surgeM).then(res => setFloodData(res.flood)).catch(() => {});
  }, []);

  const handleRunFlood = async () => {
    try {
      setSimulatingFlood(true);
      const res = await fetchFloodSimulation(rainMult, surgeM);
      setFloodData(res.flood);
    } finally {
      setSimulatingFlood(false);
    }
  };

  const handleRunQSA = async () => {
    try {
      setOptimizing(true);
      const res = await runDisasterOptimization(problemType, 12, 4);
      setQsaResults(res.solution);
    } finally {
      setOptimizing(false);
    }
  };

  const handleAskCopilot = async (customQ) => {
    const q = customQ || copilotQuery;
    if (!q.trim()) return;
    setCopilotQuery(q);
    try {
      setAskingCopilot(true);
      const res = await askDisasterCopilot(q, regionMode, rainMult, surgeM);
      setCopilotResponse(res.copilot);
    } finally {
      setAskingCopilot(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 03 Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 glass-pill text-[#28191D] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A51F52]"></span>
            <span>03. Disaster Simulation Lab</span>
            <span>•</span>
            <span>Hydrological Flood + Disaster Copilot + QSA Optimization</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>What-If Simulation Active</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EBDCD8]">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
              disaster simulation lab.
            </h1>
            <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
              Run interactive SCS-CN river-basin flood simulations, interrogate modelled hazards with the evidence-grounded 
              ATLAS-Q Disaster Copilot, and benchmark Quantum-Inspired emergency resource allocation.
            </p>
          </div>

          <div className="inline-flex flex-wrap p-1.5 glass-panel rounded-full shadow-xs gap-1">
            <button
              onClick={() => setActiveTab('flood')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'flood' ? 'bg-[#A51F52] text-white shadow-xs' : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Flood & What-If Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'copilot' ? 'bg-[#A51F52] text-white shadow-xs' : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Disaster Copilot</span>
            </button>
            <button
              onClick={() => setActiveTab('qsa')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'qsa' ? 'bg-[#A51F52] text-white shadow-xs' : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>QSA Optimization</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: HYDROLOGICAL FLOOD & WHAT-IF SIMULATION */}
      {/* ========================================================================= */}
      {activeTab === 'flood' && (
        <div className="space-y-6">
          {/* Interactive What-If Controls */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#EBDCD8]">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#A51F52]" />
                <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                  hydrological what-if parameters (ap delta basins).
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#D3E4B7] text-[#28191D]">
                {floodData?.data_provenance || 'SIMULATED (SCS-CN Runoff)'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#735E60]">Rainfall Intensity Multiplier:</span>
                  <strong className="text-[#A51F52]">{rainMult}x</strong>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.2"
                  step="0.1"
                  value={rainMult}
                  onChange={(e) => setRainMult(parseFloat(e.target.value))}
                  className="w-full accent-[#A51F52]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#735E60]">Coastal Storm Surge Tailwater:</span>
                  <strong className="text-[#A51F52]">{surgeM} m</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.5"
                  step="0.2"
                  value={surgeM}
                  onChange={(e) => setSurgeM(parseFloat(e.target.value))}
                  className="w-full accent-[#A51F52]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunFlood}
                  disabled={simulatingFlood}
                  className="inline-flex items-center space-x-2 bg-[#A51F52] hover:bg-[#8e1945] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition shadow-sm"
                >
                  {simulatingFlood ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>Run Flood Simulation</span>
                </button>
              </div>
            </div>
          </div>

          {/* River Basin Simulation Results */}
          {floodData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {floodData.basins?.map((b) => (
                <div key={b.basin_id} className="glass-panel rounded-3xl p-6 space-y-4">
                  <div className="pb-2 border-b border-[#F4E3E6]">
                    <span className="text-[10px] font-mono font-bold text-[#A51F52] uppercase">{b.basin_id}</span>
                    <h4 className="text-base font-bold text-[#28191D]">{b.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="glass-panel p-3 rounded-2xl border border-white/60">
                      <span className="text-[10px] text-[#735E60] block font-sans">PEAK DEPTH</span>
                      <strong className="text-xl text-[#A51F52]">{b.peak_water_depth_m} m</strong>
                    </div>
                    <div className="glass-panel p-3 rounded-2xl border border-white/60">
                      <span className="text-[10px] text-[#735E60] block font-sans">INUNDATED AREA</span>
                      <strong className="text-xl text-[#28191D]">{b.peak_inundated_area_km2} km²</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#28191D] block">24h Progression (T+0h → T+24h):</span>
                    <div className="flex items-end space-x-1.5 h-16 pt-2">
                      {b.progression?.map((p, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                          <div
                            className="w-full bg-[#A51F52]/80 rounded-t-md transition-all"
                            style={{ height: `${Math.max(8, (p.water_depth_m / 3.5) * 48)}px` }}
                            title={`${p.hour_label}: ${p.water_depth_m}m (±${p.uncertainty_depth_m}m)`}
                          ></div>
                          <span className="text-[9px] font-mono text-[#735E60]">{p.hour_label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F4E3E6] text-[11px] text-[#735E60] space-y-1">
                    <div><strong className="text-[#28191D]">Settlements:</strong> {b.exposed_settlements?.join(', ')}</div>
                    <div><strong className="text-[#28191D]">Roads:</strong> {b.exposed_roads?.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ATLAS-Q DISASTER COPILOT (EVIDENCE-GROUNDED RAG) */}
      {/* ========================================================================= */}
      {activeTab === 'copilot' && (
        <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="pb-4 border-b border-[#EBDCD8] space-y-1">
            <h3 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
              atlas-q disaster copilot.
            </h3>
            <p className="text-xs text-[#735E60]">
              Retrieval-Augmented decision assistant grounded strictly in live LNN, GNN, Cyclone, Flood, and QSA model outputs.
            </p>
          </div>

          {/* Preset Prompt Chips */}
          <div className="flex flex-wrap gap-2">
            {COPILOT_PRESETS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskCopilot(q)}
                className="text-xs px-3.5 py-1.5 rounded-full glass-pill hover:bg-white text-[#28191D] font-medium transition text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Query Input */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
              placeholder="Ask about AP districts, 30m lightning risk, flood settlements, or QSA shelters..."
              className="flex-1 glass-panel rounded-2xl px-4 py-3 text-sm text-[#28191D] focus:outline-none border border-white/70"
            />
            <button
              onClick={() => handleAskCopilot()}
              disabled={askingCopilot}
              className="inline-flex items-center space-x-2 bg-[#A51F52] hover:bg-[#8e1945] text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-2xl transition shadow-sm"
            >
              {askingCopilot ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask Copilot</span>
            </button>
          </div>

          {/* Grounded Answer */}
          {copilotResponse && (
            <div className="glass-panel rounded-2xl p-6 border border-white/70 space-y-4">
              <div className="text-sm text-[#28191D] leading-relaxed font-sans">
                {copilotResponse.answer}
              </div>

              <div className="pt-3 border-t border-[#F4E3E6] space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#735E60] block">
                  Retrieved Evidence & Provenance
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {copilotResponse.evidence?.map((ev, i) => (
                    <div key={i} className="p-2.5 rounded-xl glass-pill space-y-0.5">
                      <div className="font-bold text-[#A51F52]">{ev.source}</div>
                      <div className="text-[10px] text-[#735E60]">{ev.provenance}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F4E3E6]/60 text-[11px] text-[#28191D]">
                {copilotResponse.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: QUANTUM-INSPIRED OPTIMIZATION (QSA) */}
      {/* ========================================================================= */}
      {activeTab === 'qsa' && (
        <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBDCD8]">
            <div>
              <h3 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
                quantum-inspired simulated annealing (qsa).
              </h3>
              <p className="text-xs text-[#735E60]">
                Solves emergency shelter & rescue dispatch on classical CPU via transverse-field quantum tunneling.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
                className="glass-panel rounded-2xl px-4 py-2 text-xs font-semibold text-[#28191D]"
              >
                <option value="shelter_dispatch">Shelter Capacity & Evacuee Allocation</option>
                <option value="rescue_units">Rescue Boat & NDRF Team Placement</option>
                <option value="relief_logistics">Essential Supply Chains</option>
              </select>
              <button
                onClick={handleRunQSA}
                disabled={optimizing}
                className="inline-flex items-center space-x-2 bg-[#A51F52] hover:bg-[#8e1945] text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-full transition"
              >
                {optimizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>Run QSA</span>
              </button>
            </div>
          </div>

          {qsaResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/60">
                <span className="text-[10px] font-mono font-bold text-[#735E60] block">QSA ENERGY SCORE</span>
                <strong className="text-2xl font-mono text-[#A51F52]">{qsaResults.quantum_inspired_solution?.objective_energy_score?.toFixed(4)}</strong>
                <span className="text-[11px] block text-[#735E60]">Runtime: {qsaResults.quantum_inspired_solution?.execution_time_ms} ms</span>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-white/60">
                <span className="text-[10px] font-mono font-bold text-[#735E60] block">CLASSICAL SA BASELINE</span>
                <strong className="text-2xl font-mono text-[#28191D]">{qsaResults.classical_baseline?.objective_energy_score?.toFixed(4)}</strong>
                <span className="text-[11px] block text-[#735E60]">Runtime: {qsaResults.classical_baseline?.execution_time_ms} ms</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#D3E4B7]/80 border border-[#c4db9e]">
                <span className="text-[10px] font-mono font-bold text-[#28191D] block">COVERAGE GAIN VS GREEDY</span>
                <strong className="text-2xl font-mono text-[#28191D]">+{qsaResults.comparison_metrics?.energy_improvement_pct}%</strong>
                <span className="text-[11px] block text-[#28191D]">Classical CPU Execution</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#735E60]">
              Click <strong>Run QSA</strong> to execute the classical-CPU quantum-inspired allocation benchmark.
            </div>
          )}

          {impactData?.shelters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {impactData.shelters.slice(0, 3).map((s) => (
                <div key={s.id} className="glass-panel p-4 rounded-2xl border border-white/60 text-xs space-y-1">
                  <div className="font-bold text-[#28191D]">{s.name}</div>
                  <div className="text-[#735E60] font-mono">{s.district}</div>
                  <div>Occupancy: <strong>{s.current_occupancy} / {s.capacity_persons}</strong></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
