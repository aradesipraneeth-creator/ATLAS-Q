import React from 'react';
import { CloudLightning, CloudRain, ShieldAlert, CheckCircle2, Radar, AlertTriangle } from 'lucide-react';

export default function HeroMetrics({ metrics, disclaimer }) {
  if (!metrics) return null;

  const cards = [
    {
      key: 'storm_activity',
      label: metrics.storm_activity?.label || 'Storm Activity',
      value: metrics.storm_activity?.value || '5 Active Cells',
      subtext: metrics.storm_activity?.subtext || '2 High Risk | 2 Moderate',
      icon: Radar,
      border: 'border-sky-200',
      bg: 'bg-sky-50/50',
      badgeBg: 'bg-sky-100 text-sky-800',
      iconColor: 'text-sky-600'
    },
    {
      key: 'lightning_prob',
      label: metrics.lightning_probability?.label || 'Lightning Probability',
      value: metrics.lightning_probability?.value || '94%',
      subtext: metrics.lightning_probability?.subtext || 'Peak convective core',
      icon: CloudLightning,
      border: 'border-amber-200',
      bg: 'bg-amber-50/50',
      badgeBg: 'bg-amber-100 text-amber-900',
      iconColor: 'text-amber-500'
    },
    {
      key: 'rainfall',
      label: metrics.rainfall_intensity?.label || 'Rainfall Intensity',
      value: metrics.rainfall_intensity?.value || '54.2 dBZ',
      subtext: metrics.rainfall_intensity?.subtext || 'Severe precipitation / Hail',
      icon: CloudRain,
      border: 'border-blue-200',
      bg: 'bg-blue-50/50',
      badgeBg: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      key: 'risk',
      label: metrics.risk_level?.label || 'Risk Level',
      value: metrics.risk_level?.value || 'HIGH',
      subtext: metrics.risk_level?.subtext || 'Eastern Sector severe alert',
      icon: ShieldAlert,
      border: 'border-red-200',
      bg: 'bg-red-50/50',
      badgeBg: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600'
    },
    {
      key: 'confidence',
      label: metrics.confidence?.label || 'Confidence',
      value: metrics.confidence?.value || '88%',
      subtext: metrics.confidence?.subtext || 'Multi-model ensemble variance ±12%',
      icon: CheckCircle2,
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/50',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header section with mandatory demo disclaimer badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              CURRENT WEATHER ANALYSIS
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time spatiotemporal multi-sensor nowcast synthesis (0–60 min horizon)
          </p>
        </div>

        {/* DEMO DATA DISCLAIMER BADGE */}
        <div className="flex items-center space-x-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-md text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>DEMO / SIMULATION DATA</span>
        </div>
      </div>

      {/* Hero Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.key}
              className={`rounded-xl border ${c.border} ${c.bg} p-4 transition-all duration-200 hover:shadow-xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-tight">
                  {c.label}
                </span>
                <div className="p-1.5 rounded-lg bg-white shadow-xs">
                  <Icon className={`w-4 h-4 ${c.iconColor}`} />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {c.value}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-600 font-medium leading-tight">
                {c.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
