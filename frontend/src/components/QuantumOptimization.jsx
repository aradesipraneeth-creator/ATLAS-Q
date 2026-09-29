import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Sparkles, Sliders, RefreshCw } from 'lucide-react';

export default function QuantumOptimization({ data }) {
  const [iteration, setIteration] = useState(data?.current_iteration || 420);
  const [isIterating, setIsIterating] = useState(true);

  // Subtle animated iteration counter to simulate optimization progress
  useEffect(() => {
    if (!isIterating) return;
    const timer = setInterval(() => {
      setIteration((prev) => (prev >= 500 ? 380 : prev + 1));
    }, 800);
    return () => clearInterval(timer);
  }, [isIterating]);

  const candidateStates = data?.candidate_states || [
    { id: 'Q-State #1', tunneling_prob: 0.84, energy: 0.0428, status: 'Global Optimum Candidate', selected: true },
    { id: 'Q-State #2', tunneling_prob: 0.41, energy: 0.0612, status: 'Sub-optimal Well', selected: false },
    { id: 'Q-State #3', tunneling_prob: 0.22, energy: 0.0784, status: 'Local Minimum Escape', selected: false },
    { id: 'Q-State #4', tunneling_prob: 0.15, energy: 0.0890, status: 'Exploring High Barrier', selected: false }
  ];

  const params = data?.parameters_optimized || [
    { name: 'Doppler Attenuation Correction α', value: '0.038 dB/km' },
    { name: 'Convective Initiation Threshold γ', value: '36.4 dBZ' },
    { name: 'GNN Outflow Edge Distance Radius', value: '42.0 km' },
    { name: 'LNN Continuous Time Constant τ', value: '1.28 s' },
    { name: 'Lightning Flash Clustered DBSCAN ε', value: '3.5 km' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              QUANTUM-INSPIRED OPTIMIZATION (QIO)
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
                SIMULATED ON CLASSICAL CPU
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated Quantum Annealing (SQA) & Quantum Particle Swarm parameter search
            </p>
          </div>
        </div>

        {/* Clear disclaimer */}
        <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Simulation on Classical Hardware — No Quantum Hardware Used</span>
        </div>
      </div>

      {/* Explanatory Quote as requested */}
      <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 mb-4 flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Core Objective:</strong> "Optimizes model configuration, feature selection and decision parameters using quantum-inspired search techniques on classical hardware."
        </p>
      </div>

      {/* Top 3 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Search Space Manifold</span>
          <span className="text-xl font-bold font-mono text-slate-900">8 Dimensions</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Non-convex loss landscape</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Candidate Solutions</span>
          <span className="text-xl font-bold font-mono text-indigo-600">32 Q-State Replicas</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Quantum tunneling exploration</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] font-semibold text-slate-500 block uppercase">Best Configuration</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold font-mono text-emerald-600">Loss: 0.0428</span>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              +53.2% vs Greedy
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">Iteration: {iteration} / 500</span>
        </div>
      </div>

      {/* Animated Optimization Landscape Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Landscape SVG */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Simulated Energy Landscape & Quantum Tunneling
            </span>
            <button
              onClick={() => setIsIterating(!isIterating)}
              className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200"
            >
              <RefreshCw className={`w-3 h-3 ${isIterating ? 'animate-spin' : ''}`} />
              <span>{isIterating ? 'Simulating' : 'Paused'}</span>
            </button>
          </div>

          <div className="w-full h-44 bg-white rounded-lg border border-slate-200 p-2 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              <defs>
                <linearGradient id="potentialGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Energy potential curve: multi-well landscape V(x) */}
              <path
                d="M 10 30 Q 50 140 100 130 T 180 80 T 260 140 T 340 70 T 390 120 L 390 150 L 10 150 Z"
                fill="url(#potentialGrad)"
              />
              <path
                d="M 10 30 Q 50 140 100 130 T 180 80 T 260 140 T 340 70 T 390 120"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />

              {/* Classical barrier trap indicator */}
              <text x="175" y="70" fontSize="9" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
                Energy Barrier
              </text>
              <line x1="180" y1="75" x2="180" y2="95" stroke="#cbd5e1" strokeDasharray="2,2" strokeWidth="1" />

              {/* Global minimum (Best Configuration) */}
              <g className="animate-bounce" style={{ transformOrigin: '260px 140px' }}>
                <circle cx="260" cy="138" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <circle cx="260" cy="138" r="14" fill="#10b981" fillOpacity="0.2" />
                <text x="260" y="115" fontSize="9" fontWeight="bold" fill="#047857" textAnchor="middle" fontFamily="monospace">
                  Best State (E=0.0428)
                </text>
              </g>

              {/* Exploring particles (Tunneling states) */}
              <g>
                <circle cx="95" cy="128" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                <text x="95" y="112" fontSize="8" fill="#4338ca" textAnchor="middle" fontFamily="monospace">
                  Local Well #1
                </text>
                {/* Tunneling probability wave */}
                <path
                  d="M 100 128 C 140 110, 220 110, 255 136"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              </g>

              <circle cx="340" cy="72" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="388" cy="118" r="4.5" fill="#94a3b8" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-200">
            <span>Tunneling Acceptance Rate: 78.4%</span>
            <span>Temperature Schedule: T=0.021</span>
          </div>
        </div>

        {/* Candidate Solutions & Optimized Parameters Table */}
        <div className="space-y-3">
          {/* Candidate states */}
          <div className="border border-slate-200 rounded-xl p-3 bg-white">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block mb-2">
              Candidate Quantum Solution States
            </span>
            <div className="space-y-1.5">
              {candidateStates.map((st) => (
                <div
                  key={st.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono border ${
                    st.selected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${st.selected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    <span>{st.id}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span>P(tunnel): {(st.tunneling_prob * 100).toFixed(0)}%</span>
                    <span>E = {st.energy.toFixed(4)}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200">
                      {st.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tuned physical parameters */}
          <div className="border border-slate-200 rounded-xl p-3 bg-white">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block mb-1.5">
              Optimal Parameter Configuration (Classical CPU Output)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {params.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-1.5 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-600 text-[11px] truncate">{p.name}</span>
                  <span className="font-mono font-bold text-slate-900 ml-1 shrink-0">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
