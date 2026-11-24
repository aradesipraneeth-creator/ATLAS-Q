import React from 'react';
import { X, AlertTriangle, Zap, Radio, Wind, TrendingUp, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function StormDetailModal({ storm, onClose, onSelectForTracking }) {
  if (!storm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#28191D]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FFF3F0] rounded-[2rem] max-w-2xl w-full border border-[#EBDCD8] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EBDCD8] bg-[#FFFFFF] flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-[#28191D] text-[#FFF3F0] px-2.5 py-0.5 rounded-full">
                {storm.id}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  storm.estimated_risk === 'CRITICAL' || storm.estimated_risk === 'HIGH'
                    ? 'bg-[#A51F52] text-white'
                    : 'bg-[#D3E4B7] text-[#28191D]'
                }`}
              >
                {storm.estimated_risk} RISK
              </span>
              <span className="text-xs bg-[#FFF3F0] border border-[#EBDCD8] text-[#735E60] px-2 py-0.5 rounded-full font-mono">
                {storm.status}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#28191D] font-headline mt-1.5">{storm.name}</h3>
            <p className="text-xs text-[#735E60]">{storm.region} • Nearest Radar: {storm.nearest_radar}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4E3E6] text-[#735E60] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Synopsis */}
          <div className="text-xs text-[#28191D] bg-[#FFFFFF] p-4 rounded-2xl border border-[#EBDCD8] leading-relaxed">
            {storm.description}
          </div>

          {/* Telemetry Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#EBDCD8]">
              <span className="text-[10px] text-[#735E60] font-semibold uppercase block">Reflectivity</span>
              <span className="text-xl font-bold font-mono text-[#A51F52]">{storm.intensity_dbz} dBZ</span>
              <span className="text-[10px] text-[#735E60] block mt-0.5">Peak core echo</span>
            </div>
            <div className="p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#EBDCD8]">
              <span className="text-[10px] text-[#735E60] font-semibold uppercase block">Echo Top</span>
              <span className="text-xl font-bold font-mono text-[#28191D]">{storm.echo_top_km} km</span>
              <span className="text-[10px] text-[#735E60] block mt-0.5">Troposphere AGL</span>
            </div>
            <div className="p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#EBDCD8]">
              <span className="text-[10px] text-[#735E60] font-semibold uppercase block">Lightning Rate</span>
              <span className="text-xl font-bold font-mono text-[#28191D]">{storm.lightning_rate_per_min} /min</span>
              <span className="text-[10px] text-[#735E60] block mt-0.5">IITM Damini feed</span>
            </div>
            <div className="p-3.5 bg-[#FFFFFF] rounded-2xl border border-[#EBDCD8]">
              <span className="text-[10px] text-[#735E60] font-semibold uppercase block">CAPE Energy</span>
              <span className="text-xl font-bold font-mono text-[#28191D]">{storm.cape_joules} J/kg</span>
              <span className="text-[10px] text-[#735E60] block mt-0.5">Severe instability</span>
            </div>
          </div>

          {/* Hazard Probabilities */}
          <div className="border border-[#EBDCD8] rounded-2xl p-4 bg-[#FFFFFF] space-y-3">
            <h4 className="text-xs font-bold text-[#28191D] uppercase tracking-wider font-mono">
              30-Minute Threat Forecast
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-[#28191D] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#A51F52]" /> Cloud-to-Ground Lightning Strike
                  </span>
                  <span className="font-mono text-[#A51F52] font-bold">{(storm.lightning_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#FFF3F0] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#A51F52] h-full rounded-full"
                    style={{ width: `${storm.lightning_probability * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-[#28191D] flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-[#28191D]" /> Hail Potential (≥ 2.5cm)
                  </span>
                  <span className="font-mono text-[#28191D] font-bold">{(storm.hail_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#FFF3F0] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#28191D] h-full rounded-full"
                    style={{ width: `${storm.hail_probability * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EBDCD8] bg-[#FFFFFF] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#735E60]">
            Lat: {storm.lat}°N, Lon: {storm.lon}°E
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onClose();
                if (onSelectForTracking) onSelectForTracking(storm);
              }}
              className="px-4 py-2 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] text-xs font-bold transition flex items-center space-x-1"
            >
              <span>Track in Timeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#EBDCD8] text-[#735E60] hover:bg-[#FFF3F0] text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
