import React, { useState } from 'react';
import { getReportCsvUrl, getReportHtmlUrl } from '../services/api';
import { FileText, Download, ExternalLink, Printer, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReportsPage() {
  const [selectedScenario, setSelectedScenario] = useState('kalbaishakhi');

  const handleDownloadCsv = () => {
    window.open(getReportCsvUrl(selectedScenario), '_blank');
  };

  const handleViewHtml = () => {
    window.open(getReportHtmlUrl(selectedScenario), '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#735E60] font-bold block mb-1">
            Section 08 • Incident Documentation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#28191D] font-headline lowercase">
            incident reports & data export.
          </h2>
          <p className="text-xs text-[#735E60] mt-1 max-w-2xl">
            Automated compilation of meteorological nowcasting incident reports in RFC-4180 CSV and printable editorial HTML/PDF formats.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#D3E4B7] text-[#28191D] text-xs font-bold font-mono">
            FORMATS: CSV + PDF
          </span>
        </div>
      </div>

      {/* Report Generator Selector Card */}
      <div className="bg-[#D3E4B7] rounded-[2rem] p-6 sm:p-8 text-[#28191D] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#b8ce96] gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#524446] block mb-1">
              Select Incident Case
            </span>
            <h3 className="text-2xl font-extrabold font-headline">
              Meteorological Verification Report
            </h3>
            <p className="text-xs text-[#524446] mt-1">
              Extract full kinematic advection records, reflectivity profiles, and generated warning advisories
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="text-xs font-semibold bg-[#FFFFFF] border border-[#b8ce96] rounded-full px-4 py-2 text-[#28191D] focus:outline-hidden font-mono shadow-xs"
            >
              <option value="kalbaishakhi">Kolkata Sector (Kalbaishakhi Squall)</option>
              <option value="delhi_ncr">Delhi-NCR Sector (Pre-Frontal Cell)</option>
              <option value="western_ghats">Western Ghats (Orographic Convection)</option>
            </select>
          </div>
        </div>

        {/* Dual Export Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleDownloadCsv}
            className="px-6 py-3 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] text-xs font-bold transition flex items-center space-x-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download RFC-4180 CSV Data</span>
          </button>

          <button
            onClick={handleViewHtml}
            className="px-6 py-3 rounded-full bg-[#FFFFFF] hover:bg-[#FFF3F0] text-[#28191D] text-xs font-bold transition flex items-center space-x-2 border border-[#b8ce96] shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Open Printable HTML / PDF Report</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 text-[#735E60]" />
          </button>
        </div>
      </div>

      {/* Report Structure Preview Card */}
      <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4E3E6]">
          <div>
            <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
              compiled report sections
            </h3>
            <p className="text-xs text-[#735E60]">
              Certified schema for disaster authorities, civil defense, and hackathon evaluation
            </p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#FFF3F0] text-[#735E60] font-bold">
            SCHEMA v2.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#A51F52] uppercase block">Part A</span>
            <h4 className="font-bold text-[#28191D] text-sm">Incident Synopsis & Synoptic Setup</h4>
            <p className="text-[#735E60] leading-relaxed text-[11px]">
              Spatial boundaries, nearest Doppler Weather Radar station, timestamp intervals, and environmental forcing parameters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#A51F52] uppercase block">Part B</span>
            <h4 className="font-bold text-[#28191D] text-sm">Cell Detections & Trajectory Kinematics</h4>
            <p className="text-[#735E60] leading-relaxed text-[11px]">
              Extracted centroid coordinates, convective area (km²), peak reflectivity (dBZ), echo tops, and 0–60 min predicted vectors.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF3F0] border border-[#F4E3E6] space-y-2">
            <span className="font-mono text-[10px] font-bold text-[#A51F52] uppercase block">Part C</span>
            <h4 className="font-bold text-[#28191D] text-sm">Risk Assessment & Warning Advisories</h4>
            <p className="text-[#735E60] leading-relaxed text-[11px]">
              Multi-factor risk scores, lightning density metrics, active alerts with confidence scores, and operational limitations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
