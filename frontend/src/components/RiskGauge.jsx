import React from 'react';
import { ShieldAlert, AlertTriangle, Zap, Activity, Wind, HelpCircle } from 'lucide-react';

export default function RiskGauge({ riskData }) {
  const summary = riskData?.summary || {
    overall_risk_level: 'HIGH',
    overall_lightning_probability: 0.94,
    max_storm_intensity_dbz: 54.2,
    peak_movement_speed_kmh: 46.5,
    forecast_uncertainty_score: 0.12,
    confidence_percentage: 88.0,
    high_risk_zones: [
      { zone: 'Kolkata Metropolitan Area & Howrah', lead_time_min: 25, primary_hazard: 'Severe Cloud-to-Ground Lightning & Hail' },
      { zone: 'Bhubaneswar - Cuttack Urban Corridor', lead_time_min: 35, primary_hazard: 'Intense Squall Line & Gusts > 70 km/h' },
      { zone: 'Delhi South & Faridabad Belt', lead_time_min: 40, primary_hazard: 'Isolated Severe Convective Gusts' }
    ]
  };

  const riskLevel = summary.overall_risk_level;
  const probPercent = Math.round(summary.overall_lightning_probability * 100);

  // SVG Gauge calculations
  // Angle from -180 deg to 0 deg (semi-circle)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  // Percentage to dash offset: (1 - probPercent/100) * circumference
  const strokeDashoffset = circumference * (1 - probPercent / 100);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              THUNDERSTORM RISK ASSESSMENT
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bayesian multi-sensor nowcast hazard categorization
            </p>
          </div>
        </div>

        {/* Mandatory demo disclaimer */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>DEMO DATA — SYNTHETIC SIMULATION</span>
        </div>
      </div>

      {/* Main Grid: Gauge + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Semi-circular Radial Gauge (Left 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
          <div className="relative w-52 h-28 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Animated Value Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Center Gauge Reading */}
            <div className="absolute bottom-0 text-center">
              <span className="text-3xl font-extrabold font-mono text-slate-900 leading-none block">
                {probPercent}%
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mt-1">
                Hazard Index
              </span>
            </div>
          </div>

          {/* Three Risk Tiers Indicator Bar */}
          <div className="w-full grid grid-cols-3 gap-1.5 mt-4 text-center">
            <div
              className={`py-1.5 px-2 rounded text-xs font-bold font-mono transition ${
                riskLevel === 'LOW'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                  : 'bg-emerald-100 text-emerald-800 opacity-60'
              }`}
            >
              LOW (0-40%)
            </div>
            <div
              className={`py-1.5 px-2 rounded text-xs font-bold font-mono transition ${
                riskLevel === 'MODERATE'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-amber-100 text-amber-800 opacity-60'
              }`}
            >
              MODERATE
            </div>
            <div
              className={`py-1.5 px-2 rounded text-xs font-bold font-mono transition ${
                riskLevel === 'HIGH'
                  ? 'bg-red-600 text-white ring-2 ring-red-300 animate-pulse'
                  : 'bg-red-100 text-red-800 opacity-60'
              }`}
            >
              HIGH (75%+)
            </div>
          </div>
        </div>

        {/* 4 Supporting Metrics Cards (Right 7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Lightning Probability</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-slate-900">
              {(summary.overall_lightning_probability * 100).toFixed(0)}%
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Peak strike density &gt; 60 flashes/min
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Storm Intensity</span>
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-red-600">
              {summary.max_storm_intensity_dbz} dBZ
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Severe hail & precipitation core
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Movement Speed</span>
              <Wind className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-2xl font-bold font-mono text-slate-900">
              {summary.peak_movement_speed_kmh} km/h
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Direction: Southeast (135°)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Model Uncertainty</span>
              <HelpCircle className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-slate-900">
              ±{(summary.forecast_uncertainty_score * 100).toFixed(0)}%
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Ensemble Confidence: {summary.confidence_percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Regional High Risk Advisory List */}
      {summary.high_risk_zones && summary.high_risk_zones.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block mb-2">
            Priority Alert Corridors (Next 60 Minutes)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {summary.high_risk_zones.map((z, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg border border-red-200 bg-red-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-950 truncate">{z.zone}</span>
                    <span className="font-mono text-[10px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">
                      {z.lead_time_min}m Lead
                    </span>
                  </div>
                  <p className="text-[11px] text-red-800 mt-1">{z.primary_hazard}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
