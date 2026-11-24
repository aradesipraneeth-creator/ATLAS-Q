import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Radio, Navigation, AlertTriangle, Crosshair } from 'lucide-react';

export default function WeatherMap({
  storms = [],
  radarStations = [],
  lightningEvents = [],
  selectedStorm,
  onSelectStorm
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Overlays
  const [showStorms, setShowStorms] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);

  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 800;

  const projectCoord = (lat, lon) => {
    const minLon = 68.0;
    const maxLon = 97.5;
    const minLat = 7.5;
    const maxLat = 37.0;

    const x = ((lon - minLon) / (maxLon - minLon)) * (SVG_WIDTH - 120) + 60;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (SVG_HEIGHT - 120) + 60;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Simplified India coastline/perimeter
  const indiaPerimeterCoords = [
    { lat: 35.5, lon: 74.5 }, { lat: 35.8, lon: 77.0 }, { lat: 34.0, lon: 78.5 },
    { lat: 32.5, lon: 79.0 }, { lat: 30.5, lon: 81.0 }, { lat: 28.5, lon: 82.0 },
    { lat: 27.5, lon: 88.5 }, { lat: 28.0, lon: 96.5 }, { lat: 27.0, lon: 97.0 },
    { lat: 24.5, lon: 94.5 }, { lat: 22.5, lon: 92.5 }, { lat: 21.5, lon: 89.0 },
    { lat: 21.0, lon: 87.0 }, { lat: 19.5, lon: 85.5 }, { lat: 17.5, lon: 83.5 },
    { lat: 15.0, lon: 80.2 }, { lat: 12.0, lon: 80.0 }, { lat: 10.0, lon: 79.8 },
    { lat: 8.2,  lon: 77.5 }, { lat: 9.8,  lon: 76.2 }, { lat: 13.0, lon: 74.8 },
    { lat: 15.5, lon: 73.8 }, { lat: 19.0, lon: 72.8 }, { lat: 21.0, lon: 72.6 },
    { lat: 22.8, lon: 69.5 }, { lat: 24.0, lon: 68.8 }, { lat: 25.5, lon: 71.0 },
    { lat: 28.0, lon: 70.5 }, { lat: 31.5, lon: 74.5 }, { lat: 33.5, lon: 74.0 }
  ];

  const indiaPathD = indiaPerimeterCoords
    .map((pt, i) => {
      const { x, y } = projectCoord(pt.lat, pt.lon);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';

  return (
    <div className="bg-[#FFFFFF] border border-[#EBDCD8] rounded-[2rem] overflow-hidden shadow-xs">
      {/* Top Map Toolbar (Editorial Luxury Styling) */}
      <div className="p-4 sm:p-5 border-b border-[#F4E3E6] bg-[#FFF3F0]/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#D3E4B7] text-[#28191D] flex items-center justify-center font-bold">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#28191D] font-headline lowercase flex items-center gap-2">
              interactive meteorological map
              <span className="text-[10px] font-mono bg-[#D3E4B7] text-[#28191D] px-2 py-0.5 rounded-full font-bold">
                INDIA SECTOR
              </span>
            </h3>
            <p className="text-xs text-[#735E60]">
              Vector GIS projection with Doppler DWR coverage rings & cell trajectories
            </p>
          </div>
        </div>

        {/* Controls & Layer Status */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#FFF3F0] border border-[#EBDCD8] rounded-full p-1 shadow-2xs">
            <button
              onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3.0))}
              title="Zoom In"
              className="p-1.5 hover:bg-[#F4E3E6] text-[#28191D] rounded-full transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.75))}
              title="Zoom Out"
              className="p-1.5 hover:bg-[#F4E3E6] text-[#28191D] rounded-full transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              title="Reset View"
              className="p-1.5 hover:bg-[#F4E3E6] text-[#28191D] rounded-full transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Visibility Pills */}
      <div className="px-5 py-2.5 border-b border-[#F4E3E6] bg-[#FFFFFF] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#735E60] font-medium text-[11px] flex items-center gap-1 mr-1">
          <Layers className="w-3.5 h-3.5" /> Layer Overlays:
        </span>
        <button
          onClick={() => setShowStorms(!showStorms)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            showStorms ? 'bg-[#28191D] text-[#FFF3F0]' : 'bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8]'
          }`}
        >
          ● Storm Cells ({storms.length})
        </button>
        <button
          onClick={() => setShowLightning(!showLightning)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            showLightning ? 'bg-[#A51F52] text-[#FFF3F0]' : 'bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8]'
          }`}
        >
          ⚡ Lightning Strikes ({lightningEvents.length})
        </button>
        <button
          onClick={() => setShowRadar(!showRadar)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            showRadar ? 'bg-[#D3E4B7] text-[#28191D]' : 'bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8]'
          }`}
        >
          ◎ Radar Coverage ({radarStations.length})
        </button>
        <button
          onClick={() => setShowRiskZones(!showRiskZones)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            showRiskZones ? 'bg-[#F4E3E6] text-[#A51F52] font-bold' : 'bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8]'
          }`}
        >
          ☵ Hazard Zones
        </button>
        <button
          onClick={() => setShowTrajectories(!showTrajectories)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            showTrajectories ? 'bg-[#28191D] text-[#FFF3F0]' : 'bg-[#FFF3F0] text-[#735E60] border border-[#EBDCD8]'
          }`}
        >
          ⇢ Extrapolations
        </button>
      </div>

      {/* Main Map SVG Canvas */}
      <div
        className="relative w-full h-[520px] sm:h-[580px] bg-[#FFF3F0] cursor-grab active:cursor-grabbing overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            <pattern id="editorialGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F4E3E6" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="editorialRadarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D3E4B7" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#D3E4B7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#D3E4B7" stopOpacity="0.0" />
            </radialGradient>
            <radialGradient id="editorialRiskGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A51F52" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#A51F52" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#A51F52" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#editorialGrid)" />

          {/* Coordinate latitude/longitude lines */}
          {[12, 16, 20, 24, 28, 32].map((lat) => {
            const { y } = projectCoord(lat, 68);
            return (
              <g key={`lat-${lat}`}>
                <line x1="40" y1={y} x2={SVG_WIDTH - 40} y2={y} stroke="#EBDCD8" strokeDasharray="3,4" strokeWidth="0.8" />
                <text x="45" y={y - 4} fontSize="9" fill="#735E60" fontFamily="monospace">
                  {lat}°N
                </text>
              </g>
            );
          })}
          {[72, 76, 80, 84, 88, 92, 96].map((lon) => {
            const { x } = projectCoord(8, lon);
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1="40" x2={x} y2={SVG_HEIGHT - 40} stroke="#EBDCD8" strokeDasharray="3,4" strokeWidth="0.8" />
                <text x={x + 3} y={SVG_HEIGHT - 45} fontSize="9" fill="#735E60" fontFamily="monospace">
                  {lon}°E
                </text>
              </g>
            );
          })}

          {/* India Landmass Vector */}
          <path
            d={indiaPathD}
            fill="#FFFFFF"
            stroke="#735E60"
            strokeWidth="1.6"
            strokeLinejoin="round"
            className="filter drop-shadow-xs"
          />

          {/* Severe Risk Zones */}
          {showRiskZones && (
            <g className="risk-zones">
              {/* Bengal - Odisha Zone */}
              {(() => {
                const c = projectCoord(22.0, 87.0);
                return (
                  <ellipse
                    cx={c.x}
                    cy={c.y}
                    rx="85"
                    ry="65"
                    fill="url(#editorialRiskGrad)"
                    stroke="#A51F52"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />
                );
              })()}
              {/* NCR Pre-frontal alert */}
              {(() => {
                const c = projectCoord(28.6, 77.2);
                return (
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="45"
                    fill="#f59e0b"
                    fillOpacity="0.15"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeDasharray="3,2"
                  />
                );
              })()}
            </g>
          )}

          {/* Doppler Radar Stations */}
          {showRadar &&
            radarStations.map((r) => {
              const pos = projectCoord(r.lat, r.lon);
              const radarRadius = 55;
              return (
                <g key={r.code} className="radar-station">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radarRadius}
                    fill="url(#editorialRadarGrad)"
                    stroke="#D3E4B7"
                    strokeWidth="1.2"
                    strokeDasharray="3,3"
                  />
                  {/* Sweep Line */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.x + radarRadius * 0.8}
                    y2={pos.y - radarRadius * 0.8}
                    stroke="#735E60"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    className="animate-radar-sweep"
                  />
                  {/* Station Marker */}
                  <circle cx={pos.x} cy={pos.y} r="3.5" fill="#28191D" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text
                    x={pos.x + 6}
                    y={pos.y + 3}
                    fontSize="9"
                    fontWeight="700"
                    fill="#28191D"
                    fontFamily="monospace"
                  >
                    {r.name}
                  </text>
                </g>
              );
            })}

          {/* Trajectories of Storm Cells */}
          {showTrajectories &&
            storms.map((storm) => {
              if (!storm.trajectory || storm.trajectory.length === 0) return null;
              const points = storm.trajectory.map((pt) => projectCoord(pt.lat, pt.lon));
              const pathData = points
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
                .join(' ');

              const isSelected = selectedStorm?.id === storm.id;

              return (
                <g key={`traj-${storm.id}`}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSelected ? '#A51F52' : '#735E60'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeDasharray={isSelected ? 'none' : '4,3'}
                  />
                  {storm.trajectory.map((pt, idx) => {
                    const coord = projectCoord(pt.lat, pt.lon);
                    const isNow = pt.time_label === 'NOW';
                    const isPast = pt.status === 'Past';

                    return (
                      <g key={`${storm.id}-${idx}`}>
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r={isNow ? 5 : 3}
                          fill={isNow ? '#A51F52' : isPast ? '#735E60' : '#D3E4B7'}
                          stroke="#FFFFFF"
                          strokeWidth="1"
                        />
                        {(isSelected || isNow) && (
                          <text
                            x={coord.x + 6}
                            y={coord.y - 4}
                            fontSize="8"
                            fontWeight={isNow ? '700' : '500'}
                            fill={isNow ? '#A51F52' : '#735E60'}
                            fontFamily="monospace"
                          >
                            {pt.time_label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

          {/* Lightning Strike Points */}
          {showLightning &&
            lightningEvents.map((lgt) => {
              const pos = projectCoord(lgt.lat, lgt.lon);
              return (
                <g key={lgt.id}>
                  <circle cx={pos.x} cy={pos.y} r="6" fill="#A51F52" fillOpacity="0.25" className="animate-ping" />
                  <polygon
                    points={`${pos.x},${pos.y - 6} ${pos.x - 3},${pos.y} ${pos.x + 1},${pos.y} ${pos.x - 1},${pos.y + 6} ${pos.x + 4},${pos.y - 1} ${pos.x},${pos.y - 1}`}
                    fill="#A51F52"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}

          {/* Active Storm Cells */}
          {showStorms &&
            storms.map((storm) => {
              const pos = projectCoord(storm.lat, storm.lon);
              const isSelected = selectedStorm?.id === storm.id;
              const isHigh = storm.intensity_dbz >= 50;
              const isModerate = storm.intensity_dbz >= 40 && storm.intensity_dbz < 50;
              const stormColor = isHigh ? '#A51F52' : isModerate ? '#d97706' : '#28191D';

              return (
                <g
                  key={storm.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStorm(storm);
                  }}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 18 : 14}
                    fill={isHigh ? '#F4E3E6' : '#D3E4B7'}
                    fillOpacity="0.65"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 9 : 7}
                    fill={stormColor}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="filter drop-shadow-sm group-hover:scale-125 transition-transform"
                  />
                  {/* Direction Vector */}
                  {(() => {
                    const rad = (storm.movement_direction_deg * Math.PI) / 180;
                    const arrowLen = 18;
                    const x2 = pos.x + Math.sin(rad) * arrowLen;
                    const y2 = pos.y - Math.cos(rad) * arrowLen;
                    return (
                      <line
                        x1={pos.x}
                        y1={pos.y}
                        x2={x2}
                        y2={y2}
                        stroke={stormColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    );
                  })()}
                  {/* Cell Label Pill */}
                  <rect
                    x={pos.x + 10}
                    y={pos.y - 12}
                    width={storm.id.length * 6.5 + 8}
                    height="16"
                    rx="4"
                    fill={isSelected ? '#28191D' : '#FFFFFF'}
                    stroke={isSelected ? '#A51F52' : '#EBDCD8'}
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x + 14}
                    y={pos.y}
                    fontSize="9.5"
                    fontWeight="700"
                    fill={isSelected ? '#FFFFFF' : '#28191D'}
                    fontFamily="monospace"
                  >
                    {storm.id}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Floating Mini Compass & Scale in bottom-left */}
        <div className="absolute bottom-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#EBDCD8] rounded-xl p-2.5 shadow-sm text-[10px] space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-[#28191D]">
            <Navigation className="w-3.5 h-3.5 text-[#A51F52] rotate-45" />
            <span>N-Up Azimuthal Projection</span>
          </div>
          <div className="flex items-center space-x-2 text-[#735E60] font-mono">
            <span>DWR Range: 250 km</span>
            <span>•</span>
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Legend in bottom-right */}
        <div className="absolute bottom-3 right-3 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#EBDCD8] rounded-xl p-3 shadow-sm text-[11px] space-y-1.5 hidden sm:block">
          <div className="font-bold text-[#28191D] text-[10px] uppercase tracking-wider border-b border-[#F4E3E6] pb-1">
            Reflectivity Scale (dBZ)
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-mono">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A51F52]"></span>
              <span>≥ 50 (Severe Core)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
              <span>40-49 (Convective)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#28191D]"></span>
              <span>&lt; 40 (Stratiform)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Storm Detail Drawer */}
      {selectedStorm && (
        <div className="p-5 bg-[#F4E3E6]/40 border-t border-[#F4E3E6] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-[#28191D] text-[#FFF3F0] px-2.5 py-0.5 rounded-full">
                {selectedStorm.id}
              </span>
              <h4 className="text-sm font-bold text-[#28191D] font-headline">{selectedStorm.name}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A51F52] text-white uppercase">
                {selectedStorm.estimated_risk}
              </span>
              <span className="text-[10px] bg-[#D3E4B7] text-[#28191D] px-2 py-0.5 rounded-full font-mono font-semibold">
                {selectedStorm.status}
              </span>
            </div>
            <p className="text-xs text-[#735E60]">{selectedStorm.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FFFFFF] border border-[#EBDCD8] rounded-2xl p-3.5">
            <div>
              <span className="text-[10px] text-[#735E60] block font-semibold uppercase">COORDINATES</span>
              <span className="font-mono font-semibold text-[#28191D]">
                {selectedStorm.lat.toFixed(2)}°N, {selectedStorm.lon.toFixed(2)}°E
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#735E60] block font-semibold uppercase">MAX REFLECTIVITY</span>
              <span className="font-mono font-bold text-[#A51F52]">{selectedStorm.intensity_dbz} dBZ</span>
            </div>
            <div>
              <span className="text-[10px] text-[#735E60] block font-semibold uppercase">PROPAGATION</span>
              <span className="font-mono text-[#28191D]">
                {selectedStorm.movement_direction} @ {selectedStorm.movement_speed_kmh} km/h
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#735E60] block font-semibold uppercase">LIGHTNING RISK</span>
              <span className="font-mono font-bold text-[#A51F52]">
                {(selectedStorm.lightning_probability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
