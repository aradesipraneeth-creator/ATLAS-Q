import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Cpu, 
  Network,
  Waves,
  MessageSquare,
  CheckCircle2, 
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { fetchModelEvaluation } from '../services/api';

export default function AboutPage() {
  const [evalData, setEvalData] = useState(null);

  useEffect(() => {
    fetchModelEvaluation()
      .then(res => setEvalData(res.evaluation))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 04 Header (Zero SIH PS IDs) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 glass-pill text-[#28191D] text-xs font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A51F52]"></span>
            <span>04. ATLAS-Q Research</span>
            <span>•</span>
            <span>Scientific Architecture, Evaluation & Limitations</span>
          </div>
          <span className="text-xs font-mono text-[#735E60] glass-pill px-3 py-1 rounded-full">V3.0 RESEARCH PROTOTYPE</span>
        </div>

        <div className="pb-4 border-b border-[#EBDCD8] space-y-2">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
            atlas-q research.
          </h1>
          <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
            National AI-powered atmospheric intelligence and predictive disaster simulation combining 
            Liquid Neural Networks (LNN), Geographic Graph Neural Networks (GNN), hydrological flood modelling, 
            an evidence-grounded Disaster Copilot, and Quantum-Inspired Optimization.
          </p>
        </div>
      </section>

      {/* Core Research Questions */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-[#A51F52] text-xs font-bold font-mono uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>CORE RESEARCH MISSION</span>
        </div>
        <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
          five operational questions atlas-q answers.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {[
            "1. Where could a disaster develop or move?",
            "2. Which geographic locations could be affected?",
            "3. What hazards could each location experience?",
            "4. How severe could impact be & how uncertain is it?",
            "5. What response strategies reduce exposure?"
          ].map((q, i) => (
            <div key={i} className="p-3.5 rounded-2xl glass-panel border border-white/60 font-semibold text-[#28191D]">
              {q}
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Innovations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-[#A51F52] font-bold text-xs font-mono">
            <Cpu className="w-4 h-4" />
            <span>LIQUID NEURAL NETWORKS (CfC / LTC)</span>
          </div>
          <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">continuous-time temporal modelling.</h3>
          <p className="text-xs text-[#735E60] leading-relaxed">
            Models rapid convective evolution using Closed-form Continuous-time (CfC) differential equations with adaptive 
            liquid time constants τ_eff. Uses strict causal windowing with chronological 70/15/15 train-val-test splitting to prevent future data leakage.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-[#A51F52] font-bold text-xs font-mono">
            <Network className="w-4 h-4" />
            <span>GRAPH NEURAL NETWORKS (ST-GAT)</span>
          </div>
          <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">physically justified spatial graphs.</h3>
          <p className="text-xs text-[#735E60] leading-relaxed">
            Connects 16 Andhra Pradesh pilot districts using Haversine meteorological adjacency and directed upstream-to-downstream 
            river edges (Godavari, Krishna, Pennar, Nagavali) to capture neighborhood storm propagation and downstream flood risk.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-[#A51F52] font-bold text-xs font-mono">
            <Waves className="w-4 h-4" />
            <span>HYDROLOGICAL FLOOD & SURROGATE</span>
          </div>
          <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">scs-cn runoff + coastal tailwater.</h3>
          <p className="text-xs text-[#735E60] leading-relaxed">
            Integrates DEM elevation/slope vulnerability, USDA-NRCS SCS Curve Number runoff estimation, drainage capacity deficits, 
            and cyclone surge tailwater effects, paired with GNN surrogate acceleration for interactive what-if experiments.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-[#A51F52] font-bold text-xs font-mono">
            <MessageSquare className="w-4 h-4" />
            <span>DISASTER COPILOT + QSA</span>
          </div>
          <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">evidence-grounded decision support.</h3>
          <p className="text-xs text-[#735E60] leading-relaxed">
            Retrieval-Augmented assistant cites exact model IDs, timestamps, and provenance tags while classical-CPU Quantum-Inspired 
            Simulated Annealing (QSA) benchmarks emergency shelter allocation against Classical SA and Greedy baselines.
          </p>
        </div>
      </section>

      {/* Model Evaluation Results (Live from /api/intelligence/evaluation) */}
      {evalData && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBDCD8]">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#A51F52]" />
              <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
                prototype replay evaluation metrics.
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#F4E3E6] text-[#A51F52]">
              {evalData.evaluation_status}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl glass-pill text-xs text-[#735E60]">
            <strong className="text-[#28191D]">Scientific Disclosure:</strong> {evalData.disclosure}
          </div>

          {/* LNN & GNN vs Baselines Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#EBDCD8] text-[10px] uppercase font-bold text-[#735E60]">
                  <th className="py-2.5 px-3">MODEL / BASELINE</th>
                  <th className="py-2.5 px-3">RAINFALL MAE (MM/HR)</th>
                  <th className="py-2.5 px-3">LIGHTNING CSI (30M)</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E3E6]">
                {evalData.lnn_gnn_ablation?.models?.map((m, i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-3 font-sans font-bold text-[#28191D]">{m.model}</td>
                    <td className="py-2.5 px-3 text-[#A51F52] font-bold">{m.rain_mae_mm_hr}</td>
                    <td className="py-2.5 px-3">{m.lightning_csi_30m}</td>
                    <td className="py-2.5 px-3 text-right">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lightning POD / FAR / CSI & Flood Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="glass-panel p-4 rounded-2xl border border-white/60 space-y-2">
              <span className="font-sans font-bold text-[#28191D] block">Lightning Lead-Time Skill (Replay)</span>
              {evalData.lightning_evaluation?.windows?.map((w, i) => (
                <div key={i} className="flex justify-between">
                  <span>{w.lead} Window:</span>
                  <span>POD {w.pod} | FAR {w.far} | CSI <strong className="text-[#A51F52]">{w.csi}</strong></span>
                </div>
              ))}
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/60 space-y-2">
              <span className="font-sans font-bold text-[#28191D] block">Flood & Cyclone Replay Benchmarks</span>
              <div className="flex justify-between"><span>Godavari/Krishna IoU:</span><strong>{evalData.flood_evaluation?.inundation_iou}</strong></div>
              <div className="flex justify-between"><span>Water Depth RMSE:</span><strong>{evalData.flood_evaluation?.water_depth_rmse_m} m</strong></div>
              <div className="flex justify-between"><span>Cyclone 24h Track Err:</span><strong>{evalData.cyclone_evaluation?.track_error_km?.['24h']} km</strong></div>
            </div>
          </div>
        </section>
      )}

      {/* Limitations & Future Scope */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
          honest limitations & future scope.
        </h2>
        <ul className="text-xs text-[#735E60] space-y-2 leading-relaxed list-disc pl-5">
          <li><strong>Prototype Training Status:</strong> Current LNN and GNN weights (`lnn_cfc_v1.json`) are calibrated on deterministic replay scenarios rather than multi-year archived IMD Doppler volumetric scans.</li>
          <li><strong>Official Authority Boundary:</strong> ATLAS-Q complements — and never replaces — official IMD cyclone bulletins, ISRO/NRSC satellite nowcasts, and NDMA/SDMA evacuation authorizations.</li>
          <li><strong>Next Research Phase:</strong> Ingest multi-year IMD NetCDF/HDF5 radar archives, train PyTorch CfC + PyTorch Geometric ST-GAT models offline, and couple with 2D HEC-RAS/LISFLOOD-FP hydrodynamic ground truth.</li>
        </ul>
      </section>

      {/* Attribution */}
      <section className="p-6 rounded-3xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-[#28191D] text-sm block font-headline lowercase">atlas-q research platform.</span>
          <p className="text-xs text-[#735E60]">Open-architecture atmospheric intelligence & disaster simulation prototype.</p>
        </div>
        <a
          href="https://github.com/aradesipraneeth-creator/ATLAS-Q"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#28191D] hover:bg-[#3d272c] text-white rounded-full font-bold uppercase tracking-wider text-[10px] transition inline-flex items-center space-x-1 shadow-xs"
        >
          <span>GitHub Repository</span>
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </section>
    </div>
  );
}
