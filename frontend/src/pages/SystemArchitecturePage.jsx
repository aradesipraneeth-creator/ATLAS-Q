import React from 'react';
import MultimodalPipeline from '../components/MultimodalPipeline';
import AiEngineArchitecture from '../components/AiEngineArchitecture';
import QuantumOptimization from '../components/QuantumOptimization';
import { Layers, AlertTriangle, Cpu, Code2, Server } from 'lucide-react';

export default function SystemArchitecturePage({ archData }) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900">
              SYSTEM ARCHITECTURE & AI ENGINE SPECIFICATION
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end meteorological data assimilation, continuous-time AI modeling, and quantum-inspired optimization
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            PHASE 1 PROTOTYPE ARCHITECTURE
          </span>
        </div>
      </div>

      {/* Multimodal Harmonization Pipeline */}
      <MultimodalPipeline sources={archData?.multimodal_pipeline} />

      {/* ATLAS-Q AI Engine Modular Breakdown */}
      <AiEngineArchitecture modules={archData?.ai_engine_layers} />

      {/* Quantum-Inspired Optimization Module */}
      <QuantumOptimization data={archData?.quantum_optimization} />

      {/* Software Architecture & Deployment Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-600" />
          Technical Stack & Microservice Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Frontend Layer</span>
            <h4 className="font-bold text-slate-900 text-sm">React + Vite + Tailwind CSS</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Scientific dashboard with vector SVG maps, custom canvas animations, responsive layout, and Lucide icons.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">API & Ingestion Backend</span>
            <h4 className="font-bold text-slate-900 text-sm">Python FastAPI + Uvicorn</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              High-performance asynchronous REST endpoints providing structured meteorological telemetry and nowcast vectors.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Cloud Deployment</span>
            <h4 className="font-bold text-slate-900 text-sm">Render Web Service</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Single-service unified container serving both compiled frontend static SPA and API routes with zero-config port binding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
