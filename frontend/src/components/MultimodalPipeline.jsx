import React, { useState } from 'react';
import { Radio, Satellite, Zap, Wind, Cpu, ArrowDown, Database, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

export default function MultimodalPipeline({ sources = [] }) {
  const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id || 'radar');

  const sourceIconMap = {
    radar: Radio,
    satellite: Satellite,
    lightning: Zap,
    atmospheric: Wind,
    nwp: Database
  };

  const selectedSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            MULTIMODAL SENSOR HARMONIZATION PIPELINE
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronous spatiotemporal alignment across 5 diverse meteorological observation platforms
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold self-start sm:self-auto">
          5 / 5 DATA STREAMS SYNCHRONIZED
        </span>
      </div>

      {/* Interactive Visual Pipeline Flow */}
      <div className="space-y-4">
        {/* Source Cards Row */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Observation Ingestion Feeds (Click any sensor to inspect telemetry)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {sources.map((src) => {
              const Icon = sourceIconMap[src.id] || Radio;
              const isSelected = selectedSource?.id === src.id;

              return (
                <button
                  key={src.id}
                  onClick={() => setSelectedSourceId(src.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-1.5 rounded-md ${isSelected ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{src.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{src.source}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Downward Fusion Arrows */}
        <div className="flex justify-center my-1">
          <div className="flex flex-col items-center text-sky-600">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>

        {/* Fusion Core Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-xl p-4 flex flex-col justify-center shadow-xs">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-sky-300">STAGE 1</span>
            <h4 className="text-sm font-bold mt-0.5">MULTIMODAL FUSION</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Canonical 3D volumetric interpolation & temporal latency correction (1s – 15m).
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-4 flex flex-col justify-center shadow-xs">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-indigo-300">STAGE 2</span>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold">ATLAS-Q ENGINE</h4>
              <span className="text-[9px] font-mono bg-sky-500/30 text-sky-300 px-1.5 py-0.5 rounded">AI+QIO</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Liquid Neural Networks + Graph Attention for continuous-time cell propagation.
            </p>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-xl p-4 flex flex-col justify-center shadow-xs">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-300">OUTPUT</span>
            <h4 className="text-sm font-bold mt-0.5">PROBABILISTIC NOWCAST</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              0–60 min lightning hazard polygons, peak wind gust alerts & hail probabilities.
            </p>
          </div>
        </div>

        {/* Selected Sensor Information Panel */}
        {selectedSource && (
          <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 mt-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-3 border-b border-sky-200/60 gap-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  Sensor Specifications:
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {selectedSource.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Data Latency: <strong className="text-slate-800">{selectedSource.latency}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Operational Role</span>
                <p className="text-slate-700 mt-0.5 leading-normal">{selectedSource.role}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Spatial & Temporal Resolution</span>
                <p className="font-mono text-slate-800 font-medium mt-0.5">{selectedSource.resolution}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Provider: {selectedSource.source}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">Extracted Physical Parameters</span>
                <ul className="mt-1 space-y-0.5">
                  {selectedSource.parameters?.map((p, i) => (
                    <li key={i} className="flex items-center space-x-1 text-[11px] text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
