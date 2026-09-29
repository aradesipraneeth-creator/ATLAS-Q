import React from 'react';
import { Layers, Box, Cpu, Network, Radar, BarChart2, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AiEngineArchitecture({ modules = [] }) {
  const steps = [
    {
      num: '01',
      title: 'MULTIMODAL DATA INGESTION',
      subtitle: 'Spatiotemporal Alignment',
      desc: 'Normalizes Radar (DWR), INSAT-3D satellite, IITM lightning, and NWP WRF fields onto a canonical 3D Cartesian spatial grid.',
      icon: Layers,
      badge: 'Prototype Pipeline'
    },
    {
      num: '02',
      title: '3D CNN CORE',
      subtitle: 'Storm Structure Extraction',
      desc: '3D volumetric convolutions extract bounded weak echo regions (BWER), echo tops (15km), and reflectivity gradients (dBZ).',
      icon: Box,
      badge: 'Prototype Architecture'
    },
    {
      num: '03',
      title: 'LIQUID NEURAL NETWORK (LNN)',
      subtitle: 'Continuous-Time Temporal Dynamics',
      desc: 'Differential equation-based continuous neurons model non-linear rapid convective cell growth without rigid time-step discretization.',
      icon: Cpu,
      badge: 'Prototype Architecture'
    },
    {
      num: '04',
      title: 'GRAPH NEURAL NETWORK (GNN)',
      subtitle: 'Storm-Cell Relationships',
      desc: 'Nodes model individual convective cores; dynamic edges represent cold-pool outflows, cell mergers, and gust fronts.',
      icon: Network,
      badge: 'Prototype Architecture'
    },
    {
      num: '05',
      title: 'STORM DETECTION & TRACKING',
      subtitle: 'Probabilistic Kinematic Trajectory',
      desc: 'Kalman filtering combined with learned optical flow tracks centroids from T-30m to projected T+30m vectors.',
      icon: Radar,
      badge: 'Prototype Architecture'
    },
    {
      num: '06',
      title: 'PROBABILISTIC NOWCAST',
      subtitle: '0–60 Min Hazard Ensembles',
      desc: 'Generates spatiotemporal risk maps for lightning initiation (0–100%), severe wind microbursts, and hail probability.',
      icon: BarChart2,
      badge: 'Prototype Architecture'
    },
    {
      num: '07',
      title: 'QUANTUM-INSPIRED OPTIMIZATION',
      subtitle: 'Hyperparameter Tuning & Ensembling',
      desc: 'Quantum-inspired simulated annealing (QSA) optimizes multi-objective loss and sensor weighting on classical hardware.',
      icon: Cpu,
      badge: 'Simulated on Classical HW'
    },
    {
      num: '08',
      title: 'RISK + UNCERTAINTY QUANTIFICATION',
      subtitle: 'Decision Support & Warning Tiers',
      desc: 'Calibrated Bayesian output tiers (LOW, MODERATE, HIGH) delivered with confidence boundaries for disaster authorities.',
      icon: ShieldAlert,
      badge: 'Operational Simulation'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-5 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            ATLAS-Q DEEP LEARNING & NOWCASTING ENGINE
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-stack multimodal artificial intelligence pipeline for thunderstorm and lightning nowcasting
          </p>
        </div>

        {/* Mandatory Prototype Architecture Label */}
        <div className="flex items-center space-x-2 bg-amber-50 border border-amber-300 px-3 py-1 rounded text-xs font-semibold text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>PROTOTYPE ARCHITECTURE — AI PIPELINE SPECIFICATION</span>
        </div>
      </div>

      {/* Grid of pipeline architecture blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="relative bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between hover:border-sky-300 hover:bg-sky-50/30 transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    STEP {s.num}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {s.badge}
                  </span>
                </div>

                <div className="flex items-center space-x-2 my-2">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-sky-700 shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{s.title}</h4>
                    <span className="text-[11px] text-sky-800 font-semibold block">{s.subtitle}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Step indicator arrow */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono">Module #{idx + 1}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
