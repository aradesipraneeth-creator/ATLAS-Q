import React from 'react';
import { Zap, Activity, ShieldAlert, Cpu, Layers, Info, Radio } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, systemOnline }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'live-analysis', label: 'Live Analysis', icon: Radio },
    { id: 'storm-tracking', label: 'Storm Tracking', icon: Zap },
    { id: 'risk-map', label: 'Risk Map', icon: ShieldAlert },
    { id: 'architecture', label: 'System Architecture', icon: Layers },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Banner with SIH Metadata */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            SIH 2026 • PS 26072
          </span>
          <span className="hidden sm:inline text-slate-400">
            AIML Thunderstorm & Lightning Nowcasting System
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[11px] text-slate-300 font-mono">
              {systemOnline ? 'API CONNECTED' : 'CHECKING API...'}
            </span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border border-amber-500/40">
            PHASE 1 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Header Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Titles */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-800 flex items-center justify-center text-white shadow-sm ring-2 ring-sky-500/20">
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300/40" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
                  ATLAS-Q
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium border border-sky-200">
                  v1.0 Demo
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Atmospheric Thunderstorm & Lightning Analysis System
              </p>
              <p className="text-[11px] text-sky-700 font-medium">
                Quantum-Inspired AI for Multimodal Thunderstorm Nowcasting
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 border border-sky-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
