import React from 'react';
import { Zap, Bell, Activity, Radio, Compass, ShieldAlert, Cpu, Database, FileText, Settings, Play } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  systemOnline,
  alertsCount = 0,
  demoMode,
  setDemoMode,
  onLaunchDemo
}) {
  const navItems = [
    { id: 'overview', label: 'overview', icon: Activity },
    { id: 'live-radar', label: 'live radar', icon: Radio },
    { id: 'storm-tracking', label: 'storm tracking', icon: Compass },
    { id: 'lightning', label: 'lightning', icon: Zap },
    { id: 'risk-intelligence', label: 'risk intelligence', icon: ShieldAlert },
    { id: 'ai-optimization', label: 'ai & optimization', icon: Cpu },
    { id: 'data-sources', label: 'data sources', icon: Database },
    { id: 'reports', label: 'reports', icon: FileText },
    { id: 'settings', label: 'settings', icon: Settings },
  ];

  return (
    <header className="bg-[#FFF3F0] border-b border-[#EBDCD8] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      {/* Editorial Micro-Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-1.5 flex flex-wrap justify-between items-center text-[11px] text-[#735E60] font-sans border-b border-[#F4E3E6]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wider uppercase text-[#A51F52]">
            SIH 2026 • PS 26072
          </span>
          <span className="hidden md:inline text-[#735E60]">
            Autonomous Multimodal Thunderstorm & Lightning Nowcasting Platform
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-[#22c55e] animate-pulse' : 'bg-[#f59e0b]'}`}></span>
            <span className="font-mono text-[10px] tracking-tight">
              {systemOnline ? 'GATEWAY ONLINE' : 'GATEWAY CONNECTING'}
            </span>
          </div>
          <span className="text-[#735E60] font-mono hidden sm:inline">
            UPDATED: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
          </span>
          {/* Demo Mode Toggle Button */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition ${
              demoMode
                ? 'bg-[#D3E4B7] text-[#28191D]'
                : 'bg-[#F4E3E6] text-[#A51F52]'
            }`}
          >
            {demoMode ? 'SIMULATION MODE' : 'LIVE DATA MODE'}
          </button>
        </div>
      </div>

      {/* Main Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Brand (Bakery-inspired editorial lowercase typography) */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab('overview')}
              className="cursor-pointer group flex items-baseline space-x-2"
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#28191D] font-headline lowercase">
                atlas-q.
              </span>
              <span className="text-[11px] font-serif italic text-[#735E60]">
                meteorological intelligence
              </span>
            </div>

            {/* Mobile Notification & Simulation Action */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={() => setActiveTab('risk-intelligence')}
                className="relative p-2 rounded-full bg-[#F4E3E6] text-[#A51F52]"
              >
                <Bell className="w-4 h-4" />
                {alertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A51F52] text-white text-[9px] font-bold flex items-center justify-center">
                    {alertsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 9 Navigation Links (Clean, unbordered, editorial styling) */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#28191D] text-[#FFF3F0] shadow-xs'
                      : 'text-[#735E60] hover:text-[#28191D] hover:bg-[#F4E3E6]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Notification Center & Quick Scenario Play */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('risk-intelligence')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F4E3E6] hover:bg-[#ebd0d6] text-[#A51F52] text-xs font-semibold transition"
              title="View Warning Advisories"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{alertsCount} Alerts</span>
            </button>

            <button
              onClick={onLaunchDemo}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#D3E4B7] hover:bg-[#c2d7a2] text-[#28191D] text-xs font-bold transition shadow-xs"
            >
              <Play className="w-3 h-3 fill-[#28191D]" />
              <span>Launch Scenario</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
