import React from 'react';
import HeroMetrics from '../components/HeroMetrics';
import SystemStatus from '../components/SystemStatus';
import WeatherMap from '../components/WeatherMap';
import StormTrajectory from '../components/StormTrajectory';
import MultimodalPipeline from '../components/MultimodalPipeline';
import QuantumOptimization from '../components/QuantumOptimization';
import RiskGauge from '../components/RiskGauge';

export default function DashboardPage({
  dashboardData,
  stormsData,
  riskData,
  archData,
  selectedStorm,
  setSelectedStorm,
  onOpenStormModal
}) {
  const storms = stormsData?.storms || [];
  const radarStations = stormsData?.radar_stations || [];
  const lightningEvents = stormsData?.lightning_events || [];

  return (
    <div className="space-y-6">
      {/* System Status Telemetry */}
      <SystemStatus statusData={dashboardData?.system_status} />

      {/* Hero Metrics (Current Weather Analysis) */}
      <HeroMetrics
        metrics={dashboardData?.hero_metrics}
        disclaimer={dashboardData?.disclaimer}
      />

      {/* Interactive Weather Map */}
      <WeatherMap
        storms={storms}
        radarStations={radarStations}
        lightningEvents={lightningEvents}
        selectedStorm={selectedStorm}
        onSelectStorm={(storm) => {
          setSelectedStorm(storm);
          if (onOpenStormModal) onOpenStormModal(storm);
        }}
      />

      {/* Storm Trajectory Section */}
      {selectedStorm && (
        <StormTrajectory storm={selectedStorm} />
      )}

      {/* Risk Gauge Section */}
      <RiskGauge riskData={riskData} />

      {/* Multimodal Harmonization Pipeline */}
      <MultimodalPipeline sources={archData?.multimodal_pipeline} />

      {/* Quantum-Inspired Optimization Module */}
      <QuantumOptimization data={archData?.quantum_optimization} />
    </div>
  );
}
