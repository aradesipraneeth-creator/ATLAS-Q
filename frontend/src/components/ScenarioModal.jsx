import React, { useState, useEffect } from 'react';
import { fetchScenarioTimeline, getReportHtmlUrl } from '../services/api';
import { X, Play, Pause, SkipBack, SkipForward, Clock, ShieldAlert, Zap, Radio, ExternalLink } from 'lucide-react';

export default function ScenarioModal({ isOpen, onClose }) {
  const [scenarioId, setScenarioId] = useState('kalbaishakhi');
  const [scenarioData, setScenarioData] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadScenario = async (id) => {
    try {
      setLoading(true);
      const res = await fetchScenarioTimeline(id);
      setScenarioData(res);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    } catch (e) {
      console.error('Error loading scenario:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadScenario(scenarioId);
    }
  }, [isOpen, scenarioId]);

  // Autoplay ticker
  useEffect(() => {
    let timer = null;
    if (isPlaying && scenarioData) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= (scenarioData.steps?.length || 1) - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenarioData]);

  if (!isOpen) return null;

  const steps = scenarioData?.steps || [];
  const currentStep = steps[currentStepIdx] || steps[0] || {};
  const cells = currentStep.cells || [];
  const alerts = currentStep.alerts || [];
  const lightning = currentStep.lightning || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#28191D]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFF3F0] rounded-[2rem] max-w-4xl w-full border border-[#EBDCD8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EBDCD8] bg-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#A51F52] text-white flex items-center justify-center font-bold">
              <Play className="w-3.5 h-3.5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-[#28191D] font-headline lowercase">
                  end-to-end scenario demonstration.
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D3E4B7] text-[#28191D] font-bold">
                  REPEATABLE
                </span>
              </div>
              <p className="text-xs text-[#735E60]">
                Step-by-step technical evaluation: Initiation → Detection → Tracking → Extrapolation → Warning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4E3E6] text-[#735E60] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#EBDCD8]">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#28191D] uppercase font-mono">Case:</span>
              <select
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                className="text-xs font-semibold bg-[#FFF3F0] border border-[#EBDCD8] rounded-full px-3 py-1.5 text-[#28191D] focus:outline-hidden"
              >
                <option value="kalbaishakhi">Severe Nor'wester (Kalbaishakhi) — Bengal & Odisha</option>
                <option value="delhi_ncr">Monsoon Squall & Microburst — Delhi-NCR</option>
                <option value="western_ghats">Orographic Convergence — Western Ghats</option>
              </select>
            </div>

            <div className="text-xs text-[#735E60] font-mono">
              Anchor: <strong className="text-[#28191D]">{scenarioData?.scenario?.nearest_dwr}</strong>
            </div>
          </div>

          {/* Timeline Step Scrubber (T-30m to T+30m) */}
          <div className="bg-[#FFFFFF] p-5 rounded-3xl border border-[#EBDCD8] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-[#735E60]">
                Timeline Scrubber ({currentStepIdx + 1} / {steps.length})
              </span>
              <span className="text-xs font-mono font-bold text-[#A51F52]">
                Observation: {currentStep.timestamp} ({currentStep.time_label})
              </span>
            </div>

            {/* Step buttons */}
            <div className="grid grid-cols-7 gap-1.5">
              {steps.map((st, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentStepIdx(i); setIsPlaying(false); }}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition flex flex-col items-center ${
                    currentStepIdx === i
                      ? 'bg-[#28191D] text-[#FFF3F0] ring-2 ring-[#A51F52]'
                      : 'bg-[#FFF3F0] text-[#735E60] hover:bg-[#F4E3E6]'
                  }`}
                >
                  <span>{st.time_label}</span>
                  <span className="text-[9px] opacity-75">{st.timestamp.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Playback Controls Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-full bg-[#FFF3F0] hover:bg-[#F4E3E6] text-[#28191D] disabled:opacity-40 transition"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-1.5 rounded-full bg-[#A51F52] hover:bg-[#881742] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Play Scenario'}</span>
                </button>

                <button
                  onClick={() => setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={currentStepIdx === steps.length - 1}
                  className="p-1.5 rounded-full bg-[#FFF3F0] hover:bg-[#F4E3E6] text-[#28191D] disabled:opacity-40 transition"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Printable report link */}
              <button
                onClick={() => window.open(getReportHtmlUrl(scenarioId), '_blank')}
                className="text-xs font-bold text-[#A51F52] hover:underline flex items-center space-x-1"
              >
                <span>Open Incident Report</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Current Step Narrative Box (Bakery Sage Green) */}
          <div className="bg-[#D3E4B7] p-5 rounded-3xl text-[#28191D] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#524446]">
                Atmospheric Progression Narrative
              </span>
              <span className="text-xs font-mono font-bold text-[#A51F52]">
                STEP: {currentStep.time_label}
              </span>
            </div>
            <p className="text-sm font-semibold leading-relaxed">
              {currentStep.narrative}
            </p>
          </div>

          {/* Current Step Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detected Cells in this step */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EBDCD8] space-y-2 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#735E60] block">
                Active Cells in Step ({cells.length})
              </span>
              {cells.map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#FFF3F0] flex justify-between items-center font-mono">
                  <div>
                    <span className="font-bold text-[#28191D]">{c.id}</span>
                    <span className="text-[#735E60] text-[10px] block">{c.lat}°N, {c.lon}°E</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#A51F52]">{c.intensity_dbz} dBZ</span>
                    <span className="text-[10px] text-[#735E60] block">{c.movement_speed_kmh} km/h</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Generated Alerts in this step */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EBDCD8] space-y-2 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-[#735E60] block">
                Generated Warning Advisories ({alerts.length})
              </span>
              {alerts.length > 0 ? (
                alerts.map((a, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#FFF3F0] border-l-2 border-[#A51F52] space-y-1">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="font-bold text-[#A51F52]">{a.risk_category}</span>
                      <span className="text-[#735E60]">{a.confidence_pct}% Conf</span>
                    </div>
                    <div className="font-bold text-[#28191D] text-[11px] truncate">{a.headline}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[#735E60] text-[11px]">
                  No severe warning thresholds triggered at this step.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EBDCD8] bg-[#FFFFFF] flex items-center justify-between text-xs text-[#735E60]">
          <span>ATLAS-Q Verification Engine • PS 26072</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#28191D] hover:bg-[#3d272c] text-[#FFF3F0] font-bold text-xs transition"
          >
            Close Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
