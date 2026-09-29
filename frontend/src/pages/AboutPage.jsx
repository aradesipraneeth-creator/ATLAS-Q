import React from 'react';
import { Info, CheckCircle2, Calendar, Target, Zap, Cpu, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* SIH Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/30 px-3 py-1 rounded-full text-xs font-semibold text-sky-300 mb-3">
          <span>Smart India Hackathon (SIH) 2026</span>
          <span>•</span>
          <span>Problem Statement #26072</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          ATLAS-Q
        </h2>
        <p className="text-sm sm:text-base font-medium text-sky-200 mt-1">
          Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization
        </p>
        <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-3xl leading-relaxed">
          <strong>Problem Statement:</strong> "AIML based Nowcasting of thunderstorm and lightning using atmospheric observation including multiple radars, satellite, lightning and model data."
        </p>
      </div>

      {/* Immediate Objective & Phase 1 Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-sky-700 font-bold text-sm mb-2">
            <Target className="w-4 h-4" />
            <h3>Phase 1 Immediate Objective</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Create an operational, deployable full-stack prototype that demonstrates the multimodal data fusion pipeline, interactive weather radar and lightning visualization across India, continuous-time storm cell tracking, and classical quantum-inspired hyperparameter optimization.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fully deployable on Render with a single public URL</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-2">
            <Cpu className="w-4 h-4" />
            <h3>Quantum-Inspired Classical Search</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            ATLAS-Q utilizes Quantum-Inspired Simulated Annealing (QSA) and Quantum Particle Swarm Optimization (QPSO) running entirely on <strong>classical hardware (CPU/GPU)</strong>. This avoids the cost and cryogenic requirements of quantum computing while yielding superior parameter search efficiency compared to standard greedy optimizers.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-indigo-700">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Zero quantum hardware dependency — 100% portable classical execution</span>
          </div>
        </div>
      </div>

      {/* Roadmap Comparison Table: Current Prototype vs Future Implementation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              System Evolution Roadmap: Prototype vs Production
            </h3>
            <p className="text-xs text-slate-500">
              Transparent demarcation between Phase 1 demonstration capabilities and full-scale deployment
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Subsystem Dimension</th>
                <th className="py-2.5 px-3 bg-amber-50/50 text-amber-900">Phase 1: Current Working Prototype</th>
                <th className="py-2.5 px-3 bg-sky-50/50 text-sky-900">Phase 2 & 3: Future Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Atmospheric Data Feeds</td>
                <td className="py-3 px-3 text-slate-700 bg-amber-50/20">
                  Structured realistic demo datasets simulating IMD DWR radars, INSAT-3D, IITM Damini lightning, and WRF models.
                </td>
                <td className="py-3 px-3 text-slate-700 bg-sky-50/20">
                  Live real-time automated API & NetCDF/HDF5 ingestion from IMD MOSDAC & NCMRWF streaming data pipes.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Deep Learning Models</td>
                <td className="py-3 px-3 text-slate-700 bg-amber-50/20">
                  Modular prototype architecture; synthetic inference simulation with zero heavy GPU overhead.
                </td>
                <td className="py-3 px-3 text-slate-700 bg-sky-50/20">
                  Trained 3D CNNs for echo cores, Liquid Neural Networks (LNN) for continuous ODE dynamics, and Spatio-temporal GNNs.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Optimization Engine</td>
                <td className="py-3 px-3 text-slate-700 bg-amber-50/20">
                  Classical CPU-based Quantum-Inspired Simulated Annealing (QSA) landscape visualization and benchmark metrics.
                </td>
                <td className="py-3 px-3 text-slate-700 bg-sky-50/20">
                  Distributed classical Q-swarms running parallel hyperparameter tuning and optional QPU hybrid acceleration.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-900">Nowcast Dissemination</td>
                <td className="py-3 px-3 text-slate-700 bg-amber-50/20">
                  Interactive web dashboard, vector SVG map, risk tiers, and trajectory playback.
                </td>
                <td className="py-3 px-3 text-slate-700 bg-sky-50/20">
                  Automated CAP (Common Alerting Protocol) warnings, GeoJSON vector layers, and SMS/WhatsApp API triggers for NDMA/SDMAs.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Technologies & Standards Adopted
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Web Framework</span>
            <span className="font-bold text-slate-900 text-sm">React 18 + Vite</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">High-performance SPA</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Styling Engine</span>
            <span className="font-bold text-slate-900 text-sm">Tailwind CSS</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Clean scientific UI</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">REST API Backend</span>
            <span className="font-bold text-slate-900 text-sm">Python FastAPI</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Uvicorn ASGI server</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Deployment</span>
            <span className="font-bold text-slate-900 text-sm">Render Platform</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Zero-downtime service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
