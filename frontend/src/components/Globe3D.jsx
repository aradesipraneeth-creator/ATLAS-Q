import React, { useEffect, useRef, useState } from 'react';
import { 
  RotateCcw, 
  Layers, 
  Eye, 
  Wind, 
  CloudRain, 
  Zap, 
  ShieldAlert, 
  Compass, 
  Maximize2,
  Navigation,
  Crosshair,
  MapPin,
  Check
} from 'lucide-react';
import WeatherMap from './WeatherMap';

export default function Globe3D({
  storms = [],
  radarStations = [],
  lightningEvents = [],
  cyclones = [],
  selectedStorm,
  onSelectStorm,
  onSelectCyclone
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const [isCesiumReady, setIsCesiumReady] = useState(false);
  const [cesiumError, setCesiumError] = useState(null);

  // Layer toggles
  const [showCyclone, setShowCyclone] = useState(true);
  const [showStorms, setShowStorms] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRadarRange, setShowRadarRange] = useState(true);

  // Active cyclone reference (e.g. Cyclone Remal)
  const activeCyclone = cyclones?.length > 0 ? cyclones[0] : null;

  // Initialize CesiumJS 3D Earth
  useEffect(() => {
    if (viewMode !== '3d') return;

    let viewer = null;

    const initCesium = () => {
      if (!window.Cesium) {
        // Retry check for script load
        setTimeout(initCesium, 300);
        return;
      }

      if (!containerRef.current) return;

      try {
        const Cesium = window.Cesium;

        // Clean any existing canvas in container
        if (viewerRef.current) {
          try { viewerRef.current.destroy(); } catch (e) {}
          viewerRef.current = null;
        }

        // Initialize Cesium Viewer with clean, high-performance settings
        viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          scene3DOnly: true,
          orderIndependentTranslucency: true,
          imageryProvider: new Cesium.OpenStreetMapImageryProvider({
            url: 'https://tile.openstreetmap.org/'
          })
        });

        // Configure atmospheric lighting and sky atmosphere
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewer.scene.highDynamicRange = true;

        // Initial camera orientation centered squarely over the Indian Subcontinent
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 4800000.0),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-72.0),
            roll: 0.0
          }
        });

        viewerRef.current = viewer;
        setIsCesiumReady(true);
        setCesiumError(null);

        // Click handler on 3D entities
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id;
            if (entity._stormData && onSelectStorm) {
              onSelectStorm(entity._stormData);
            } else if (entity._cycloneData && onSelectCyclone) {
              onSelectCyclone(entity._cycloneData);
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      } catch (err) {
        console.warn('Cesium initialization warning (falling back to 2D view):', err);
        setCesiumError('WebGL 3D Context unavailable. Switched to 2D High-Resolution Radar.');
        setViewMode('2d');
      }
    };

    initCesium();

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        try { viewer.destroy(); } catch (e) {}
      }
      viewerRef.current = null;
    };
  }, [viewMode]);

  // Synchronize 3D Entities on the Globe
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || viewMode !== '3d') return;

    const Cesium = window.Cesium;
    viewer.entities.removeAll();

    // -------------------------------------------------------------
    // 1. TROPICAL CYCLONE REMAL 3D OVERLAYS
    // -------------------------------------------------------------
    if (showCyclone && activeCyclone) {
      const cur = activeCyclone.current_position;
      const hist = activeCyclone.historical_track || [];
      const fcast = activeCyclone.forecast_track || [];

      // 3D Eye Billboard / Cylinder
      const eyeEntity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(cur.lon, cur.lat, 25000),
        cylinder: {
          length: 50000.0,
          topRadius: 35000.0,
          bottomRadius: 20000.0,
          material: Cesium.Color.fromCssColorString('#A51F52').withAlpha(0.75),
          outline: true,
          outlineColor: Cesium.Color.WHITE
        },
        description: `Cyclone ${activeCyclone.name}`
      });
      eyeEntity._cycloneData = activeCyclone;

      // Label
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(cur.lon, cur.lat, 60000),
        label: {
          text: `CYCLONE ${activeCyclone.name}\n${cur.max_wind_kmh} km/h • ${cur.central_pressure_hpa} hPa`,
          font: 'bold 12px DM Sans, sans-serif',
          fillColor: Cesium.Color.WHITE,
          backgroundColor: Cesium.Color.fromCssColorString('#A51F52'),
          showBackground: true,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -25)
        }
      });

      // 3D Historical Track Polyline
      if (hist.length > 0) {
        const histCoords = hist.map(pt => [pt.lon, pt.lat, 8000]).flat();
        histCoords.push(cur.lon, cur.lat, 8000);
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(histCoords),
            width: 4.0,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.fromCssColorString('#735E60')
            })
          }
        });
      }

      // 3D Forecast Track Polyline & Uncertainty Corridor
      if (fcast.length > 0) {
        const fcastCoords = [cur.lon, cur.lat, 12000];
        fcast.forEach(pt => fcastCoords.push(pt.lon, pt.lat, 12000));
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(fcastCoords),
            width: 5.0,
            material: Cesium.Color.fromCssColorString('#A51F52')
          }
        });

        // 3D Waypoint Markers
        fcast.forEach(pt => {
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, 10000),
            point: {
              pixelSize: 8,
              color: Cesium.Color.fromCssColorString('#FFF3F0'),
              outlineColor: Cesium.Color.fromCssColorString('#A51F52'),
              outlineWidth: 2
            },
            label: {
              text: `+${pt.forecast_lead_h}h (${pt.wind_kmh} km/h)`,
              font: '10px monospace',
              fillColor: Cesium.Color.WHITE,
              showBackground: true,
              backgroundColor: Cesium.Color.fromCssColorString('#28191D').withAlpha(0.8),
              pixelOffset: new Cesium.Cartesian2(0, 15)
            }
          });
        });
      }
    }

    // -------------------------------------------------------------
    // 2. 3D THUNDERSTORM CELLS (Extruded Reflectivity Cylinders)
    // -------------------------------------------------------------
    if (showStorms) {
      storms.forEach((storm) => {
        const isSelected = selectedStorm && selectedStorm.id === storm.id;
        const colorHex = storm.intensity_dbz >= 50 ? '#A51F52' : storm.intensity_dbz >= 42 ? '#d97706' : '#2563eb';
        const heightMeters = (storm.intensity_dbz / 65.0) * 45000.0;

        const stormEntity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(storm.lon, storm.lat, heightMeters / 2.0),
          cylinder: {
            length: heightMeters,
            topRadius: 18000.0,
            bottomRadius: 28000.0,
            material: Cesium.Color.fromCssColorString(colorHex).withAlpha(isSelected ? 0.85 : 0.65),
            outline: true,
            outlineColor: isSelected ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString(colorHex)
          }
        });
        stormEntity._stormData = storm;

        // Storm ID Marker Label
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(storm.lon, storm.lat, heightMeters + 8000),
          label: {
            text: `${storm.id} • ${storm.intensity_dbz} dBZ`,
            font: 'bold 11px JetBrains Mono, monospace',
            fillColor: Cesium.Color.WHITE,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString(colorHex).withAlpha(0.85),
            pixelOffset: new Cesium.Cartesian2(0, -10)
          }
        });
      });
    }

    // -------------------------------------------------------------
    // 3. LIGHTNING FLASH OBSERVATIONS
    // -------------------------------------------------------------
    if (showLightning && lightningEvents.length > 0) {
      lightningEvents.forEach(evt => {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(evt.lon, evt.lat, 1500),
          point: {
            pixelSize: 5,
            color: Cesium.Color.GOLD.withAlpha(0.85),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1
          }
        });
      });
    }

    // -------------------------------------------------------------
    // 4. EMERGENCY SHELTER LOCATIONS
    // -------------------------------------------------------------
    if (showShelters) {
      const shelters = [
        { name: "Kakdwip Shelter", lat: 21.87, lon: 88.19 },
        { name: "Namkhana Refuge", lat: 21.76, lon: 88.23 },
        { name: "Gosaba Hub", lat: 22.16, lon: 88.80 },
        { name: "Dhamra Port", lat: 20.81, lon: 86.95 }
      ];
      shelters.forEach(sh => {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(sh.lon, sh.lat, 2000),
          point: {
            pixelSize: 7,
            color: Cesium.Color.fromCssColorString('#D3E4B7'),
            outlineColor: Cesium.Color.fromCssColorString('#28191D'),
            outlineWidth: 2
          }
        });
      });
    }

  }, [storms, cyclones, lightningEvents, selectedStorm, showCyclone, showStorms, showLightning, showShelters, viewMode]);

  // Smooth Camera FlyTo India Overview
  const handleFlyToIndia = () => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium) return;
    const Cesium = window.Cesium;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 4800000.0),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-72.0),
        roll: 0.0
      },
      duration: 1.8
    });
  };

  // Smooth Camera FlyTo Bay of Bengal Cyclone
  const handleFlyToCyclone = () => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || !activeCyclone) return;
    const Cesium = window.Cesium;
    const cur = activeCyclone.current_position;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(cur.lon, cur.lat, 1400000.0),
      orientation: {
        heading: Cesium.Math.toRadians(340.0),
        pitch: Cesium.Math.toRadians(-55.0),
        roll: 0.0
      },
      duration: 2.0
    });
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#EBDCD8] shadow-md bg-[#101b2b]">
      {/* View Mode Toggle: 3D Earth vs 2D Precision Radar */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        <div className="glass-panel-dark rounded-full p-1 flex items-center space-x-1 shadow-lg">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              viewMode === '3d'
                ? 'bg-[#A51F52] text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            3D Globe
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              viewMode === '2d'
                ? 'bg-[#A51F52] text-white shadow-xs'
                : 'text-white/70 hover:text-white'
            }`}
          >
            2D Radar View
          </button>
        </div>

        {/* Camera Quick-Fly Controls */}
        {viewMode === '3d' && (
          <div className="hidden sm:flex items-center space-x-1.5">
            <button
              onClick={handleFlyToIndia}
              className="glass-panel-dark text-white/90 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 transition"
              title="Reset view to Indian Subcontinent"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>India Overview</span>
            </button>
            {activeCyclone && (
              <button
                onClick={handleFlyToCyclone}
                className="glass-panel-dark text-white/90 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 transition"
                title="Focus on Active Tropical Cyclone"
              >
                <Wind className="w-3.5 h-3.5 text-[#A51F52]" />
                <span>Cyclone Focus</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Layer Toggles Glass Palette (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 glass-panel-dark rounded-2xl p-2.5 shadow-xl hidden md:flex items-center space-x-2 text-xs text-white">
        <button
          onClick={() => setShowCyclone(!showCyclone)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
            showCyclone ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Cyclone Track</span>
        </button>

        <button
          onClick={() => setShowStorms(!showStorms)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
            showStorms ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <CloudRain className="w-3.5 h-3.5" />
          <span>Storm Cells</span>
        </button>

        <button
          onClick={() => setShowLightning(!showLightning)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
            showLightning ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Lightning</span>
        </button>

        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
            showShelters ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#D3E4B7]" />
          <span>Shelters</span>
        </button>
      </div>

      {/* 3D Earth Globe Canvas View */}
      {viewMode === '3d' && (
        <div className="w-full h-[580px] sm:h-[680px] relative">
          <div ref={containerRef} className="w-full h-full" id="cesium-container" />
          
          {/* Subtle 3D Globe Ambient Indicator */}
          <div className="absolute bottom-4 left-4 z-20 glass-panel-dark rounded-2xl p-3 text-xs text-white space-y-1">
            <div className="flex items-center space-x-2 font-bold font-headline lowercase">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span>cesium 3d geographic globe.</span>
            </div>
            <div className="text-[10px] text-white/70 font-mono">
              Projection: WGS84 Ellipsoid • Subcontinent Camera Focus
            </div>
          </div>

          {/* 3D Legend */}
          <div className="absolute bottom-4 right-4 z-20 glass-panel-dark rounded-2xl p-3 text-xs text-white hidden sm:block space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 block">
              3D Atmospheric Overlays
            </span>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A51F52]"></span>
                <span>Cyclone / Core (≥50 dBZ)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Lightning Flash</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D3E4B7]"></span>
                <span>Shelter Refuge</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2D Precision Fallback Canvas View */}
      {viewMode === '2d' && (
        <div className="w-full">
          <WeatherMap
            storms={storms}
            radarStations={radarStations}
            lightningEvents={lightningEvents}
            selectedStorm={selectedStorm}
            onSelectStorm={onSelectStorm}
          />
        </div>
      )}
    </div>
  );
}
