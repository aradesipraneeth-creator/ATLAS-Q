import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Zap, 
  Compass, 
  Layers, 
  Radio, 
  AlertTriangle, 
  Navigation, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  TrendingUp,
  Activity,
  Maximize2
} from 'lucide-react';
import { 
  fetchRadarGrid, 
  fetchLiveTracking, 
  fetchLightningAnalysis, 
  fetchActiveCyclones,
  fetchCycloneDetail 
} from '../services/api';

export default function ForecastIntelligencePage() {
  const [activeSubTab, setActiveSubTab] = useState('cyclone'); // 'cyclone' or 'thunderstorm'
  const [loading, setLoading] = useState(true);
  
  // Thunderstorm states
  const [trackingData, setTrackingData] = useState(null);
  const [lightningData, setLightningData] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState('CELL-01');

  // Cyclone states
  const [cyclones, setCyclones] = useState([]);
  const [selectedCyclone, setSelectedCyclone] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [trackRes, lightRes, radarRes, cycRes] = await Promise.all([
          fetchLiveTracking('kalbaishakhi'),
          fetchLightningAnalysis(),
          fetchRadarGrid('kalbaishakhi', 24),
          fetchActiveCyclones()
        ]);
        setTrackingData(trackRes);
        setLightningData(lightRes);
        setRadarData(radarRes);
        if (cycRes?.cyclones?.length > 0) {
          setCyclones(cycRes.cyclones);
          setSelectedCyclone(cycRes.cyclones[0]);
        }
      } catch (err) {
        console.error('Error loading forecast data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedCell = trackingData?.tracking_chains?.find(c => c.cell_id === selectedCellId) || trackingData?.tracking_chains?.[0];

  return (
    <div className="space-y-10">
      {/* 02 Header & Editorial Navigation */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 bg-[#D3E4B7] text-[#28191D] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#A51F52]"></span>
            <span>02 — Forecast Intelligence</span>
            <span>•</span>
            <span>Kinematic Nowcasting & Multi-Hour Trajectory Analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#735E60]">
            <Clock className="w-3.5 h-3.5" />
            <span>NWP Update: Cycle 12:00 UTC (Next: 18:00 UTC)</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EBDCD8]">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
              forecast intelligence.
            </h1>
            <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
              High-resolution observational nowcasting powered by 8-connectivity radar cell clustering, 
              total lightning jump analysis, and IMD-standard tropical cyclone track and intensity forecasting.
            </p>
          </div>

          {/* Sub-tab Switcher (Pill style) */}
          <div className="inline-flex p-1.5 bg-white border border-[#EBDCD8] rounded-full shadow-xs">
            <button
              onClick={() => setActiveSubTab('cyclone')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeSubTab === 'cyclone'
                  ? 'bg-[#A51F52] text-white shadow-xs'
                  : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Cyclone Intelligence</span>
            </button>
            <button
              onClick={() => setActiveSubTab('thunderstorm')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeSubTab === 'thunderstorm'
                  ? 'bg-[#A51F52] text-white shadow-xs'
                  : 'text-[#735E60] hover:text-[#28191D]'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Thunderstorm Nowcast</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VIEW A: CYCLONE INTELLIGENCE */}
      {/* ========================================================================= */}
      {activeSubTab === 'cyclone' && selectedCyclone && (
        <div className="space-y-8">
          {/* Cyclone Metadata Banner */}
          <div className="bg-[#FFF3F0] border border-[#EBDCD8] rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBDCD8]">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
                    cyclone {selectedCyclone.name}.
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#A51F52] text-white uppercase tracking-wider">
                    {selectedCyclone.current_position?.classification?.category}
                  </span>
                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#D3E4B7] text-[#28191D]">
                    {selectedCyclone.basin}
                  </span>
                </div>
                <p className="text-xs text-[#735E60] font-sans">
                  Advisory Source: <span className="font-semibold text-[#28191D]">{selectedCyclone.advisory_source}</span> (Bulletin {selectedCyclone.bulletin_no})
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono bg-white border border-[#EBDCD8] px-4 py-2 rounded-2xl">
                <span className="text-[#735E60]">PROVENANCE:</span>
                <span className="font-bold text-[#A51F52]">{selectedCyclone.data_provenance}</span>
              </div>
            </div>

            {/* Current Intensity & Physical Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-[#EBDCD8]">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">EYE POSITION</span>
                <span className="text-base font-mono font-bold text-[#28191D]">
                  {selectedCyclone.current_position?.lat}°N, {selectedCyclone.current_position?.lon}°E
                </span>
                <span className="text-[10px] text-[#735E60] block">North Bay of Bengal</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EBDCD8]">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">MAX SUSTAINED WIND</span>
                <span className="text-base font-mono font-bold text-[#A51F52]">
                  {selectedCyclone.current_position?.max_wind_kmh} km/h
                </span>
                <span className="text-[10px] text-[#735E60] block font-mono">{selectedCyclone.current_position?.max_wind_knots} Knots (Gale)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EBDCD8]">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">CENTRAL PRESSURE</span>
                <span className="text-base font-mono font-bold text-[#28191D]">
                  {selectedCyclone.current_position?.central_pressure_hpa} hPa
                </span>
                <span className="text-[10px] text-[#735E60] block">Pressure Deficit: ~22 hPa</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EBDCD8]">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">PROPAGATION VECTOR</span>
                <span className="text-base font-mono font-bold text-[#28191D]">
                  {selectedCyclone.current_position?.movement_direction} @ {selectedCyclone.current_position?.movement_speed_kmh}
                </span>
                <span className="text-[10px] text-[#735E60] block">Steering Flow 500hPa</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EBDCD8]">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">GALE RADIUS (R34)</span>
                <span className="text-base font-mono font-bold text-[#28191D]">
                  {selectedCyclone.wind_radii_km?.r34_knots_gale} km
                </span>
                <span className="text-[10px] text-[#735E60] block">NE Quadrant Extent</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EBDCD8]">
                <span className="text-[10px] uppercase font-bold text-[#735E60] block">STORM SURGE</span>
                <span className="text-base font-mono font-bold text-[#A51F52]">
                  {selectedCyclone.landfall_estimate?.surge_height_m} meters
                </span>
                <span className="text-[10px] text-[#735E60] block">Astronomical Inundation</span>
              </div>
            </div>
          </div>

          {/* Forecast Track Waypoint Table & Uncertainty Cone */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Track Waypoints Table */}
            <div className="lg:col-span-2 bg-white border border-[#EBDCD8] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
                <div>
                  <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                    official forecast track & intensity progression.
                  </h3>
                  <p className="text-xs text-[#735E60]">
                    Calibrated multi-model consensus (ECMWF, GFS, NCMRWF) validated by IMD DWR Doppler coverage.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#D3E4B7] text-[#28191D] px-2.5 py-1 rounded-full">
                  CONE OF UNCERTAINTY (95%)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EBDCD8] text-[10px] uppercase font-bold text-[#735E60]">
                      <th className="py-2.5 px-3">LEAD TIME</th>
                      <th className="py-2.5 px-3">EST. POSITION</th>
                      <th className="py-2.5 px-3">WIND (KM/H)</th>
                      <th className="py-2.5 px-3">PRESSURE</th>
                      <th className="py-2.5 px-3">STAGE</th>
                      <th className="py-2.5 px-3 text-right">RADIUS OF UNCERTAINTY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4E3E6] font-mono">
                    {/* Historical */}
                    <tr className="bg-[#FFF3F0]/60 text-[#735E60]">
                      <td className="py-2.5 px-3 font-semibold">-6h (OBS)</td>
                      <td className="py-2.5 px-3">19.00°N, 88.30°E</td>
                      <td className="py-2.5 px-3">115 km/h</td>
                      <td className="py-2.5 px-3">980 hPa</td>
                      <td className="py-2.5 px-3">SCS</td>
                      <td className="py-2.5 px-3 text-right font-sans text-[11px]">Observed Fix</td>
                    </tr>
                    <tr className="bg-[#F4E3E6]/60 font-bold text-[#28191D]">
                      <td className="py-2.5 px-3 text-[#A51F52]">NOW (CURRENT)</td>
                      <td className="py-2.5 px-3">19.80°N, 88.60°E</td>
                      <td className="py-2.5 px-3 text-[#A51F52]">120 km/h</td>
                      <td className="py-2.5 px-3">978 hPa</td>
                      <td className="py-2.5 px-3">VSCS</td>
                      <td className="py-2.5 px-3 text-right font-sans text-[11px] text-[#A51F52]">± 12 km radar fix</td>
                    </tr>
                    {/* Forecast */}
                    {selectedCyclone.forecast_track?.map((pt, idx) => (
                      <tr key={idx} className="hover:bg-[#FFF3F0]/50 transition">
                        <td className="py-2.5 px-3 font-semibold text-[#28191D]">+{pt.forecast_lead_h}h Forecast</td>
                        <td className="py-2.5 px-3">{pt.lat.toFixed(2)}°N, {pt.lon.toFixed(2)}°E</td>
                        <td className="py-2.5 px-3 font-bold text-[#A51F52]">{pt.wind_kmh} km/h</td>
                        <td className="py-2.5 px-3">{pt.pressure_hpa} hPa</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-[11px]">{pt.stage}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#735E60]">± {pt.uncertainty_radius_km} km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Landfall & Coastal Exposure Summary */}
            <div className="bg-[#FFF3F0] border border-[#EBDCD8] rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#A51F52]">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">PROJECTED LANDFALL</span>
                </div>
                <h4 className="text-xl font-bold text-[#28191D] font-headline lowercase">
                  sundarbans coastal sector.
                </h4>
                <p className="text-xs text-[#735E60] font-sans leading-relaxed">
                  Expected landfall window around <strong className="text-[#28191D]">{selectedCyclone.landfall_estimate?.expected_time_utc}</strong> near{' '}
                  <span className="text-[#A51F52] font-semibold">{selectedCyclone.landfall_estimate?.region}</span> with sustained winds of{' '}
                  <strong className="text-[#28191D]">{selectedCyclone.landfall_estimate?.landfall_wind_kmh} km/h</strong> and storm surges up to{' '}
                  <strong className="text-[#A51F52]">{selectedCyclone.landfall_estimate?.surge_height_m} meters</strong>.
                </p>

                <div className="p-3.5 bg-white border border-[#EBDCD8] rounded-2xl space-y-2 text-xs">
                  <span className="font-bold text-[#28191D] block">Key Affected Districts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['South 24 Parganas', 'North 24 Parganas', 'Purba Medinipur', 'Bhadrak (OD)', 'Kendrapara (OD)'].map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F4E3E6] text-[#28191D]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#EBDCD8] text-[11px] text-[#735E60] font-sans space-y-1">
                <span className="font-bold text-[#28191D] block">Scientific Integrity Notice:</span>
                <p>Cyclone track forecasts reflect hydrodynamic atmospheric equations and official meteorological bulletins. They are not generated by heuristic optimization algorithms.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: THUNDERSTORM NOWCASTING & KINEMATICS */}
      {/* ========================================================================= */}
      {activeSubTab === 'thunderstorm' && (
        <div className="space-y-8">
          {/* Tracking Chains Selector */}
          <div className="bg-white border border-[#EBDCD8] rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4E3E6]">
              <div>
                <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
                  active convective storm cells.
                </h3>
                <p className="text-xs text-[#735E60]">
                  Connected component spatial clustering (Z ≥ 35 dBZ) and 10-minute centroid displacement tracking.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {trackingData?.tracking_chains?.map((chain) => (
                  <button
                    key={chain.cell_id}
                    onClick={() => setSelectedCellId(chain.cell_id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition ${
                      selectedCellId === chain.cell_id
                        ? 'bg-[#A51F52] text-white shadow-xs'
                        : 'bg-[#FFF3F0] text-[#735E60] hover:bg-[#F4E3E6]'
                    }`}
                  >
                    {chain.cell_id} ({chain.speed_kmh} km/h {chain.compass_direction})
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Storm Kinematic Details */}
            {selectedCell && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8]">
                  <span className="text-[10px] uppercase font-bold text-[#735E60] block">CURRENT CENTROID</span>
                  <span className="text-base font-mono font-bold text-[#28191D]">
                    {selectedCell.current_position?.lat?.toFixed(2)}°N, {selectedCell.current_position?.lon?.toFixed(2)}°E
                  </span>
                  <span className="text-[10px] text-[#735E60] block">Area: {selectedCell.current_position?.area_km2} km²</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8]">
                  <span className="text-[10px] uppercase font-bold text-[#735E60] block">PEAK REFLECTIVITY</span>
                  <span className="text-base font-mono font-bold text-[#A51F52]">
                    {selectedCell.current_position?.peak_dbz} dBZ
                  </span>
                  <span className="text-[10px] text-[#735E60] block">VIL: {selectedCell.current_position?.vil_kg_m2} kg/m²</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8]">
                  <span className="text-[10px] uppercase font-bold text-[#735E60] block">PROPAGATION SPEED</span>
                  <span className="text-base font-mono font-bold text-[#28191D]">
                    {selectedCell.speed_kmh} km/h
                  </span>
                  <span className="text-[10px] text-[#735E60] block">Azimuth: {selectedCell.heading_deg}° ({selectedCell.compass_direction})</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8]">
                  <span className="text-[10px] uppercase font-bold text-[#735E60] block">STATUS</span>
                  <span className="text-base font-bold text-[#28191D] uppercase">
                    {selectedCell.status}
                  </span>
                  <span className="text-[10px] text-[#A51F52] font-semibold block">Confidence: 94%</span>
                </div>
              </div>
            )}
          </div>

          {/* Trajectory Table & Lightning Jump Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trajectory Extrapolation (T-30 to T+60) */}
            <div className="lg:col-span-2 bg-white border border-[#EBDCD8] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
                <h4 className="text-base font-bold text-[#28191D] font-headline lowercase">
                  0–60 minute kinematic trajectory forecast.
                </h4>
                <span className="text-xs font-mono text-[#735E60]">METHOD: Centroid Kinematics</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#EBDCD8] text-[10px] uppercase font-bold text-[#735E60]">
                      <th className="py-2.5 px-3">TIMESTEP</th>
                      <th className="py-2.5 px-3">LATITUDE</th>
                      <th className="py-2.5 px-3">LONGITUDE</th>
                      <th className="py-2.5 px-3">EST. dBZ</th>
                      <th className="py-2.5 px-3 text-right">UNCERTAINTY CONE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4E3E6]">
                    {selectedCell?.historical_path?.map((h, i) => (
                      <tr key={`h-${i}`} className="text-[#735E60] bg-[#FFF3F0]/40">
                        <td className="py-2.5 px-3">{h.timestamp_label} (OBS)</td>
                        <td className="py-2.5 px-3">{h.lat.toFixed(2)}°N</td>
                        <td className="py-2.5 px-3">{h.lon.toFixed(2)}°E</td>
                        <td className="py-2.5 px-3">{h.dbz} dBZ</td>
                        <td className="py-2.5 px-3 text-right text-[11px] font-sans">Observed fix</td>
                      </tr>
                    ))}
                    <tr className="bg-[#F4E3E6]/60 font-bold text-[#28191D]">
                      <td className="py-2.5 px-3 text-[#A51F52]">T-0 NOW</td>
                      <td className="py-2.5 px-3">{selectedCell?.current_position?.lat?.toFixed(2)}°N</td>
                      <td className="py-2.5 px-3">{selectedCell?.current_position?.lon?.toFixed(2)}°E</td>
                      <td className="py-2.5 px-3 text-[#A51F52]">{selectedCell?.current_position?.peak_dbz} dBZ</td>
                      <td className="py-2.5 px-3 text-right text-[#A51F52] font-sans">± 2.5 km (Radar)</td>
                    </tr>
                    {selectedCell?.projected_path?.map((p, i) => (
                      <tr key={`p-${i}`} className="hover:bg-[#FFF3F0]/40 transition">
                        <td className="py-2.5 px-3 font-semibold text-[#28191D]">+{p.lead_time_minutes}m</td>
                        <td className="py-2.5 px-3">{p.lat.toFixed(2)}°N</td>
                        <td className="py-2.5 px-3">{p.lon.toFixed(2)}°E</td>
                        <td className="py-2.5 px-3 font-bold text-[#A51F52]">{p.expected_dbz} dBZ</td>
                        <td className="py-2.5 px-3 text-right text-[#735E60]">± {p.uncertainty_radius_km} km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lightning Intelligence & Jump Detection */}
            <div className="bg-[#FFF3F0] border border-[#EBDCD8] rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD8]">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#d97706]" />
                  <h4 className="text-base font-bold text-[#28191D] font-headline lowercase">
                    total lightning & jump alerts.
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#D3E4B7] text-[#28191D] px-2 py-0.5 rounded-full">
                  2σ JUMP THRESHOLD
                </span>
              </div>

              {lightningData && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="p-4 bg-white rounded-2xl border border-[#EBDCD8] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#735E60] block">FLASH PARTITIONING</span>
                    <div className="flex items-center justify-between font-mono">
                      <span>Total Flashes:</span>
                      <strong className="text-sm font-bold text-[#28191D]">{lightningData.total_flashes_last_hour}</strong>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span>Cloud-to-Ground (CG):</span>
                      <strong className="text-[#A51F52]">{lightningData.cg_flashes}</strong>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span>Intra-Cloud (IC):</span>
                      <strong className="text-[#2563eb]">{lightningData.ic_flashes}</strong>
                    </div>
                    <div className="pt-2 border-t border-[#F4E3E6] flex items-center justify-between font-mono text-[11px]">
                      <span>IC / CG Ratio:</span>
                      <strong className="text-[#28191D]">{lightningData.ic_cg_ratio}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F4E3E6]/60 rounded-2xl border border-[#ebd0d6] space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[#A51F52] font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>Lightning Jump Indicator</span>
                    </div>
                    <p className="text-[#28191D] leading-tight">
                      Flash rate accelerated by <strong className="text-[#A51F52]">{lightningData.lightning_jump?.acceleration_pct}%</strong> in cell {lightningData.lightning_jump?.detected_cell}, signaling rapid updraft intensification 15–20m before ground hail/microburst.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
