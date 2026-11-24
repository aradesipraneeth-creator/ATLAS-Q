import React from 'react';
import { 
  Activity, 
  Radio, 
  ShieldAlert, 
  FileText, 
  Play, 
  Bell, 
  ExternalLink,
  Download,
  Info
} from 'lucide-react';
import { getReportCsvUrl, getReportHtmlUrl } from '../services/api';

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
    { id: 'command-center', label: '01 — command center', icon: Activity },
    { id: 'forecast-intelligence', label: '02 — forecast intelligence', icon: Radio },
    { id: 'disaster-management', label: '03 — disaster management', icon: ShieldAlert },
    { id: 'about', label: '04 — about atlas-q', icon: Info },
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
            Autonomous Multimodal Thunderstorm, Cyclone & Lightning Disaster Intelligence Platform
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
            {demoMode ? 'SIMULATION MODE' : 'LIVE OBSERVATION'}
          </button>
        </div>
      </div>

      {/* Main Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Brand (Bakery-inspired editorial lowercase typography) */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab('command-center')}
              className="cursor-pointer group flex items-baseline space-x-2"
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#28191D] font-headline lowercase">
                atlas-q.
              </span>
              <span className="text-[11px] font-serif italic text-[#735E60]">
                disaster intelligence
              </span>
            </div>

            {/* Mobile Alert Indicator */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={() => setActiveTab('command-center')}
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

          {/* 4 Consolidated Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all ${
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

          {/* Quick Action Utilities: CSV, Printable Report & Scenario Launcher */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <a
              href={getReportCsvUrl()}
              download
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white border border-[#EBDCD8] hover:bg-[#FFF3F0] text-[#735E60] hover:text-[#28191D] text-xs font-mono transition"
              title="Download RFC-4180 CSV Dataset"
            >
              <Download className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>CSV</span>
            </a>

            <a
              href={getReportHtmlUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white border border-[#EBDCD8] hover:bg-[#FFF3F0] text-[#735E60] hover:text-[#28191D] text-xs font-mono transition"
              title="Printable Meteorological Report"
            >
              <FileText className="w-3.5 h-3.5 text-[#A51F52]" />
              <span>Report</span>
            </a>

            <button
              onClick={onLaunchDemo}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#D3E4B7] hover:bg-[#c2d7a2] text-[#28191D] text-xs font-bold transition shadow-xs"
            >
              <Play className="w-3 h-3 fill-[#28191D]" />
              <span>Scenarios</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
