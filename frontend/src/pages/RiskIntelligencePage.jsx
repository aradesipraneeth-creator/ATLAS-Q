import React, { useState, useEffect } from 'react';
import { fetchRiskAnalysis } from '../services/api';
import { ShieldAlert, AlertTriangle, Zap, Wind, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function RiskIntelligencePage() {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRisk = async () => {
    try {
      setLoading(true);
      const res = await fetchRiskAnalysis();
      setRiskData(res);
    } catch (e) {
      console.error('Error fetching risk analysis:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisk();
  }, []);

  const summary = riskData?.summary || {};
  const alerts = riskData?.active_alerts || [];
  const riskLevel = summary?.overall_risk_level || 'HIGH';
  const probPercent = Math.round((summary?.overall_lightning_probability || 0.94) * 100);

  // SVG Gauge calculations
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - probPercent / 100);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 05 • Bayesian Hazard Synthesis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            risk intelligence & early warning.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Multi-factor weighted hazard categorization (Reflectivity 35%, Lightning 30%, CAPE 20%, Shear 15%) synthesizing explainable operational alerts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#A51F52] text-white text-xs font-bold font-mono">
            ALERT LEVEL: {riskLevel}
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold">
            BAYESIAN INDEX v2.4
          </span>
        </div>
      </div>

      {/* Main Grid: Gauge + Components */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Semi-circular Radial Gauge (Left 5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center">
          <span className="text-[10px] font-mono font-bold uppercase text-[#735E60] mb-4">
            Composite Thunderstorm Hazard Index
          </span>

          <div className="relative w-52 h-28 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="editorialGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D3E4B7" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#A51F52" />
                </linearGradient>
              </defs>

              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#F4E3E6"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#editorialGaugeGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute bottom-0 text-center">
              <span className="text-4xl font-extrabold font-headline text-[#28191D] leading-none block">
                {probPercent}%
              </span>
              <span className="text-[10px] font-mono font-bold text-[#735E60] uppercase tracking-wider block mt-1">
                Risk Confidence
              </span>
            </div>
          </div>

          {/* 4 Risk Categories Indicator Bar */}
          <div className="w-full grid grid-cols-4 gap-1.5 mt-6 text-center text-[10px] font-mono font-bold">
            <div className={`py-1.5 rounded-full ${riskLevel === 'LOW' ? 'bg-[#22c55e] text-white' : 'bg-[#FFF3F0] text-[#735E60]'}`}>
              LOW
            </div>
            <div className={`py-1.5 rounded-full ${riskLevel === 'MODERATE' ? 'bg-[#f59e0b] text-white' : 'bg-[#FFF3F0] text-[#735E60]'}`}>
              MODERATE
            </div>
            <div className={`py-1.5 rounded-full ${riskLevel === 'HIGH' ? 'bg-[#dc2626] text-white' : 'bg-[#FFF3F0] text-[#735E60]'}`}>
              HIGH
            </div>
            <div className={`py-1.5 rounded-full ${riskLevel === 'CRITICAL' ? 'bg-[#A51F52] text-white animate-pulse' : 'bg-[#F4E3E6] text-[#A51F52]'}`}>
              CRITICAL
            </div>
          </div>
        </div>

        {/* 4 Supporting Metrics Cards (Right 7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl">
            <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block mb-1">
              Weight: 35%
            </span>
            <span className="text-2xl font-extrabold text-[#A51F52] font-headline block">
              {summary?.max_storm_intensity_dbz || 55.4} dBZ
            </span>
            <h4 className="text-xs font-bold text-[#28191D] mt-0.5">Peak Doppler Reflectivity</h4>
            <span className="text-[11px] text-[#735E60] block mt-1">Hail nucleation threshold exceeded</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl">
            <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block mb-1">
              Weight: 30%
            </span>
            <span className="text-2xl font-extrabold text-[#28191D] font-headline block">
              {Math.round((summary?.overall_lightning_probability || 0.94) * 100)}%
            </span>
            <h4 className="text-xs font-bold text-[#28191D] mt-0.5">Lightning Flash Probability</h4>
            <span className="text-[11px] text-[#735E60] block mt-1">Flash density: &gt; 60 flashes/min</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl">
            <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block mb-1">
              Weight: 20%
            </span>
            <span className="text-2xl font-extrabold text-[#28191D] font-headline block">
              3,450 J/kg
            </span>
            <h4 className="text-xs font-bold text-[#28191D] mt-0.5">Thermodynamic CAPE</h4>
            <span className="text-[11px] text-[#735E60] block mt-1">Extreme convective instability</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl">
            <span className="text-[10px] font-mono uppercase font-bold text-[#735E60] block mb-1">
              Weight: 15%
            </span>
            <span className="text-2xl font-extrabold text-[#28191D] font-headline block">
              24.8 m/s
            </span>
            <h4 className="text-xs font-bold text-[#28191D] mt-0.5">0–6km Bulk Wind Shear</h4>
            <span className="text-[11px] text-[#735E60] block mt-1">Supercell organization potential</span>
          </div>
        </div>
      </div>

      {/* Generated Explainable Alerts Center */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
          <div>
            <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
              operational warning advisories ({alerts.length})
            </h3>
            <p className="text-xs text-[#735E60]">
              Transparent risk rationale with supporting observations & recommended safety actions
            </p>
          </div>
          <button
            onClick={loadRisk}
            disabled={loading}
            className="p-2 rounded-full bg-[#FFF3F0] hover:bg-[#F4E3E6] text-[#28191D] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-4">
          {alerts.map((a, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-[#FFF3F0] border border-[#EBDCD8] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBDCD8]/60">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-[#A51F52] text-white px-3 py-0.5 rounded-full">
                    {a.risk_category}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#735E60]">
                    {a.alert_id}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#735E60]">
                  Confidence: <strong className="text-[#22c55e]">{a.confidence_pct}%</strong> • Issued: {a.issued_at}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#28191D] font-headline">{a.headline}</h4>
                <p className="text-xs text-[#735E60] mt-0.5">Sector: {a.geographic_location}</p>
              </div>

              {/* Supporting Observations List */}
              <div className="bg-[#FFFFFF] rounded-2xl p-3 border border-[#EBDCD8] text-xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#735E60] block mb-1.5">
                  Supporting Meteorological Observations:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#28191D]">
                  {a.supporting_observations?.map((obs, oIdx) => (
                    <li key={oIdx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A51F52]"></span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Safety Action */}
              <div className="p-3 rounded-2xl bg-[#D3E4B7] text-[#28191D] text-xs font-semibold">
                {a.recommended_safety_action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
