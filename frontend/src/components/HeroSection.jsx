import React from 'react';
import { ArrowDownRight, Play, Radio, ShieldAlert } from 'lucide-react';

export default function HeroSection({ onExploreLive, onLaunchSimulation }) {
  return (
    <section className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-[#735E60] bg-[#F4E3E6] px-3.5 py-1 rounded-full">
            SIH 2026 PS 26072 • MULTIMODAL NOWCASTING
          </span>
        </div>

        {/* Oversized Bold Headline (Inspired by bakery reference: 'butter, sugar, patience.') */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#28191D] font-headline lowercase leading-[0.95]">
            understand storms.<br />
            before they strike.
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#735E60] font-sans max-w-2xl mx-auto font-normal leading-relaxed">
            AI-powered thunderstorm intelligence that transforms atmospheric observations into storm tracking, lightning-risk insights and actionable geographic warnings.
          </p>

          {/* Action CTAs (Editorial underline and pill buttons) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <button
              onClick={onExploreLive}
              className="px-6 py-3 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] font-bold tracking-tight transition shadow-sm flex items-center space-x-2"
            >
              <span>Explore Live Intelligence</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchSimulation}
              className="px-6 py-3 rounded-full bg-[#D3E4B7] hover:bg-[#c3d8a3] text-[#28191D] font-bold tracking-tight transition flex items-center space-x-2 border border-[#b8ce96]"
            >
              <Play className="w-3.5 h-3.5 fill-[#28191D]" />
              <span>Launch Storm Simulation</span>
            </button>
          </div>
        </div>

        {/* Circular Atmospheric Imagery Overlapping Rounded Container (Reference Layout) */}
        <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
          {/* Centered Circular Atmospheric Photography Cutout */}
          <div className="relative z-10 flex justify-center -mb-20 sm:-mb-24">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-2 bg-[#FFF3F0] shadow-xl ring-8 ring-[#FFF3F0]">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-br from-[#1e3e62] to-[#0b192c] flex items-center justify-center">
                {/* Embedded SVG High-Res Atmospheric Convective Vortex Artwork */}
                <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
                  <defs>
                    <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#A51F52" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#2563eb" stopOpacity="0.6" />
                      <stop offset="80%" stopColor="#0b192c" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                    </radialGradient>
                  </defs>
                  <circle cx="100" cy="100" r="100" fill="url(#vortexGlow)" />
                  {/* Spiral convection arms */}
                  <path d="M 100 100 Q 140 60 170 100 T 130 160 T 60 140 T 50 80 T 110 50" fill="none" stroke="#D3E4B7" strokeWidth="3" strokeOpacity="0.75" />
                  <path d="M 100 100 Q 70 130 50 100 T 80 50 T 140 60 T 150 120" fill="none" stroke="#F4E3E6" strokeWidth="2.5" strokeOpacity="0.8" />
                  <circle cx="100" cy="100" r="12" fill="#FFFFFF" fillOpacity="0.9" className="animate-ping" style={{ animationDuration: '4s' }} />
                  <circle cx="100" cy="100" r="6" fill="#A51F52" />
                </svg>

                {/* Micro Label Pill */}
                <span className="absolute bottom-3 bg-[#28191D]/80 backdrop-blur-xs text-[#FFF3F0] text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                  INSAT-3D TIR Core
                </span>
              </div>
            </div>
          </div>

          {/* Large Rounded Sage Green Pill Container (`#D3E4B7`) */}
          <div className="bg-[#D3E4B7] rounded-[2rem] sm:rounded-[3rem] pt-24 sm:pt-28 pb-8 px-6 sm:px-12 text-[#28191D] shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#b8ce96]/80">
              <div className="pt-4 md:pt-0 md:pr-6">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#735E60] block mb-1">
                  Multimodal Observation
                </span>
                <h3 className="text-xl font-extrabold tracking-tight font-headline">
                  doppler + satellite + lightning
                </h3>
                <p className="text-xs text-[#524446] mt-2 leading-relaxed">
                  Real-time harmonization across 8 S-Band/C-Band Indian Doppler radars, INSAT-3D TIR vapor channels, and IITM surface lightning networks.
                </p>
              </div>

              <div className="pt-4 md:pt-0 md:px-6">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#735E60] block mb-1">
                  Kinematic Extrapolation
                </span>
                <h3 className="text-xl font-extrabold tracking-tight font-headline">
                  0–60 min predictive nowcast
                </h3>
                <p className="text-xs text-[#524446] mt-2 leading-relaxed">
                  Continuous-time cell tracking with expanding uncertainty radii, microburst gust projection, and lightning initiation probability.
                </p>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#735E60] block mb-1">
                  Classical Optimization
                </span>
                <h3 className="text-xl font-extrabold tracking-tight font-headline">
                  quantum-inspired search
                </h3>
                <p className="text-xs text-[#524446] mt-2 leading-relaxed">
                  Simulated quantum annealing (QSA) tuning multi-radar parameters on standard CPUs without quantum hardware dependencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
