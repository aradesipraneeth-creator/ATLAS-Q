import React, { useState, useEffect, useRef } from 'react';
import { runStormDetection, fetchRadarGrid } from '../services/api';
import { Radio, Sliders, RefreshCw, Layers, ShieldAlert, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function LiveRadarPage({ onSelectStorm, onOpenModal }) {
  const [scenario, setScenario] = useState('kalbaishakhi');
  const [thresholdDbz, setThresholdDbz] = useState(35.0);
  const [gridData, setGridData] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // Load detection & radar grid
  const loadDetection = async () => {
    try {
      setLoading(true);
      const res = await runStormDetection(scenario, thresholdDbz);
      setGridData(res.grid);
      setDetectionResult(res.detection);
    } catch (e) {
      console.error('Error loading storm detection:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetection();
  }, [scenario, thresholdDbz]);

  // Render HTML5 canvas radar heatmap
  useEffect(() => {
    if (!gridData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const H = gridData.length;
    const W = gridData[0]?.length || 0;
    if (H === 0 || W === 0) return;

    const cellW = canvas.width / W;
    const cellH = canvas.height / H;

    // Helper to map dBZ to meteorological color palette
    const getDbzColor = (val) => {
      if (val < 10) return '#FFF3F0';
      if (val < 20) return '#d4d4d8';
      if (val < 30) return '#93c5fd';
      if (val < 35) return '#3b82f6';
      if (val < 40) return '#22c55e';
      if (val < 45) return '#eab308';
      if (val < 50) return '#f97316';
      if (val < 55) return '#A51F52';
      return '#701a75'; // Extreme core / hail
    };

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const val = gridData[y][x];
        ctx.fillStyle = getDbzColor(val);
        ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
      }
    }

    // Draw range rings
    ctx.strokeStyle = '#28191D';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.45, 0, 2 * Math.PI);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.30, 0, 2 * Math.PI);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.15, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [gridData]);

  const cells = detectionResult?.cells || [];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 02 • Spatial Cluster Extraction
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            live radar & storm detection engine.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Reproducible connected-component spatial clustering (8-connectivity) extracting reflectivity-weighted centroids, convective area, and echo top heights.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold font-mono">
            ALGORITHM: ACTIVE
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#F4E3E6] text-[#A51F52] text-xs font-bold">
            PROVENANCE: DERIVED
          </span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Scenario Selection */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-[#28191D] uppercase tracking-wider font-mono">
            Radar Sector:
          </label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="text-xs font-semibold bg-[#FFF3F0] border border-[#EBDCD8] rounded-full px-4 py-2 text-[#28191D] focus:outline-hidden"
          >
            <option value="kalbaishakhi">Kolkata Sector (VECC S-Band DWR)</option>
            <option value="delhi_ncr">Delhi-NCR Sector (VIDD C-Band DWR)</option>
            <option value="western_ghats">Western Ghats (VABB S-Band DWR)</option>
          </select>
        </div>

        {/* Threshold Slider */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-bold text-[#28191D] uppercase font-mono">
            Threshold: <strong className="text-[#A51F52]">{thresholdDbz} dBZ</strong>
          </span>
          <input
            type="range"
            min="25"
            max="50"
            step="1"
            value={thresholdDbz}
            onChange={(e) => setThresholdDbz(parseFloat(e.target.value))}
            className="accent-[#A51F52] cursor-pointer"
          />
        </div>

        {/* Refresh Action */}
        <button
          onClick={loadDetection}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] text-xs font-bold transition flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Rerun Detection</span>
        </button>
      </div>

      {/* Main Grid: Radar Heatmap Canvas (Left) + Extracted Cells Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar Reflectivity Heatmap Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F4E3E6]">
            <div>
              <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase">
                volumetric reflectivity grid
              </h3>
              <p className="text-[11px] text-[#735E60]">
                32x32 Cartesian Grid • 5km/pixel resolution • Range 160km
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF3F0] text-[#735E60]">
              Z-SCALE: 0–65 dBZ
            </span>
          </div>

          <div className="flex justify-center p-3 bg-[#FFF3F0] rounded-2xl">
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="rounded-xl shadow-xs border border-[#EBDCD8] max-w-full"
            />
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#735E60] px-2 pt-2 border-t border-[#F4E3E6]">
            <span>&lt; 20 (Noise)</span>
            <span className="text-[#3b82f6]">30 (Rain)</span>
            <span className="text-[#22c55e]">35 (Convective)</span>
            <span className="text-[#eab308]">45 (Heavy)</span>
            <span className="text-[#A51F52] font-bold">55+ (Hail Core)</span>
          </div>
        </div>

        {/* Extracted Storm Cells Registry (6 cols) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F4E3E6]">
            <div>
              <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase">
                clustered storm cells ({cells.length})
              </h3>
              <p className="text-[11px] text-[#735E60]">
                Computed via 8-connectivity with intensity-weighted centroids
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {cells.map((cell) => (
              <div
                key={cell.id}
                className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] hover:border-[#D3E4B7] transition text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#28191D] text-[#FFF3F0] text-xs">
                      {cell.id}
                    </span>
                    <span className="font-bold text-[#28191D] font-headline">
                      {cell.intensity_dbz} dBZ Peak
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cell.estimated_risk === 'CRITICAL'
                        ? 'bg-[#A51F52] text-white'
                        : cell.estimated_risk === 'HIGH'
                        ? 'bg-[#dc2626] text-white'
                        : 'bg-[#D3E4B7] text-[#28191D]'
                    }`}
                  >
                    {cell.estimated_risk}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                  <div>
                    <span className="text-[#735E60] block text-[10px]">CENTROID</span>
                    <span className="text-[#28191D] font-semibold">{cell.lat}°N, {cell.lon}°E</span>
                  </div>
                  <div>
                    <span className="text-[#735E60] block text-[10px]">AREA</span>
                    <span className="text-[#28191D] font-semibold">{cell.area_km2} km²</span>
                  </div>
                  <div>
                    <span className="text-[#735E60] block text-[10px]">MEAN ECHO</span>
                    <span className="text-[#28191D] font-semibold">{cell.mean_intensity_dbz} dBZ</span>
                  </div>
                  <div>
                    <span className="text-[#735E60] block text-[10px]">ECHO TOP</span>
                    <span className="text-[#28191D] font-semibold">{cell.echo_top_km} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
