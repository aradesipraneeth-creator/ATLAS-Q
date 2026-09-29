import React from 'react';
import StormTrajectory from '../components/StormTrajectory';
import { Zap, Navigation, TrendingUp, AlertCircle, Compass } from 'lucide-react';

export default function StormTrackingPage({
  stormsData,
  selectedStorm,
  setSelectedStorm
}) {
  const storms = stormsData?.storms || [];
  const currentStorm = selectedStorm || storms[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              STORM CELL TRACKING & TRAJECTORY NOWCAST
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Non-linear spatiotemporal advection modeling: T-30m historical to T+30m projection
          </p>
        </div>

        {/* Storm Selector Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Select Storm:
          </label>
          <select
            value={currentStorm?.id || ''}
            onChange={(e) => {
              const matched = storms.find((s) => s.id === e.target.value);
              if (matched) setSelectedStorm(matched);
            }}
            className="text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            {storms.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name} ({s.intensity_dbz} dBZ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Trajectory Component */}
      {currentStorm && (
        <StormTrajectory storm={currentStorm} />
      )}

      {/* All Monitored Cells Trajectory Summary Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Synoptic Trajectory Vector Overview
            </h3>
            <p className="text-xs text-slate-500">
              Multi-cell kinematics across Indian meteorological observation sectors
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {storms.length} Cells Tracking Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storms.map((s) => {
            const isSelected = currentStorm?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStorm(s)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    {s.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      s.estimated_risk === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : s.estimated_risk === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.estimated_risk}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 truncate">{s.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{s.region}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200/60 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">SPEED & HEADING</span>
                    <span className="text-slate-800 font-bold">{s.movement_direction} @ {s.movement_speed_kmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">REFLECTIVITY</span>
                    <span className="text-red-600 font-bold">{s.intensity_dbz} dBZ</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
