import React from 'react';
import { X, AlertTriangle, Zap, Radio, Wind, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function StormDetailModal({ storm, onClose, onSelectForTracking }) {
  if (!storm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {storm.id}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                  storm.estimated_risk === 'HIGH'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : storm.estimated_risk === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {storm.estimated_risk} RISK
              </span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                {storm.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{storm.name}</h3>
            <p className="text-xs text-slate-500">{storm.region} • Nearest: {storm.nearest_radar}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center space-x-2 text-xs text-amber-900 font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>DEMO DATA — Simulated meteorological readings for Phase 1 architectural evaluation</span>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Synopsis */}
          <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
            {storm.description}
          </div>

          {/* Telemetry Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Radar Reflectivity</span>
              <span className="text-lg font-bold font-mono text-red-600">{storm.intensity_dbz} dBZ</span>
              <span className="text-[10px] text-slate-500 block">Peak core reflectivity</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Echo Top</span>
              <span className="text-lg font-bold font-mono text-slate-900">{storm.echo_top_km} km</span>
              <span className="text-[10px] text-slate-500 block">AGL Tropospheric penetration</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Lightning Flash Rate</span>
              <span className="text-lg font-bold font-mono text-amber-600">{storm.lightning_rate_per_min} /min</span>
              <span className="text-[10px] text-slate-500 block">IITM / Damini sensor feed</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">CAPE Energy</span>
              <span className="text-lg font-bold font-mono text-indigo-600">{storm.cape_joules} J/kg</span>
              <span className="text-[10px] text-slate-500 block">Severe Instability Threshold</span>
            </div>
          </div>

          {/* Hazard Probabilities */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight mb-3">
              Probabilistic 30-Minute Threat Forecast
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Cloud-to-Ground Lightning Strike
                  </span>
                  <span className="font-mono text-amber-700">{(storm.lightning_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${storm.lightning_probability * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-sky-500" /> Hail Nucleation Potential (≥ 2cm)
                  </span>
                  <span className="font-mono text-sky-700">{(storm.hail_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all"
                    style={{ width: `${storm.hail_probability * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-indigo-500" /> Severe Gust Front (&gt; 65 km/h)
                  </span>
                  <span className="font-mono text-indigo-700">{(storm.gust_front_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${storm.gust_front_probability * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Coordinates: {storm.lat}°N, {storm.lon}°E
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onClose();
                if (onSelectForTracking) onSelectForTracking(storm);
              }}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition"
            >
              <span>Track in Timeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
