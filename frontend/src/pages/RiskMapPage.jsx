import React from 'react';
import RiskGauge from '../components/RiskGauge';
import { ShieldAlert, AlertTriangle, MapPin, Zap, CheckCircle2 } from 'lucide-react';

export default function RiskMapPage({ riskData, stormsData }) {
  const storms = stormsData?.storms || [];
  const summary = riskData?.summary;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-slate-900">
              NATIONAL THUNDERSTORM RISK & EARLY WARNING
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            0–60 minute probabilistic risk synthesis for disaster mitigation and aviation advisories
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            DEMO / SIMULATED RISK MATRIX
          </span>
        </div>
      </div>

      {/* Main Risk Gauge */}
      <RiskGauge riskData={riskData} />

      {/* Regional Storm Hazard Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Regional Threat & Lightning Probability Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated multi-cell severity rankings across monitored meteorological sub-divisions
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
            Overall Status: {summary?.overall_risk_level || 'HIGH'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storms.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                s.estimated_risk === 'HIGH'
                  ? 'bg-red-50/40 border-red-200'
                  : s.estimated_risk === 'MODERATE'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-emerald-50/40 border-emerald-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                    {s.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      s.estimated_risk === 'HIGH'
                        ? 'bg-red-600 text-white'
                        : s.estimated_risk === 'MODERATE'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {s.estimated_risk} RISK
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{s.region}</span>
                </p>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Lightning Probability:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {(s.lightning_probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Radar Core:</span>
                    <span className="font-mono font-bold text-red-600">{s.intensity_dbz} dBZ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Forward Speed:</span>
                    <span className="font-mono text-slate-700">{s.movement_speed_kmh} km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Echo Top: {s.echo_top_km} km</span>
                <span className="font-mono font-semibold">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
