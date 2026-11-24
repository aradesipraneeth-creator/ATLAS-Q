import React, { useState, useEffect } from 'react';
import { fetchLightningAnalysis } from '../services/api';
import { Zap, ShieldAlert, Activity, RefreshCw, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function LightningPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadLightning = async () => {
    try {
      setLoading(true);
      const res = await fetchLightningAnalysis();
      setData(res.lightning);
    } catch (e) {
      console.error('Error fetching lightning:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLightning();
  }, []);

  const metrics = [
    { label: 'Flash Rate', value: `${data?.estimated_flash_rate_per_min || 68}`, unit: '/min', desc: 'Convective core strike rate', bg: 'bg-[#FFFFFF]' },
    { label: 'Spatial Density', value: `${data?.flash_density_per_1000km2 || 0.25}`, unit: 'flashes/1000km²', desc: 'Area-normalized strike density', bg: 'bg-[#D3E4B7]' },
    { label: 'IC : CG Ratio', value: `${data?.ic_to_cg_ratio || 0.6}`, unit: 'ratio', desc: 'Updraft intensification proxy', bg: 'bg-[#FFFFFF]' },
    { label: 'Mean Peak Current', value: `${data?.mean_peak_current_ka || 42.5}`, unit: 'kA', desc: 'Return-stroke electrical energy', bg: 'bg-[#F4E3E6]' },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 04 • Atmospheric Electrification
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            lightning intelligence & density.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Real-time flash clustering, Cloud-to-Ground (CG) vs Intra-Cloud (IC) partitioning, and severe updraft electrification modeling.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#A51F52] text-white text-xs font-bold">
            THREAT: {data?.risk_classification || 'HIGH'}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold font-mono">
            IITM DAMINI NETWORK
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`p-5 rounded-3xl border border-[#EBDCD8] ${m.bg} shadow-2xs flex flex-col justify-between`}>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#735E60] block mb-1">
                {m.label}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline">
                {m.value} <span className="text-xs font-normal text-[#735E60] font-sans">{m.unit}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#735E60] mt-3 pt-2 border-t border-[#28191D]/10">
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Analysis Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Climatological Comparison & Risk Classification (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
            <div>
              <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
                electrification risk evaluation
              </h3>
              <p className="text-xs text-[#735E60]">
                Calibrated against historical Indian pre-monsoon thunderstorm climatology
              </p>
            </div>
            <button
              onClick={loadLightning}
              disabled={loading}
              className="p-2 rounded-full bg-[#FFF3F0] hover:bg-[#F4E3E6] text-[#28191D] transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4E3E6]/60 border border-[#ebd0d6] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#A51F52] uppercase font-mono">
                Threat Status: {data?.risk_classification || 'CRITICAL'}
              </span>
              <span className="text-[11px] font-mono text-[#735E60]">
                {data?.climatological_percentile || 89}% Percentile
              </span>
            </div>
            <p className="text-[#28191D] font-semibold text-sm">
              {data?.safety_recommendation}
            </p>
          </div>

          {/* Breakdown: CG-, CG+, IC */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[#28191D] uppercase tracking-wider font-mono text-[11px]">
              Flash Polarity & Waveform Breakdown
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#FFF3F0] p-3 rounded-2xl border border-[#F4E3E6]">
                <span className="text-[10px] text-[#735E60] block font-semibold">NEGATIVE CG-</span>
                <span className="font-mono font-bold text-[#28191D] text-lg">{data?.cg_negative_count || 4}</span>
                <span className="text-[10px] text-[#735E60] block">Main downward stroke</span>
              </div>
              <div className="bg-[#FFF3F0] p-3 rounded-2xl border border-[#F4E3E6]">
                <span className="text-[10px] text-[#735E60] block font-semibold">POSITIVE CG+</span>
                <span className="font-mono font-bold text-[#A51F52] text-lg">{data?.cg_positive_count || 1}</span>
                <span className="text-[10px] text-[#735E60] block">Anvil high-current</span>
              </div>
              <div className="bg-[#FFF3F0] p-3 rounded-2xl border border-[#F4E3E6]">
                <span className="text-[10px] text-[#735E60] block font-semibold">INTRA-CLOUD (IC)</span>
                <span className="font-mono font-bold text-[#28191D] text-lg">{data?.intra_cloud_count || 3}</span>
                <span className="text-[10px] text-[#735E60] block">Precursor pulses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Strike Events Log (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
            <div>
              <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase">
                recent detection stream
              </h3>
              <p className="text-[11px] text-[#735E60]">
                Millisecond-precision sensor arrivals
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#735E60]">
              {(data?.strike_events || []).length} strikes logged
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {(data?.strike_events || []).map((e, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FFF3F0] border border-[#F4E3E6] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-3.5 h-3.5 text-[#A51F52]" />
                  <span className="font-bold text-[#28191D]">{e.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#735E60]">
                    {e.type}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#A51F52]">{e.peak_current_ka} kA</span>
                  <span className="text-[10px] text-[#735E60] block">{e.lat}°N, {e.lon}°E</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
