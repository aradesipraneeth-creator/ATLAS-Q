import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Zap, Radio, ShieldAlert, Navigation, Info, AlertTriangle } from 'lucide-react';

export default function WeatherMap({
  storms = [],
  radarStations = [],
  lightningEvents = [],
  selectedStorm,
  onSelectStorm
}) {
  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer visibility toggles
  const [showStorms, setShowStorms] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);

  // SVG coordinate transformation for India:
  // Longitude range: 68°E to 98°E (width = 30°)
  // Latitude range: 8°N to 37°N (height = 29°)
  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 800;

  const projectCoord = (lat, lon) => {
    // Mercator-like normalized projection bounded to Indian subcontinent
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

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Simplified India perimeter outline path coordinates
  const indiaPerimeterCoords = [
    { lat: 35.5, lon: 74.5 },
    { lat: 35.8, lon: 77.0 },
    { lat: 34.0, lon: 78.5 },
    { lat: 32.5, lon: 79.0 },
    { lat: 30.5, lon: 81.0 },
    { lat: 28.5, lon: 82.0 },
    { lat: 27.5, lon: 88.5 },
    { lat: 28.0, lon: 96.5 },
    { lat: 27.0, lon: 97.0 },
    { lat: 24.5, lon: 94.5 },
    { lat: 22.5, lon: 92.5 },
    { lat: 21.5, lon: 89.0 },
    { lat: 21.0, lon: 87.0 },
    { lat: 19.5, lon: 85.5 },
    { lat: 17.5, lon: 83.5 },
    { lat: 15.0, lon: 80.2 },
    { lat: 12.0, lon: 80.0 },
    { lat: 10.0, lon: 79.8 },
    { lat: 8.2,  lon: 77.5 }, // Kanyakumari
    { lat: 9.8,  lon: 76.2 },
    { lat: 13.0, lon: 74.8 },
    { lat: 15.5, lon: 73.8 },
    { lat: 19.0, lon: 72.8 }, // Mumbai
    { lat: 21.0, lon: 72.6 },
    { lat: 22.8, lon: 69.5 }, // Gujarat coast
    { lat: 24.0, lon: 68.8 },
    { lat: 25.5, lon: 71.0 },
    { lat: 28.0, lon: 70.5 },
    { lat: 31.5, lon: 74.5 },
    { lat: 33.5, lon: 74.0 }
  ];

  const indiaPathD = indiaPerimeterCoords
    .map((pt, i) => {
      const { x, y } = projectCoord(pt.lat, pt.lon);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Top Map Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              SYNOPTIC RADAR & NOWCAST OBSERVATION MAP
              <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                INDIA SECTOR
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive vector geospatial projection with Doppler DWR coverage rings & cell trajectories
            </p>
          </div>
        </div>

        {/* Demo Data Notice */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            DEMO DATA
          </span>

          {/* Controls */}
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Visibility Pills */}
      <div className="px-4 py-2 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1 mr-1">
          <Layers className="w-3.5 h-3.5" /> Overlays:
        </span>
        <button
          onClick={() => setShowStorms(!showStorms)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            showStorms ? 'bg-sky-50 text-sky-800 border-sky-300' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          ● Storm Cells ({storms.length})
        </button>
        <button
          onClick={() => setShowLightning(!showLightning)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            showLightning ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          ⚡ Lightning Strikes ({lightningEvents.length})
        </button>
        <button
          onClick={() => setShowRadar(!showRadar)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            showRadar ? 'bg-indigo-50 text-indigo-800 border-indigo-300' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          ◎ Radar Coverage ({radarStations.length})
        </button>
        <button
          onClick={() => setShowRiskZones(!showRiskZones)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            showRiskZones ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          ☵ Severe Risk Zones
        </button>
        <button
          onClick={() => setShowTrajectories(!showTrajectories)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            showTrajectories ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
        >
          ⇢ Storm Trajectories
        </button>
      </div>

      {/* Main Map Canvas Area */}
      <div
        className="relative w-full h-[520px] sm:h-[580px] bg-slate-50 cursor-grab active:cursor-grabbing overflow-hidden select-none"
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
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
            {/* Radar scan gradient */}
            <radialGradient id="radarPulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </radialGradient>
            {/* High risk zone gradient */}
            <radialGradient id="highRiskGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#grid)" />

          {/* Coordinate latitude/longitude reference lines */}
          {[12, 16, 20, 24, 28, 32].map((lat) => {
            const { y } = projectCoord(lat, 68);
            return (
              <g key={`lat-${lat}`}>
                <line x1="40" y1={y} x2={SVG_WIDTH - 40} y2={y} stroke="#cbd5e1" strokeDasharray="3,4" strokeWidth="0.6" />
                <text x="45" y={y - 4} fontSize="9" fill="#94a3b8" fontFamily="monospace">
                  {lat}°N
                </text>
              </g>
            );
          })}
          {[72, 76, 80, 84, 88, 92, 96].map((lon) => {
            const { x } = projectCoord(8, lon);
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1="40" x2={x} y2={SVG_HEIGHT - 40} stroke="#cbd5e1" strokeDasharray="3,4" strokeWidth="0.6" />
                <text x={x + 3} y={SVG_HEIGHT - 45} fontSize="9" fill="#94a3b8" fontFamily="monospace">
                  {lon}°E
                </text>
              </g>
            );
          })}

          {/* India Boundary Shape */}
          <path
            d={indiaPathD}
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="filter drop-shadow-xs"
          />

          {/* Severe Risk Zones Overlay */}
          {showRiskZones && (
            <g className="risk-zones">
              {/* Bengal - Odisha Convective Belt */}
              {(() => {
                const center = projectCoord(22.0, 87.0);
                return (
                  <ellipse
                    cx={center.x}
                    cy={center.y}
                    rx="85"
                    ry="65"
                    fill="url(#highRiskGrad)"
                    stroke="#ef4444"
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                  />
                );
              })()}
              {/* NCR Pre-frontal alert */}
              {(() => {
                const center = projectCoord(28.6, 77.2);
                return (
                  <circle
                    cx={center.x}
                    cy={center.y}
                    r="45"
                    fill="#f59e0b"
                    fillOpacity="0.12"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />
                );
              })()}
            </g>
          )}

          {/* Doppler Radar Stations & Coverage Circles */}
          {showRadar &&
            radarStations.map((r) => {
              const pos = projectCoord(r.lat, r.lon);
              const radarRadius = 55; // represents ~250km radar coverage
              return (
                <g key={r.code} className="radar-station group">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radarRadius}
                    fill="url(#radarPulseGrad)"
                    stroke="#0284c7"
                    strokeWidth="0.8"
                    strokeDasharray="3,3"
                    className="animate-radar-pulse"
                  />
                  {/* Rotating sweep line */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.x + radarRadius * 0.8}
                    y2={pos.y - radarRadius * 0.8}
                    stroke="#0284c7"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    className="animate-radar-sweep"
                  />
                  {/* Tower Point */}
                  <circle cx={pos.x} cy={pos.y} r="3.5" fill="#0369a1" stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x={pos.x + 6}
                    y={pos.y + 3}
                    fontSize="9"
                    fontWeight="600"
                    fill="#1e293b"
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
                  {/* Trajectory line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSelected ? '#0284c7' : '#94a3b8'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeDasharray={isSelected ? 'none' : '4,3'}
                  />
                  {/* Waypoint nodes */}
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
                          fill={isNow ? '#ef4444' : isPast ? '#64748b' : '#38bdf8'}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                        {/* Waypoint time label on selected storm or NOW */}
                        {(isSelected || isNow) && (
                          <text
                            x={coord.x + 6}
                            y={coord.y - 4}
                            fontSize="8"
                            fontWeight={isNow ? '700' : '500'}
                            fill={isNow ? '#dc2626' : '#475569'}
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
                  <circle cx={pos.x} cy={pos.y} r="6" fill="#f59e0b" fillOpacity="0.25" className="animate-ping" />
                  <polygon
                    points={`${pos.x},${pos.y - 6} ${pos.x - 3},${pos.y} ${pos.x + 1},${pos.y} ${pos.x - 1},${pos.y + 6} ${pos.x + 4},${pos.y - 1} ${pos.x},${pos.y - 1}`}
                    fill="#f59e0b"
                    stroke="#b45309"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}

          {/* Active Storm Cells (Clickable Target Nodes) */}
          {showStorms &&
            storms.map((storm) => {
              const pos = projectCoord(storm.lat, storm.lon);
              const isSelected = selectedStorm?.id === storm.id;

              // Color determination based on reflectivity dBZ
              const isHigh = storm.intensity_dbz >= 50;
              const isModerate = storm.intensity_dbz >= 40 && storm.intensity_dbz < 50;
              const stormColor = isHigh ? '#dc2626' : isModerate ? '#d97706' : '#0284c7';
              const ringColor = isHigh ? '#fca5a5' : isModerate ? '#fde68a' : '#bae6fd';

              return (
                <g
                  key={storm.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStorm(storm);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse indicator */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 20 : 15}
                    fill={ringColor}
                    fillOpacity="0.5"
                    className="transition-all duration-300"
                  />
                  {/* Main storm core */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 9 : 7}
                    fill={stormColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="filter drop-shadow-sm group-hover:scale-125 transition-transform"
                  />
                  {/* Direction indicator arrow */}
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
                  {/* Storm ID Tag */}
                  <rect
                    x={pos.x + 12}
                    y={pos.y - 12}
                    width={storm.id.length * 6.5 + 8}
                    height="16"
                    rx="3"
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                    stroke={isSelected ? '#0284c7' : '#cbd5e1'}
                    strokeWidth="1"
                    className="filter drop-shadow-xs"
                  />
                  <text
                    x={pos.x + 16}
                    y={pos.y}
                    fontSize="9.5"
                    fontWeight="700"
                    fill={isSelected ? '#ffffff' : '#0f172a'}
                    fontFamily="monospace"
                  >
                    {storm.id}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Floating Mini Compass & Scale in bottom-left */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-sm text-[10px] space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-slate-700">
            <Navigation className="w-3.5 h-3.5 text-sky-600 rotate-45" />
            <span>N-Up Azimuthal Projection</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500 font-mono">
            <span>DWR Range: 250 km</span>
            <span>•</span>
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Legend in bottom-right */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-sm text-[11px] space-y-1.5 hidden sm:block">
          <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider border-b border-slate-100 pb-1">
            Reflectivity Scale (dBZ)
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-mono">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>≥ 50 (Hail/Severe)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>40-49 (Moderate)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span>&lt; 40 (Light)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Storm Detail Drawer / Information Bar */}
      {selectedStorm ? (
        <div className="p-4 bg-sky-50/60 border-t border-sky-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {selectedStorm.id}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{selectedStorm.name}</h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  selectedStorm.estimated_risk === 'HIGH'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : selectedStorm.estimated_risk === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {selectedStorm.estimated_risk} RISK
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                {selectedStorm.status}
              </span>
            </div>
            <p className="text-xs text-slate-600">{selectedStorm.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white border border-sky-200 rounded-lg p-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">LOCATION</span>
              <span className="font-mono font-semibold text-slate-800">
                {selectedStorm.lat.toFixed(2)}°N, {selectedStorm.lon.toFixed(2)}°E
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">INTENSITY</span>
              <span className="font-mono font-bold text-red-600">{selectedStorm.intensity_dbz} dBZ</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">MOVEMENT</span>
              <span className="font-mono text-slate-800">
                {selectedStorm.movement_direction} @ {selectedStorm.movement_speed_kmh} km/h
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">LIGHTNING PROB</span>
              <span className="font-mono font-bold text-amber-600">
                {(selectedStorm.lightning_probability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Click any storm cell node on the map to inspect full radar & nowcast telemetry.</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Total Monitored: {storms.length} Cells</span>
        </div>
      )}
    </div>
  );
}
