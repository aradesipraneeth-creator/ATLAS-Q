import React from 'react';
import { 
  Info, 
  Target, 
  Cpu, 
  Layers, 
  Database, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight, 
  Radio, 
  ShieldAlert, 
  Wind, 
  CloudRain,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 04 Header & Editorial Title */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 bg-[#D3E4B7] text-[#28191D] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#A51F52]"></span>
            <span>04 — About ATLAS-Q</span>
            <span>•</span>
            <span>Project Documentation & Scientific Architecture</span>
          </div>
          <span className="text-xs font-mono text-[#735E60]">SIH 2026 • PS 26072</span>
        </div>

        <div className="pb-4 border-b border-[#EBDCD8] space-y-2">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#28191D] font-headline lowercase">
            architecture & science.
          </h1>
          <p className="text-base sm:text-lg text-[#735E60] font-sans leading-relaxed">
            Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization. 
            A comprehensive overview of our scientific foundation, computational models, and operational architecture.
          </p>
        </div>
      </section>

      {/* 1. Problem Statement & Motivation */}
      <section className="bg-white border border-[#EBDCD8] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-[#A51F52] text-xs font-bold font-mono uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>SMART INDIA HACKATHON 2026 • PS 26072</span>
        </div>
        <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
          the severe weather nowcasting challenge.
        </h2>
        <p className="text-sm text-[#735E60] leading-relaxed">
          Severe convective thunderstorms, lightning strikes, and tropical cyclones cause thousands of casualties 
          and extensive socioeconomic destruction annually across India. Traditional Numerical Weather Prediction (NWP) 
          models run on 6-to-12-hour assimilation cycles, creating an observational blind spot for rapid convective 
          events (Kalbaishakhi/Nor'westers) that initiate, intensify, and dissipate within 30 to 90 minutes.
        </p>
        <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8] text-xs text-[#28191D] font-sans">
          <strong>Official Challenge:</strong> "AIML based Nowcasting of thunderstorm and lightning using atmospheric 
          observation including multiple radars, satellite, lightning and model data."
        </div>
      </section>

      {/* 2. End-to-End System Architecture */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
          end-to-end data & decision workflow.
        </h2>
        <div className="bg-white border border-[#EBDCD8] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#A51F52] block">STAGE 1: INGESTION</span>
              <h4 className="font-bold text-[#28191D] text-sm">Multimodal Sensors</h4>
              <p className="text-[#735E60] leading-snug">
                Doppler Weather Radar (DWR) S-Band grids, INSAT-3D/3DR TIR channels, ground lightning detectors, and Open-Meteo surface stations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#A51F52] block">STAGE 2: NOWCASTING</span>
              <h4 className="font-bold text-[#28191D] text-sm">Spatial Clustering & Kinematics</h4>
              <p className="text-[#735E60] leading-snug">
                8-connectivity connected-component cell isolation (Z ≥ 35 dBZ), centroid tracking, and 0–60m Haversine extrapolation with 95% uncertainty cones.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#A51F52] block">STAGE 3: CYCLONE ENGINE</span>
              <h4 className="font-bold text-[#28191D] text-sm">Track & Wind Radii</h4>
              <p className="text-[#735E60] leading-snug">
                IMD-standard advisory parsing, eye tracking, quadrant wind radii (R34, R50, R64), and coastal storm surge inundation estimation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#D3E4B7] border border-[#c4db9e] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#28191D] block">STAGE 4: DECISION QSA</span>
              <h4 className="font-bold text-[#28191D] text-sm">Resource Optimization</h4>
              <p className="text-[#28191D] leading-snug font-medium">
                Quantum-Inspired Simulated Annealing on CPU escaping local minima to allocate shelters, rescue boats, and evacuation staging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quantum-Inspired Simulated Annealing (QSA) Detailed Mechanics */}
      <section className="bg-white border border-[#EBDCD8] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-[#A51F52] text-xs font-bold font-mono uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>MATHEMATICAL FOUNDATION</span>
        </div>
        <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
          how quantum-inspired optimization works.
        </h2>
        <div className="space-y-4 text-sm text-[#735E60] leading-relaxed">
          <p>
            In complex disaster logistics, assigning thousands of evacuees across finite-capacity shelters while 
            minimizing exposure to severe flood corridors creates a <strong>non-convex, NP-hard combinatorial energy landscape</strong>. 
            Classical greedy and standard simulated annealing algorithms frequently become trapped in suboptimal local minima.
          </p>
          <div className="p-5 rounded-2xl bg-[#FFF3F0] border border-[#EBDCD8] font-mono text-xs text-[#28191D] space-y-2">
            <div className="font-bold text-[#A51F52]">Transverse-Field Ising Hamiltonian Mapping:</div>
            <div>H = - \sum_{'{i,j}'} J_{'{ij}'} \sigma_i^z \sigma_j^z - \Gamma(t) \sum_i \sigma_i^x</div>
            <p className="font-sans text-[11px] text-[#735E60] pt-1">
              Where \(\Gamma(t)\) represents the fictitious transverse magnetic field that decays smoothly over annealing iterations, 
              inducing simulated quantum tunneling through tall, narrow potential energy barriers that thermal thermal fluctuations (\(k_B T\)) cannot overcome.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F4E3E6]/60 border border-[#ebd0d6] text-xs text-[#28191D]">
            <strong>Scientific Integrity Statement:</strong> ATLAS-Q executes this algorithm purely on classical CPUs 
            using matrix-free Trotter-Suzuki discretized path-integral approximations. We do not claim physical quantum 
            hardware execution or quantum supremacy; rather, we demonstrate measurable empirical improvements over classical heuristics.
          </div>
        </div>
      </section>

      {/* 4. Technology Stack & Verification */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EBDCD8] rounded-3xl p-6 space-y-3">
          <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
            frontend engineering.
          </h3>
          <ul className="text-xs text-[#735E60] space-y-2 font-mono">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>React 18 + Vite (SPA Architecture)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Tailwind CSS with Custom Editorial Palette</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Dynamic SVG Azimuthal Geographic Projection Map</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Lucide Icons & Responsive Breakpoints</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-[#EBDCD8] rounded-3xl p-6 space-y-3">
          <h3 className="text-lg font-bold text-[#28191D] font-headline lowercase">
            backend & algorithmic services.
          </h3>
          <ul className="text-xs text-[#735E60] space-y-2 font-mono">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Python 3.11 + FastAPI + Uvicorn Async</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>8-Connectivity Spatial Clustering & Kinematics</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>IMD-Standard Tropical Cyclone Track & Radii Modeling</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Single-Container Render Deployment</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Roadmap: From Prototype to Operational Production */}
      <section className="bg-white border border-[#EBDCD8] rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-[#28191D] font-headline lowercase">
          model evolution roadmap.
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#EBDCD8] text-[10px] uppercase font-bold text-[#735E60]">
                <th className="py-2.5 px-3">CAPABILITY</th>
                <th className="py-2.5 px-3">PHASE 1 (CURRENT PROTOTYPE)</th>
                <th className="py-2.5 px-3">PHASE 2 (PRODUCTION TARGET)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E3E6]">
              <tr>
                <td className="py-3 px-3 font-bold text-[#28191D]">Storm Detection</td>
                <td className="py-3 px-3 text-[#A51F52] font-medium">8-Connectivity Connected-Component (Z ≥ 35 dBZ)</td>
                <td className="py-3 px-3 text-[#735E60]">3D Residual UNet on Full Volumetric Radar Scans</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#28191D]">Motion Nowcasting</td>
                <td className="py-3 px-3 text-[#A51F52] font-medium">Kinematic Centroid Displacement & Uncertainty Cones</td>
                <td className="py-3 px-3 text-[#735E60]">Fourier Neural Operators (FNO) + Spatiotemporal ViT</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#28191D]">Cyclone Forecasting</td>
                <td className="py-3 px-3 text-[#A51F52] font-medium">IMD Multi-Model Consensus & Radius Extrapolation</td>
                <td className="py-3 px-3 text-[#735E60]">Physics-Informed Neural Networks (PINN) on NWP Vorticity</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-[#28191D]">Decision Optimization</td>
                <td className="py-3 px-3 text-[#A51F52] font-medium">Quantum-Inspired Simulated Annealing on CPU (QSA)</td>
                <td className="py-3 px-3 text-[#735E60]">Hybrid QAOA / D-Wave Annealer Cloud Integration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Credits & Project Attribution */}
      <section className="p-6 rounded-3xl bg-[#FFF3F0] border border-[#EBDCD8] text-xs text-[#735E60] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-[#28191D] text-sm block font-headline lowercase">atlas-q development team.</span>
          <p>Engineered for the Smart India Hackathon (SIH 2026) • Problem Statement 26072.</p>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com/aradesipraneeth-creator/ATLAS-Q"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#28191D] hover:bg-[#3d272d] text-white rounded-full font-bold uppercase tracking-wider text-[10px] transition inline-flex items-center space-x-1"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </section>
    </div>
  );
}
