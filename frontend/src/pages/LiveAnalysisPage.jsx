import React, { useState } from 'react';
import WeatherMap from '../components/WeatherMap';
import MultimodalPipeline from '../components/MultimodalPipeline';
import { Radio, Zap, AlertTriangle, Filter, ArrowUpRight } from 'lucide-react';

export default function LiveAnalysisPage({
  stormsData,
  archData,
  selectedStorm,
  setSelectedStorm,
  onOpenStormModal
}) {
  const [filterRisk, setFilterRisk] = useState('ALL');
  const storms = stormsData?.storms || [];
  const radarStations = stormsData?.radar_stations || [];
  const lightningEvents = stormsData?.lightning_events || [];

  const filteredStorms = storms.filter((s) => {
    if (filterRisk === 'ALL') return true;
    return s.estimated_risk === filterRisk;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-sky-600 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900">
              LIVE MULTI-RADAR & LIGHTNING NOWCAST ANALYSIS
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Doppler S-Band & C-Band composite scan with IITM lightning detection integration
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            DEMO / SIMULATION DATA
          </span>
        </div>
      </div>

      {/* Main Interactive Map */}
      <WeatherMap
        storms={filteredStorms}
        radarStations={radarStations}
        lightningEvents={lightningEvents}
        selectedStorm={selectedStorm}
        onSelectStorm={(storm) => {
          setSelectedStorm(storm);
          if (onOpenStormModal) onOpenStormModal(storm);
        }}
      />

      {/* Filter and Table of Active Cells */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Convective Cell Registry</h3>
            <p className="text-xs text-slate-500">Click any cell row to inspect detailed radar reflectivity profile</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Risk:
            </span>
            {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition ${
                  filterRisk === risk
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Storms Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Cell ID</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Radar Station</th>
                <th className="py-2.5 px-3">Reflectivity</th>
                <th className="py-2.5 px-3">Flash Rate</th>
                <th className="py-2.5 px-3">Movement</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredStorms.map((s) => {
                const isSelected = selectedStorm?.id === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => {
                      setSelectedStorm(s);
                      if (onOpenStormModal) onOpenStormModal(s);
                    }}
                    className={`cursor-pointer transition hover:bg-sky-50/50 ${
                      isSelected ? 'bg-sky-50 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">{s.id}</td>
                    <td className="py-3 px-3 text-slate-700 font-sans">{s.region}</td>
                    <td className="py-3 px-3 text-slate-600 font-sans">{s.nearest_radar}</td>
                    <td className="py-3 px-3">
                      <span className="text-red-600 font-bold">{s.intensity_dbz} dBZ</span>
                    </td>
                    <td className="py-3 px-3 text-amber-600 font-bold">{s.lightning_rate_per_min}/min</td>
                    <td className="py-3 px-3 text-slate-600 font-sans">{s.movement_direction}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          s.estimated_risk === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : s.estimated_risk === 'MODERATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {s.estimated_risk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <span className="text-sky-600 hover:text-sky-800 text-xs font-semibold inline-flex items-center gap-0.5">
                        Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multimodal Ingestion Pipeline Details */}
      <MultimodalPipeline sources={archData?.multimodal_pipeline} />
    </div>
  );
}
