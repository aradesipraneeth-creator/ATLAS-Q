import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, TrendingUp, Navigation, AlertCircle } from 'lucide-react';

export default function StormTrajectory({ storm }) {
  if (!storm) return null;

  const trajectory = storm.trajectory || [];
  const [activeStepIndex, setActiveStepIndex] = useState(3); // Default to 'NOW' (index 3)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Reset to 'NOW' if selected storm changes
    const nowIdx = trajectory.findIndex((t) => t.time_label === 'NOW');
    if (nowIdx !== -1) setActiveStepIndex(nowIdx);
  }, [storm.id]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % trajectory.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, trajectory.length]);

  const activePoint = trajectory[activeStepIndex] || trajectory[3] || {};

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">
              STORM TRAJECTORY NOWCAST (0–60 MIN)
            </h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
              {storm.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous spatiotemporal projection from past radar echoes to future extrapolation
          </p>
        </div>

        {/* Prototype simulation label */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Prototype simulation — real-time model integration planned.</span>
        </div>
      </div>

      {/* Trajectory Timeline Nodes */}
      <div className="my-5">
        <div className="relative flex items-center justify-between px-2 sm:px-6">
          {/* Background Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>

          {/* Active Progress Fill */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-sky-500 z-0 transition-all duration-300"
            style={{
              width: `${(activeStepIndex / (trajectory.length - 1)) * 100}%`
            }}
          ></div>

          {trajectory.map((pt, idx) => {
            const isSelected = activeStepIndex === idx;
            const isNow = pt.time_label === 'NOW';
            const isPast = pt.status === 'Past';

            return (
              <button
                key={pt.time_label}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className="relative z-10 flex flex-col items-center group focus:outline-hidden"
              >
                {/* Node Circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-sky-600 text-white ring-4 ring-sky-200 scale-110'
                      : isNow
                      ? 'bg-red-500 text-white ring-2 ring-red-200'
                      : isPast
                      ? 'bg-slate-300 text-slate-700'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {isNow ? '★' : pt.time_label.replace('T', '')}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-semibold ${
                    isSelected
                      ? 'text-sky-700 font-bold'
                      : isNow
                      ? 'text-red-600 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {pt.time_label}
                </span>

                {/* Sub-status */}
                <span className="text-[9px] text-slate-400 font-mono hidden sm:block">
                  {pt.intensity_dbz} dBZ
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveStepIndex((prev) => Math.max(prev - 1, 0))}
            disabled={activeStepIndex === 0}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play Trajectory'}</span>
          </button>
          <button
            onClick={() => setActiveStepIndex((prev) => Math.min(prev + 1, trajectory.length - 1))}
            disabled={activeStepIndex === trajectory.length - 1}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Current timeline snapshot metrics */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Step:</span>
            <span className="font-bold text-slate-800">{activePoint.time_label} ({activePoint.status})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Reflectivity:</span>
            <span className="font-bold text-red-600">{activePoint.intensity_dbz} dBZ</span>
          </div>
        </div>
      </div>

      {/* Trajectory Details Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Storm Cell ID</span>
          <span className="font-mono font-bold text-slate-900 text-sm">{storm.id}</span>
          <span className="text-[11px] text-slate-500 block truncate">{storm.name}</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Current Position</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {activePoint.lat?.toFixed(2)}°N, {activePoint.lon?.toFixed(2)}°E
          </span>
          <span className="text-[11px] text-slate-500 block">{storm.region}</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Movement Direction</span>
          <div className="flex items-center space-x-1 text-slate-900 font-bold text-sm">
            <Navigation className="w-3.5 h-3.5 text-sky-600 rotate-45" />
            <span>{storm.movement_direction}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Propagation: {storm.movement_speed_kmh} km/h</span>
        </div>
        <div className="p-3 rounded-lg border border-slate-200 bg-white">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Intensity Trend</span>
          <div className="flex items-center space-x-1 text-red-600 font-bold text-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{storm.intensity_dbz > 50 ? 'Peak Severe' : 'Moderate Growth'}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Echo Top: {storm.echo_top_km} km AGL</span>
        </div>
      </div>
    </div>
  );
}
