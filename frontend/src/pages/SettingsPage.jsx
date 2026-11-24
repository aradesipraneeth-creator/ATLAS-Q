import React, { useState } from 'react';
import { Settings, Sliders, ShieldCheck, Info, CheckCircle2, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const [units, setUnits] = useState('metric');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 09 • Platform Configuration
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            system preferences & settings.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Operational telemetry units, warning alert thresholds, and platform diagnostic specifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold font-mono">
            VERSION 2.0 EDITORIAL
          </span>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit & Display Preferences */}
        <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase pb-2 border-b border-[#F4E3E6]">
            measurement & display units
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#28191D] block">Measurement System</span>
                <span className="text-[#735E60] text-[11px]">Display speed in km/h, distance in km, rain in mm</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#FFF3F0] p-1 rounded-full border border-[#EBDCD8]">
                <button
                  onClick={() => setUnits('metric')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    units === 'metric' ? 'bg-[#28191D] text-[#FFF3F0]' : 'text-[#735E60]'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => setUnits('imperial')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    units === 'imperial' ? 'bg-[#28191D] text-[#FFF3F0]' : 'text-[#735E60]'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F4E3E6]">
              <div>
                <span className="font-bold text-[#28191D] block">Automated Telemetry Polling</span>
                <span className="text-[#735E60] text-[11px]">Periodically query Open-Meteo & radar stream</span>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoRefresh ? 'bg-[#22c55e]' : 'bg-[#EBDCD8]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    autoRefresh ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F4E3E6]">
              <div>
                <span className="font-bold text-[#28191D] block">Critical Audio Alerts</span>
                <span className="text-[#735E60] text-[11px]">Sound chime on new CRITICAL risk level warnings</span>
              </div>
              <button
                onClick={() => setSoundAlerts(!soundAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  soundAlerts ? 'bg-[#22c55e]' : 'bg-[#EBDCD8]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    soundAlerts ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* System Diagnostics & SIH Compliance */}
        <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase pb-2 border-b border-[#F4E3E6]">
            hackathon compliance & diagnostics
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] flex justify-between items-center">
              <span className="text-[#735E60]">Problem Statement:</span>
              <span className="font-mono font-bold text-[#28191D]">SIH 2026 PS 26072</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] flex justify-between items-center">
              <span className="text-[#735E60]">System Edition:</span>
              <span className="font-mono font-bold text-[#28191D]">v2.0.0-editorial</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] flex justify-between items-center">
              <span className="text-[#735E60]">Optimization Kernel:</span>
              <span className="font-mono font-bold text-[#A51F52]">Quantum-Inspired SA (Classical CPU)</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] flex justify-between items-center">
              <span className="text-[#735E60]">Hosting Runtime:</span>
              <span className="font-mono font-bold text-[#22c55e]">Python 3.11 + Uvicorn + React 18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
