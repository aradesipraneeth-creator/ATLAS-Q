import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Waves, 
  Wind, 
  Users, 
  Home, 
  Truck, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  TrendingDown, 
  ArrowUpRight, 
  Layers, 
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchDisasterImpact, runDisasterOptimization } from '../services/api';

export default function DisasterManagementPage() {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [qsaResults, setQsaResults] = useState(null);
  const [problemType, setProblemType] = useState('shelter_dispatch');
  const [activeTab, setActiveTab] = useState('impact'); // 'impact' or 'qsa'

  const loadImpact = async () => {
    try {
      setLoading(true);
      const res = await fetchDisasterImpact();
      setImpactData(res.impact);
    } catch (err) {
      console.error('Failed to load disaster impact:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImpact();
  }, []);

  const handleRunQSA = async () => {
    try {
      setOptimizing(true);
      const res = await runDisasterOptimization(problemType, 12, 4);
      setQsaResults(res.solution);
    } catch (err) {
      console.error('Error running QSA solver:', err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 03 Header & Editorial Hero with Glassmorphism */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 glass-pill text-[#28191D] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A51F52]"></span>
            <span>03 — Disaster Management</span>
            <span>•</span>
            <span>Multi-Hazard Response & Quantum-Inspired Logistics</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>NDMA Incident Command Protocol 4</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EBDCD8]">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
              disaster management.
            </h1>
            <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
              Actionable impact assessment, population vulnerability indices, emergency shelter logistics, 
              and classical CPU Quantum-Inspired Simulated Annealing (QSA) for optimal resource allocation.
            </p>
          </div>

          {/* Section Mode Switcher in Glass Pill */}
          <div className="inline-flex p-1.5 glass-panel rounded-full shadow-xs">
            <button
              onClick={() => setActiveTab('impact')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'impact'
                  ? 'bg-[#A51F52] text-white shadow-xs'
                  : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Impact & Shelters</span>
            </button>
            <button
              onClick={() => setActiveTab('qsa')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'qsa'
                  ? 'bg-[#A51F52] text-white shadow-xs'
                  : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>QSA Optimization Engine</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: IMPACT, EXPOSURE & SHELTERS */}
      {/* ========================================================================= */}
      {activeTab === 'impact' && (
        <div className="space-y-8">
          {/* Glass KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel glass-card-hover rounded-3xl p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block">POPULATION EXPOSED</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[#28191D] font-headline">
                  {impactData?.population_exposed_total?.toLocaleString() || '1,360,500'}
                </span>
                <span className="text-xs text-[#735E60]">citizens</span>
              </div>
              <span className="text-[11px] text-[#A51F52] font-semibold block">Across 3 Coastal Hazard Sectors</span>
            </div>

            <div className="glass-panel glass-card-hover rounded-3xl p-6 space-y-2 border-[#ebd0d6]" style={{ background: 'rgba(244, 227, 230, 0.65)' }}>
              <span className="text-[10px] font-mono uppercase font-bold text-[#A51F52] block">EVACUATED TO DATE</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[#28191D] font-headline">
                  {impactData?.population_evacuated_total?.toLocaleString() || '87,700'}
                </span>
                <span className="text-xs font-mono font-bold text-[#A51F52]">
                  ({impactData?.overall_evacuation_pct || 6.4}%)
                </span>
              </div>
              <span className="text-[11px] text-[#735E60] block font-mono">Target: Clearance by T-6h</span>
            </div>

            <div className="glass-panel glass-card-hover rounded-3xl p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block">CYCLONE SHELTER LOAD</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[#28191D] font-headline">
                  {impactData?.shelter_total_occupancy?.toLocaleString() || '6,960'}
                </span>
                <span className="text-xs text-[#735E60]">/ {impactData?.shelter_total_capacity?.toLocaleString() || '9,500'}</span>
              </div>
              <div className="w-full bg-[#EBDCD8] h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-[#A51F52] h-full rounded-full" 
                  style={{ width: `${impactData?.shelter_occupancy_pct || 73.2}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-[#735E60] block font-mono">Capacity Occupied: {impactData?.shelter_occupancy_pct || 73.2}%</span>
            </div>

            <div className="glass-panel glass-card-hover rounded-3xl p-6 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block">NDRF / SDRF UNITS</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[#28191D] font-headline">
                  4 Teams
                </span>
                <span className="text-xs text-[#735E60]">175 personnel</span>
              </div>
              <span className="text-[11px] text-[#28191D] font-semibold block">34 Inflatable Rescue Boats</span>
            </div>
          </div>

          {/* Evacuation Sectors & Designated Shelters in Glass Panes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evacuation Sectors */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
                <div>
                  <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                    coastal evacuation sectors.
                  </h3>
                  <p className="text-xs text-[#735E60]">Real-time clearance progression and route bottleneck monitoring.</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#D3E4B7] text-[#28191D] px-2.5 py-1 rounded-full">
                  CIVIL PROTOCOL
                </span>
              </div>

              <div className="space-y-3">
                {impactData?.evacuation_zones?.map((zone) => (
                  <div key={zone.zone_id} className="p-4 rounded-2xl glass-panel border border-white/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold bg-[#28191D] text-white px-2 py-0.5 rounded-full">
                          {zone.zone_id}
                        </span>
                        <h4 className="text-sm font-bold text-[#28191D]">{zone.name}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        zone.risk_level === 'CRITICAL' ? 'bg-[#A51F52] text-white' : 'bg-[#d97706] text-white'
                      }`}>
                        {zone.risk_level}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-[10px] text-[#735E60] block font-sans">POPULATION</span>
                        <span className="font-bold text-[#28191D]">{zone.estimated_population.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#735E60] block font-sans">EVACUATED</span>
                        <span className="font-bold text-[#A51F52]">{zone.evacuated_count.toLocaleString()} ({zone.clearance_progress_pct}%)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#735E60] block font-sans">SURGE THREAT</span>
                        <span className="font-bold text-[#28191D]">+{zone.surge_threat_m} m</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#735E60] pt-1 border-t border-[#EBDCD8]/60">
                      <strong>Route Status:</strong> {zone.bottlenecks}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Designated Shelters */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
                <div>
                  <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                    cyclone & flood relief shelters.
                  </h3>
                  <p className="text-xs text-[#735E60]">Engineered storm-resilient refuges with medical & water backup.</p>
                </div>
                <button
                  onClick={() => setActiveTab('qsa')}
                  className="text-xs font-bold text-[#A51F52] hover:underline flex items-center space-x-1"
                >
                  <span>Optimize Dispatch</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {impactData?.shelters?.map((shelter) => {
                  const pct = Math.round((shelter.current_occupancy / shelter.capacity_persons) * 100);
                  return (
                    <div key={shelter.id} className="p-4 rounded-2xl glass-panel border border-white/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#28191D]">{shelter.name}</h4>
                          <span className="text-[11px] text-[#735E60] font-mono">{shelter.district}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          pct > 85 ? 'bg-[#A51F52] text-white' : 'bg-[#D3E4B7] text-[#28191D]'
                        }`}>
                          {pct}% FILLED
                        </span>
                      </div>

                      <div className="w-full bg-[#EBDCD8] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${pct > 85 ? 'bg-[#A51F52]' : 'bg-[#28191D]'}`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#735E60] pt-1">
                        <span>Capacity: <strong>{shelter.current_occupancy}</strong> / {shelter.capacity_persons}</span>
                        <span>Water: {shelter.water_reserve_liters?.toLocaleString()} L • Gen: {shelter.power_backup ? 'YES' : 'NO'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: QUANTUM-INSPIRED OPTIMIZATION WORKSPACE */}
      {/* ========================================================================= */}
      {activeTab === 'qsa' && (
        <div className="space-y-8">
          {/* QSA Config & Runner in Glass */}
          <div className="glass-panel rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBDCD8]">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A51F52] animate-pulse"></span>
                  <h3 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
                    quantum-inspired simulated annealing (qsa).
                  </h3>
                </div>
                <p className="text-xs text-[#735E60] font-sans">
                  Simulates transverse magnetic tunneling ($\Gamma$) across non-convex energy barriers on classical hardware to optimize emergency logistics.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  className="glass-panel rounded-2xl px-4 py-2 text-xs font-semibold text-[#28191D] focus:outline-none border border-white/60"
                >
                  <option value="shelter_dispatch">Shelter Capacity & Evacuee Allocation</option>
                  <option value="rescue_units">Rescue Boat & NDRF Team Placement</option>
                  <option value="relief_logistics">Essential Medical & Water Supply Chains</option>
                </select>

                <button
                  onClick={handleRunQSA}
                  disabled={optimizing}
                  className="inline-flex items-center space-x-2 bg-[#A51F52] hover:bg-[#8e1945] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-full transition shadow-sm"
                >
                  {optimizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Execute QSA Benchmark</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Benchmark Comparison Cards */}
            {qsaResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#735E60] block font-mono">QSA OBJECTIVE ENERGY</span>
                    <span className="text-2xl font-extrabold text-[#A51F52] font-mono">
                      {qsaResults.quantum_inspired_solution?.objective_energy_score?.toFixed(4)}
                    </span>
                    <span className="text-[11px] text-[#28191D] block font-medium">
                      Runtime: {qsaResults.quantum_inspired_solution?.execution_time_ms} ms
                    </span>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#735E60] block font-mono">CLASSICAL SA BASELINE</span>
                    <span className="text-2xl font-extrabold text-[#735E60] font-mono">
                      {qsaResults.classical_baseline?.objective_energy_score?.toFixed(4)}
                    </span>
                    <span className="text-[11px] text-[#735E60] block font-medium">
                      Runtime: {qsaResults.classical_baseline?.execution_time_ms} ms
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#c4db9e] space-y-2 bg-[#D3E4B7]/80">
                    <span className="text-[10px] uppercase font-bold text-[#28191D] block font-mono">TUNNELING ADVANTAGE</span>
                    <span className="text-2xl font-extrabold text-[#28191D] font-mono">
                      +{qsaResults.comparison_metrics?.energy_improvement_pct}%
                    </span>
                    <span className="text-[11px] text-[#28191D] block font-semibold">
                      Better coverage vs. greedy heuristic
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#28191D]">
                    Allocated Facility Coordinates (Top Optimal Configuration)
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {qsaResults.quantum_inspired_solution?.allocation_coordinates?.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl glass-pill text-[#28191D]">
                        Facility {i + 1}: ({c[0].toFixed(2)}°N, {c[1].toFixed(2)}°E)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 glass-panel rounded-2xl border border-dashed border-[#EBDCD8] space-y-3">
                <Cpu className="w-8 h-8 text-[#A51F52] mx-auto" />
                <h4 className="text-sm font-bold text-[#28191D]">Ready to Run QSA Allocation Solver</h4>
                <p className="text-xs text-[#735E60] max-w-md mx-auto">
                  Click "Execute QSA Benchmark" to solve multi-zone evacuation assignment and observe quantum tunneling escaping local minima on classical CPU.
                </p>
                <button
                  onClick={handleRunQSA}
                  className="px-4 py-2 bg-[#28191D] text-white text-xs font-bold rounded-full uppercase tracking-wider hover:bg-[#3d272d] transition shadow-xs"
                >
                  Run Benchmark Now
                </button>
              </div>
            )}

            <div className="p-4 rounded-2xl glass-pill text-xs text-[#735E60] space-y-1">
              <strong className="text-[#28191D] block">Scientific Integrity & Operational Notice:</strong>
              <p>
                ATLAS-Q runs matrix-based Quantum-Inspired Simulated Annealing on classical hardware. 
                No quantum hardware is used or required. The optimization output provides mathematical 
                decision support to assist disaster response planners; all civil evacuation and relocation orders 
                are issued exclusively by authorized government authorities (NDMA/SDMA).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
