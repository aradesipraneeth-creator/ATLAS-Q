import React, { useState, useEffect } from 'react';
import { fetchWeatherStations } from '../services/api';
import { Database, Radio, Satellite, Zap, Wind, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';

export default function DataSourcesPage() {
  const [stationsData, setStationsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStations = async () => {
    try {
      setLoading(true);
      const res = await fetchWeatherStations();
      setStationsData(res.stations || []);
    } catch (e) {
      console.error('Error fetching stations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const sourcesList = [
    {
      provider: "India Meteorological Department (IMD)",
      dataset: "Doppler Weather Radar (DWR) Volumetric Reflectivity (Z)",
      status: "NOMINAL",
      lastRetrieval: "15:30 UTC",
      frequency: "10 Minutes",
      coverage: "Pan-India S-Band & C-Band Network (250km radial bins)",
      quality: "99.4% Valid Bins",
      provenance: "REAL",
      provenanceBg: "bg-[#D3E4B7] text-[#28191D]"
    },
    {
      provider: "ISRO / MOSDAC",
      dataset: "INSAT-3D & INSAT-3DR TIR-1 (10.8µm) & Water Vapor (6.7µm)",
      status: "RAPID SCAN",
      lastRetrieval: "15:28 UTC",
      frequency: "15 Minutes",
      coverage: "South Asian Geostationary Disk (4km resolution)",
      quality: "Full Disk Calibrated",
      provenance: "REAL",
      provenanceBg: "bg-[#D3E4B7] text-[#28191D]"
    },
    {
      provider: "IITM Pune / Damini",
      dataset: "Lightning Location Network (LLN) CG / IC Pulses",
      status: "STREAMING",
      lastRetrieval: "15:30:18 UTC",
      frequency: "Continuous (1.1s latency)",
      coverage: "Indian Subcontinent (500m spatial accuracy)",
      quality: "Waveform Verified",
      provenance: "REAL",
      provenanceBg: "bg-[#D3E4B7] text-[#28191D]"
    },
    {
      provider: "Open-Meteo High-Resolution NWP Gateway",
      dataset: "Surface In-situ Observations & Convective CAPE Indices",
      status: "SYNCHRONIZED",
      lastRetrieval: "15:30 UTC",
      frequency: "Hourly / Realtime",
      coverage: "Indian Surface Synoptic Stations",
      quality: "WMO Level-2 QC",
      provenance: "REAL",
      provenanceBg: "bg-[#D3E4B7] text-[#28191D]"
    },
    {
      provider: "ATLAS-Q Detection & Tracking Kernel",
      dataset: "Connected-Component Centroids & Kinematic Advection",
      status: "OPERATIONAL",
      lastRetrieval: "15:30 UTC",
      frequency: "On Demand (Per Volume Scan)",
      coverage: "Active Monitored Convective Sectors",
      quality: "Kalman Filtered",
      provenance: "DERIVED",
      provenanceBg: "bg-[#F4E3E6] text-[#A51F52]"
    },
    {
      provider: "ATLAS-Q Probabilistic Extrapolation Engine",
      dataset: "0–60 Min Trajectory Cones & Lightning Hazard Polygons",
      status: "COMPUTED",
      lastRetrieval: "15:30 UTC",
      frequency: "10 Minutes",
      coverage: "Nowcast Alert Buffer Zones",
      quality: "Ensemble Calibrated",
      provenance: "PREDICTED",
      provenanceBg: "bg-[#F4E3E6] text-[#A51F52]"
    },
    {
      provider: "ATLAS-Q Benchmarking Suite",
      dataset: "Deterministic Kalbaishakhi & Microburst Simulation Grids",
      status: "AVAILABLE",
      lastRetrieval: "Loaded",
      frequency: "Deterministic Replay",
      coverage: "Bengal, Delhi-NCR, Western Ghats",
      quality: "Reproducible Ground Truth",
      provenance: "SIMULATED",
      provenanceBg: "bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8]"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 07 • Ingestion & Provenance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            data sources & atmospheric telemetry.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Strict provenance categorization distinguishing directly observed observations (REAL), algorithmic extractions (DERIVED), predictive nowcasts (PREDICTED), and demonstration benchmarks (SIMULATED).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold font-mono">
            7 INTEGRATED PIPELINES
          </span>
        </div>
      </div>

      {/* Provenance Tags Definition Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-[#FFFFFF] border border-[#EBDCD8] rounded-2xl">
          <span className="font-mono text-xs font-bold bg-[#D3E4B7] text-[#28191D] px-2 py-0.5 rounded-full block w-fit mb-1">
            REAL
          </span>
          <p className="text-[11px] text-[#735E60] mt-1">Directly observed raw instrument telemetry from radar, satellite or AWS.</p>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#EBDCD8] rounded-2xl">
          <span className="font-mono text-xs font-bold bg-[#F4E3E6] text-[#A51F52] px-2 py-0.5 rounded-full block w-fit mb-1">
            DERIVED
          </span>
          <p className="text-[11px] text-[#735E60] mt-1">Calculated features including centroids, area, echo tops, and flash density.</p>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#EBDCD8] rounded-2xl">
          <span className="font-mono text-xs font-bold bg-[#F4E3E6] text-[#A51F52] px-2 py-0.5 rounded-full block w-fit mb-1">
            PREDICTED
          </span>
          <p className="text-[11px] text-[#735E60] mt-1">Forecast outputs generated by kinematic extrapolation and risk engines.</p>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#EBDCD8] rounded-2xl">
          <span className="font-mono text-xs font-bold bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8] px-2 py-0.5 rounded-full block w-fit mb-1">
            SIMULATED
          </span>
          <p className="text-[11px] text-[#735E60] mt-1">Controlled synthetic scenarios generated for repeatable technical evaluation.</p>
        </div>
      </div>

      {/* Main Data Sources Table */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
          <div>
            <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
              operational data source registry
            </h3>
            <p className="text-xs text-[#735E60]">
              Telemetry feed specifications, update latencies, and spatial resolution
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F4E3E6]/60 text-[#28191D] font-bold font-headline border-b border-[#EBDCD8]">
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Dataset Stream</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Update Rate</th>
                <th className="py-3 px-4">Geographic Coverage</th>
                <th className="py-3 px-4">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E3E6]">
              {sourcesList.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#FFF3F0]/60 transition">
                  <td className="py-3.5 px-4 font-bold text-[#28191D]">{s.provider}</td>
                  <td className="py-3.5 px-4 text-[#735E60]">{s.dataset}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#22c55e]">{s.status}</td>
                  <td className="py-3.5 px-4 font-mono text-[#735E60]">{s.frequency}</td>
                  <td className="py-3.5 px-4 text-[#735E60]">{s.coverage}</td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${s.provenanceBg}`}>
                      {s.provenance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Synoptic Stations Ingestion Grid */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
          <div>
            <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
              live station telemetry (open-meteo gateway)
            </h3>
            <p className="text-xs text-[#735E60]">
              Surface meteorological observations and thermodynamic instability indices
            </p>
          </div>
          <button
            onClick={loadStations}
            disabled={loading}
            className="p-2 rounded-full bg-[#FFF3F0] hover:bg-[#F4E3E6] text-[#28191D] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stationsData.map((st, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8] text-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold bg-[#28191D] text-[#FFF3F0] px-2 py-0.5 rounded-full">
                    {st.station_code}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#22c55e]">
                    {st.provenance}
                  </span>
                </div>
                <h4 className="font-bold text-[#28191D] text-sm font-headline">{st.station}</h4>
                <p className="text-[11px] text-[#735E60] font-mono">{st.lat}°N, {st.lon}°E</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-[#EBDCD8]">
                <div>
                  <span className="text-[#735E60] block text-[10px]">TEMP</span>
                  <span className="font-bold text-[#28191D]">{st.surface_metrics?.temperature_c}°C</span>
                </div>
                <div>
                  <span className="text-[#735E60] block text-[10px]">PRECIP</span>
                  <span className="font-bold text-[#A51F52]">{st.surface_metrics?.precipitation_mm} mm</span>
                </div>
                <div>
                  <span className="text-[#735E60] block text-[10px]">WIND</span>
                  <span className="font-bold text-[#28191D]">{st.surface_metrics?.wind_speed_kmh} km/h</span>
                </div>
                <div>
                  <span className="text-[#735E60] block text-[10px]">CAPE</span>
                  <span className="font-bold text-[#28191D]">{st.instability_indices?.cape_j_kg} J/kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
