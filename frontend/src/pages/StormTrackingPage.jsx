import React, { useState, useEffect } from 'react';
import { fetchLiveTracking } from '../services/api';
import { Compass, Play, Pause, SkipBack, SkipForward, ArrowRight, ShieldAlert, Navigation, RefreshCw } from 'lucide-react';

export default function StormTrackingPage({ stormsData }) {
  const [scenario, setScenario] = useState('kalbaishakhi');
  const [trackingData, setTrackingData] = useState(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadTracking = async () => {
    try {
      setLoading(true);
      const res = await fetchLiveTracking(scenario);
      setTrackingData(res);
      setSelectedCellIndex(0);
    } catch (e) {
      console.error('Error fetching live tracking:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking();
  }, [scenario]);

  const cells = trackingData?.tracked_cells || [];
  const currentCell = cells[selectedCellIndex] || cells[0];
  const predictions = currentCell?.predicted_trajectory || [];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 03 • Kinematic Extrapolation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            storm tracking & 0–60 min nowcasting.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Consecutive observation centroid matching (Δt = 10 min) computing advection velocities, heading angles, and expanding forward uncertainty cones.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold font-mono">
            METHOD: CENTROID MATCHING
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#F4E3E6] text-[#A51F52] text-xs font-bold">
            PROVENANCE: PREDICTED
          </span>
        </div>
      </div>

      {/* Control Selector */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-[#28191D] uppercase tracking-wider font-mono">
            Active Cell:
          </label>
          <select
            value={selectedCellIndex}
            onChange={(e) => setSelectedCellIndex(parseInt(e.target.value))}
            className="text-xs font-semibold bg-[#FFF3F0] border border-[#EBDCD8] rounded-full px-4 py-2 text-[#28191D] focus:outline-hidden font-mono"
          >
            {cells.map((c, i) => (
              <option key={c.id} value={i}>
                {c.id} — {c.intensity_dbz} dBZ ({c.movement_direction})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={loadTracking}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] text-xs font-bold transition flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Update Kinematics</span>
        </button>
      </div>

      {/* Cell Kinematics Summary Card */}
      {currentCell && (
        <div className="bg-[#D3E4B7] rounded-[2rem] p-6 text-[#28191D] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-[#b8ce96] gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-[#28191D] text-[#FFF3F0] px-2.5 py-0.5 rounded-full">
                  {currentCell.id}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A51F52]">
                  {currentCell.tracking_status}
                </span>
              </div>
              <h3 className="text-xl font-extrabold font-headline mt-1">
                Centroid: {currentCell.lat}°N, {currentCell.lon}°E
              </h3>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="bg-[#FFFFFF] px-3.5 py-1.5 rounded-full shadow-2xs font-mono">
                Speed: <strong>{currentCell.movement_speed_kmh} km/h</strong>
              </div>
              <div className="bg-[#FFFFFF] px-3.5 py-1.5 rounded-full shadow-2xs font-mono">
                Heading: <strong>{currentCell.movement_direction}</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#FFFFFF]/75 rounded-2xl p-3">
              <span className="text-[10px] text-[#735E60] font-semibold block uppercase">10-MIN DISPLACEMENT</span>
              <span className="font-mono font-bold text-[#28191D] text-base">{currentCell.displacement_km} km</span>
            </div>
            <div className="bg-[#FFFFFF]/75 rounded-2xl p-3">
              <span className="text-[10px] text-[#735E60] font-semibold block uppercase">REFLECTIVITY TREND</span>
              <span className="font-mono font-bold text-[#A51F52] text-base">{currentCell.intensity_trend}</span>
            </div>
            <div className="bg-[#FFFFFF]/75 rounded-2xl p-3">
              <span className="text-[10px] text-[#735E60] font-semibold block uppercase">INTENSITY DELTA</span>
              <span className="font-mono font-bold text-[#28191D] text-base">{currentCell.dbz_delta} dBZ</span>
            </div>
            <div className="bg-[#FFFFFF]/75 rounded-2xl p-3">
              <span className="text-[10px] text-[#735E60] font-semibold block uppercase">PEAK INTENSITY</span>
              <span className="font-mono font-bold text-[#A51F52] text-base">{currentCell.intensity_dbz} dBZ</span>
            </div>
          </div>
        </div>
      )}

      {/* Trajectory Extrapolation Table (T+10m to T+60m) */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
          <div>
            <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
              forward nowcast trajectory (0–60 min horizon)
            </h3>
            <p className="text-xs text-[#735E60]">
              Kinematic advection coordinates with expanding horizontal uncertainty radius
            </p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#FFF3F0] text-[#735E60] font-bold">
            UNCERTAINTY: DIVERGING
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F4E3E6]/60 text-[#28191D] font-bold font-headline border-b border-[#EBDCD8]">
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Extrapolated Coordinates</th>
                <th className="py-3 px-4">Projected Echo (dBZ)</th>
                <th className="py-3 px-4">Uncertainty Radius (km)</th>
                <th className="py-3 px-4">Ensemble Confidence</th>
                <th className="py-3 px-4">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E3E6] font-mono">
              {predictions.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#FFF3F0]/60 transition">
                  <td className="py-3.5 px-4 font-bold text-[#A51F52]">{p.time_label} (+{p.lead_time_minutes}m)</td>
                  <td className="py-3.5 px-4 text-[#28191D]">{p.lat}°N, {p.lon}°E</td>
                  <td className="py-3.5 px-4 font-bold text-[#28191D]">{p.projected_intensity_dbz} dBZ</td>
                  <td className="py-3.5 px-4 text-[#735E60]">± {p.uncertainty_radius_km} km</td>
                  <td className="py-3.5 px-4 font-bold text-[#22c55e]">{p.confidence_pct}%</td>
                  <td className="py-3.5 px-4 text-[10px] font-bold text-[#A51F52] uppercase">{p.provenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
