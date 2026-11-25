import React, { useEffect, useRef, useState } from 'react';
import { 
  RotateCcw, 
  Wind, 
  CloudRain, 
  Zap, 
  ShieldAlert, 
  Map as MapIcon,
  Globe2,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import WeatherMap from './WeatherMap';
import { loadIndiaBoundaries, loadIndiaStates, loadIndiaDistricts } from '../data/geography/geoLoader';

// Verified Major Indian Cities for Geographic Context
const INDIA_CITIES = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, tier: 1 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, tier: 1 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, tier: 1 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, tier: 1 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, tier: 1 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, tier: 1 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, tier: 2 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, tier: 2 },
  { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, tier: 2 },
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362, tier: 2 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, tier: 2 },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673, tier: 2 }
];

export default function Globe3D({
  storms = [],
  radarStations = [],
  lightningEvents = [],
  cyclones = [],
  gnnData = null,
  regionMode = 'india',
  selectedStorm,
  onSelectStorm,
  onSelectCyclone,
  onSelectDistrict
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const geoJsonSourceRef = useRef(null);

  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const [zoomPreset, setZoomPreset] = useState('overview'); // 'overview', 'regional', 'local'
  const [imageryStatus, setImageryStatus] = useState('loading'); // 'loading', 'esri-satellite', 'osm-fallback', 'error'
  const [boundaryLoaded, setBoundaryLoaded] = useState(false);

  // Layer toggles
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showCities, setShowCities] = useState(true);
  const [showCyclone, setShowCyclone] = useState(true);
  const [showStorms, setShowStorms] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [showShelters, setShowShelters] = useState(true);

  const activeCyclone = cyclones?.length > 0 ? cyclones[0] : null;

  // Initialize CesiumJS 1.120 3D Earth Viewer
  useEffect(() => {
    if (viewMode !== '3d') return;

    let viewer = null;
    let isMounted = true;

    const initCesium = async () => {
      if (!window.Cesium) {
        if (isMounted) setTimeout(initCesium, 250);
        return;
      }

      if (!containerRef.current) return;

      try {
        const Cesium = window.Cesium;

        // Clean any existing instance
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          try { viewerRef.current.destroy(); } catch (e) {}
          viewerRef.current = null;
        }

        // IMPORTANT: In CesiumJS 1.104+, `baseLayer: false` prevents default Cesium Ion (which fails without token & shows blue sphere)
        viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          baseLayer: false,
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
          requestRenderMode: true,
          maximumRenderTimeChange: Infinity,
          creditContainer: document.createElement('div') // keeps attribution clean inside container
        });

        // Base globe styling & bright day illumination across India
        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#142538');
        viewer.scene.globe.showGroundAtmosphere = true;
        viewer.scene.skyAtmosphere.show = true;

        // Immediately position camera squarely on India (60-75% viewport fill)
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 4800000.0),
          orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0.0
          }
        });

        viewerRef.current = viewer;

        // -------------------------------------------------------------
        // 1. LOAD REAL EARTH SATELLITE IMAGERY (with automatic fallback)
        // -------------------------------------------------------------
        try {
          setImageryStatus('loading');
          const esriProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
          );
          if (!isMounted || viewer.isDestroyed()) return;

          const baseImageryLayer = viewer.imageryLayers.addImageryProvider(esriProvider);
          baseImageryLayer.brightness = 1.05;
          baseImageryLayer.contrast = 1.08;
          setImageryStatus('esri-satellite');

          esriProvider.errorEvent.addEventListener(() => {
            console.warn('ArcGIS Imagery tile error, switching to CartoDB/OSM fallback.');
            if (!viewer.isDestroyed() && viewer.imageryLayers.length <= 1) {
              const osmFallback = new Cesium.UrlTemplateImageryProvider({
                url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
                credit: 'CARTO / OpenStreetMap'
              });
              viewer.imageryLayers.addImageryProvider(osmFallback);
              setImageryStatus('osm-fallback');
            }
          });
        } catch (imgErr) {
          console.warn('Primary satellite imagery failed, loading CartoDB Voyager basemap:', imgErr);
          if (!viewer.isDestroyed()) {
            const fallbackProvider = new Cesium.UrlTemplateImageryProvider({
              url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              credit: 'CARTO / OpenStreetMap'
            });
            viewer.imageryLayers.addImageryProvider(fallbackProvider);
            setImageryStatus('osm-fallback');
          }
        }

        // -------------------------------------------------------------
        // 2. LOAD UNIFIED INDIA NATIONAL BOUNDARY, LoC & 36 STATES/UTs
        // -------------------------------------------------------------
        try {
          // A. Lightweight outer boundary + LoC (29.5 KB)
          const boundaryJson = await loadIndiaBoundaries();
          if (!isMounted || viewer.isDestroyed()) return;

          const outerSource = await Cesium.GeoJsonDataSource.load(boundaryJson, {
            stroke: Cesium.Color.fromCssColorString('#FFF3F0').withAlpha(0.95),
            fill: Cesium.Color.TRANSPARENT,
            strokeWidth: 2.2
          });
          outerSource.entities.values.forEach(ent => {
            const bType = ent.properties?.boundary_type?.getValue();
            if (bType === 'line_of_control' && ent.polyline) {
              ent.polyline.width = 2.0;
              ent.polyline.material = new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString('#f59e0b').withAlpha(0.9),
                dashLength: 12.0
              });
            }
          });
          viewer.dataSources.add(outerSource);

          // B. 36 States & UTs including full J&K + Ladakh (153.1 KB)
          const statesJson = await loadIndiaStates();
          if (!isMounted || viewer.isDestroyed()) return;

          const dataSource = await Cesium.GeoJsonDataSource.load(statesJson, {
            stroke: Cesium.Color.fromCssColorString('#7dd3fc').withAlpha(0.65),
            fill: Cesium.Color.fromCssColorString('#A51F52').withAlpha(0.05),
            strokeWidth: 1.2,
            clampToGround: false
          });

          if (!isMounted || viewer.isDestroyed()) return;

          const entities = dataSource.entities.values;
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const stateName = entity.properties?.NAME_1?.getValue();

            if (entity.polygon) {
              entity.polygon.outlineColor = Cesium.Color.fromCssColorString('#7dd3fc').withAlpha(0.6);
              entity.polygon.outlineWidth = 1.2;
              entity.polygon.material = Cesium.Color.fromCssColorString('#A51F52').withAlpha(0.04);

              if (stateName && entity.polygon.hierarchy) {
                const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
                if (hierarchy && hierarchy.positions && hierarchy.positions.length > 0) {
                  const center = Cesium.BoundingSphere.fromPoints(hierarchy.positions).center;
                  entity.position = center;
                  entity.label = {
                    text: stateName.toUpperCase(),
                    font: '600 10px DM Sans, sans-serif',
                    fillColor: Cesium.Color.fromCssColorString('#FFF3F0').withAlpha(0.88),
                    outlineColor: Cesium.Color.fromCssColorString('#142538'),
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2800000.0),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                  };
                }
              }
            }
          }

          viewer.dataSources.add(dataSource);
          geoJsonSourceRef.current = dataSource;
          setBoundaryLoaded(true);
          viewer.scene.requestRender();
        } catch (geoErr) {
          console.error('Failed to load India GeoJSON boundaries:', geoErr);
        }

        // -------------------------------------------------------------
        // 3. INTERACTIVE PICKING FOR STORMS & CYCLONES
        // -------------------------------------------------------------
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id;
            if (entity._stormData && onSelectStorm) {
              onSelectStorm(entity._stormData);
            } else if (entity._cycloneData && onSelectCyclone) {
              onSelectCyclone(entity._cycloneData);
            } else if (entity._districtData && onSelectDistrict) {
              onSelectDistrict(entity._districtData);
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      } catch (err) {
        console.error('Cesium 3D initialization error:', err);
        setImageryStatus('error');
        setViewMode('2d');
      }
    };

    initCesium();

    return () => {
      isMounted = false;
      if (viewer && !viewer.isDestroyed()) {
        try { viewer.destroy(); } catch (e) {}
      }
      viewerRef.current = null;
      geoJsonSourceRef.current = null;
    };
  }, [viewMode]);

  // Toggle GeoJSON Boundary Visibility
  useEffect(() => {
    if (geoJsonSourceRef.current) {
      geoJsonSourceRef.current.show = showBoundaries;
    }
  }, [showBoundaries, boundaryLoaded]);

  // Synchronize Meteorological Entities & City Markers on the 3D Globe
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || viewMode !== '3d' || viewer.isDestroyed()) return;

    const Cesium = window.Cesium;
    viewer.entities.removeAll();

    // -------------------------------------------------------------
    // A. MAJOR INDIAN CITIES (Geographic Context)
    // -------------------------------------------------------------
    if (showCities) {
      INDIA_CITIES.forEach(city => {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 5000),
          point: {
            pixelSize: city.tier === 1 ? 6 : 4,
            color: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#28191D'),
            outlineWidth: 1.5,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: city.name,
            font: city.tier === 1 ? '600 11px DM Sans, sans-serif' : '500 10px DM Sans, sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#0f172a'),
            outlineWidth: 2.5,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(8, -4),
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            distanceDisplayCondition: city.tier === 1
              ? new Cesium.DistanceDisplayCondition(0.0, 6500000.0)
              : new Cesium.DistanceDisplayCondition(0.0, 3200000.0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
      });
    }

    // -------------------------------------------------------------
    // B. TROPICAL CYCLONE TRACK & CORRIDOR
    // -------------------------------------------------------------
    if (showCyclone && activeCyclone) {
      const cur = activeCyclone.current_position;
      const hist = activeCyclone.historical_track || [];
      const fcast = activeCyclone.forecast_track || [];

      // 3D Cyclone Eye Cylinder
      const eyeEntity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(cur.lon, cur.lat, 25000),
        cylinder: {
          length: 50000.0,
          topRadius: 42000.0,
          bottomRadius: 22000.0,
          material: Cesium.Color.fromCssColorString('#A51F52').withAlpha(0.78),
          outline: true,
          outlineColor: Cesium.Color.WHITE
        }
      });
      eyeEntity._cycloneData = activeCyclone;

      // Cyclone Main Label
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(cur.lon, cur.lat, 65000),
        label: {
          text: `CYCLONE ${activeCyclone.name} (${cur.classification?.code || 'VSCS'})\n${cur.max_wind_kmh} km/h • ${cur.central_pressure_hpa} hPa`,
          font: 'bold 11px DM Sans, sans-serif',
          fillColor: Cesium.Color.WHITE,
          backgroundColor: Cesium.Color.fromCssColorString('#A51F52').withAlpha(0.92),
          showBackground: true,
          backgroundPadding: new Cesium.Cartesian2(7, 5),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -18),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });

      // Historical Track
      if (hist.length > 0) {
        const histCoords = hist.map(pt => [pt.lon, pt.lat, 12000]).flat();
        histCoords.push(cur.lon, cur.lat, 12000);
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(histCoords),
            width: 3.5,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.fromCssColorString('#FFF3F0').withAlpha(0.85)
            })
          }
        });
      }

      // Forecast Track & Uncertainty Circles
      if (fcast.length > 0) {
        const fcastCoords = [cur.lon, cur.lat, 16000];
        fcast.forEach(pt => fcastCoords.push(pt.lon, pt.lat, 16000));
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(fcastCoords),
            width: 4.5,
            material: Cesium.Color.fromCssColorString('#A51F52')
          }
        });

        fcast.forEach(pt => {
          // Uncertainty radius ellipse on ground
          if (pt.uncertainty_radius_km) {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, 2000),
              ellipse: {
                semiMinorAxis: pt.uncertainty_radius_km * 1000.0,
                semiMajorAxis: pt.uncertainty_radius_km * 1000.0,
                material: Cesium.Color.fromCssColorString('#F4E3E6').withAlpha(0.22),
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString('#A51F52').withAlpha(0.55)
              }
            });
          }

          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, 16000),
            point: {
              pixelSize: 7,
              color: Cesium.Color.fromCssColorString('#FFF3F0'),
              outlineColor: Cesium.Color.fromCssColorString('#A51F52'),
              outlineWidth: 2,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
              text: `+${pt.forecast_lead_h}h`,
              font: 'bold 10px JetBrains Mono, monospace',
              fillColor: Cesium.Color.WHITE,
              showBackground: true,
              backgroundColor: Cesium.Color.fromCssColorString('#28191D').withAlpha(0.82),
              pixelOffset: new Cesium.Cartesian2(12, 0),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 3500000.0),
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          });
        });
      }
    }

    // -------------------------------------------------------------
    // C. THUNDERSTORM CELLS (Validated Indian Coordinates)
    // -------------------------------------------------------------
    if (showStorms) {
      storms.forEach((storm) => {
        const isSelected = selectedStorm && selectedStorm.id === storm.id;
        const colorHex = storm.intensity_dbz >= 50 ? '#A51F52' : storm.intensity_dbz >= 42 ? '#d97706' : '#2563eb';
        const heightMeters = Math.max(18000, (storm.intensity_dbz / 65.0) * 42000.0);

        const stormEntity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(storm.lon, storm.lat, heightMeters / 2.0),
          cylinder: {
            length: heightMeters,
            topRadius: 18000.0,
            bottomRadius: 28000.0,
            material: Cesium.Color.fromCssColorString(colorHex).withAlpha(isSelected ? 0.88 : 0.68),
            outline: true,
            outlineColor: isSelected ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString(colorHex)
          }
        });
        stormEntity._stormData = storm;

        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(storm.lon, storm.lat, heightMeters + 10000),
          label: {
            text: `${storm.id} • ${storm.intensity_dbz} dBZ`,
            font: 'bold 10px JetBrains Mono, monospace',
            fillColor: Cesium.Color.WHITE,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString(colorHex).withAlpha(0.88),
            backgroundPadding: new Cesium.Cartesian2(5, 3),
            pixelOffset: new Cesium.Cartesian2(0, -10),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });

        // Storm Trajectory Line if available
        if (storm.trajectory && storm.trajectory.length > 1) {
          const trajCoords = storm.trajectory.map(t => [t.lon, t.lat, 8000]).flat();
          viewer.entities.add({
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(trajCoords),
              width: 2.5,
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString('#fbbf24')
              }),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2600000.0)
            }
          });
        }
      });
    }

    // -------------------------------------------------------------
    // D. LIGHTNING FLASH OBSERVATIONS
    // -------------------------------------------------------------
    if (showLightning && lightningEvents.length > 0) {
      lightningEvents.forEach(evt => {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(evt.lon, evt.lat, 4000),
          point: {
            pixelSize: 5,
            color: Cesium.Color.GOLD.withAlpha(0.9),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
      });
    }

    // -------------------------------------------------------------
    // E. EMERGENCY SHELTER LOCATIONS
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
          position: Cesium.Cartesian3.fromDegrees(sh.lon, sh.lat, 4000),
          point: {
            pixelSize: 7,
            color: Cesium.Color.fromCssColorString('#D3E4B7'),
            outlineColor: Cesium.Color.fromCssColorString('#28191D'),
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: sh.name,
            font: '600 10px DM Sans, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#D3E4B7'),
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(10, 0),
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1400000.0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
      });
    }

    // -------------------------------------------------------------
    // F. ANDHRA PRADESH GNN DISTRICT GRAPH & RIVER-BASIN EDGES
    // -------------------------------------------------------------
    if (gnnData?.district_predictions) {
      const distMap = {};
      gnnData.district_predictions.forEach(d => { distMap[d.id] = d; });

      // River-basin edges in glowing cyan
      (gnnData.edges || []).forEach(edge => {
        const src = distMap[edge.source];
        const dst = distMap[edge.target];
        if (!src || !dst) return;
        const isRiver = edge.edge_type === 'river_downstream';
        if (!isRiver && regionMode !== 'andhra_pradesh') return;

        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              src.lon, src.lat, 5000,
              dst.lon, dst.lat, 5000
            ]),
            width: isRiver ? 2.5 : 1.0,
            material: isRiver
              ? Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.75)
              : Cesium.Color.fromCssColorString('#FFF3F0').withAlpha(0.22),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2200000.0)
          }
        });
      });

      // District Nodes colored by GNN Hazard Tier
      gnnData.district_predictions.forEach(d => {
        const tierColor =
          d.risk_tier === 'CRITICAL' ? '#A51F52' :
          d.risk_tier === 'HIGH' ? '#d97706' :
          d.risk_tier === 'MODERATE' ? '#38bdf8' : '#D3E4B7';

        const nodeEntity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(d.lon, d.lat, 6000),
          point: {
            pixelSize: regionMode === 'andhra_pradesh' ? 11 : 6,
            color: Cesium.Color.fromCssColorString(tierColor),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: `${d.name} (${d.gnn_hazard_score})`,
            font: 'bold 10px DM Sans, sans-serif',
            fillColor: Cesium.Color.WHITE,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString('#141f30').withAlpha(0.82),
            backgroundPadding: new Cesium.Cartesian2(4, 2),
            pixelOffset: new Cesium.Cartesian2(0, -14),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1600000.0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
        nodeEntity._districtData = d;
      });
    }

    viewer.scene.requestRender();

  }, [storms, cyclones, lightningEvents, gnnData, regionMode, selectedStorm, showCyclone, showStorms, showLightning, showShelters, showCities, viewMode]);

  // Progressive District Loading & Smooth Camera FlyTo when switching All India <-> Andhra Pradesh Pilot
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || viewer.isDestroyed() || viewMode !== '3d') return;
    const Cesium = window.Cesium;

    if (regionMode === 'andhra_pradesh') {
      loadIndiaDistricts().then(async (distJson) => {
        if (viewer.isDestroyed()) return;
        const hasDist = viewer.dataSources._dataSources.some(ds => ds.name === 'ap-districts');
        if (!hasDist) {
          const distSource = await Cesium.GeoJsonDataSource.load(distJson, {
            stroke: Cesium.Color.fromCssColorString('#fbbf24').withAlpha(0.75),
            fill: Cesium.Color.fromCssColorString('#fbbf24').withAlpha(0.04),
            strokeWidth: 1.2
          });
          distSource.name = 'ap-districts';
          viewer.dataSources.add(distSource);
          viewer.scene.requestRender();
        }
      }).catch(() => {});

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(80.65, 16.35, 920000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-72.0),
          roll: 0.0
        },
        duration: 1.5
      });
    } else {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 4800000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
          roll: 0.0
        },
        duration: 1.5
      });
    }
    viewer.scene.requestRender();
  }, [regionMode, viewMode]);

  // Camera Zoom Presets
  const flyToPreset = (preset) => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || viewer.isDestroyed()) return;
    const Cesium = window.Cesium;
    setZoomPreset(preset);

    if (preset === 'overview') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 4800000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
          roll: 0.0
        },
        duration: 1.5
      });
    } else if (preset === 'regional') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(86.2, 20.8, 1750000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-78.0),
          roll: 0.0
        },
        duration: 1.6
      });
    } else if (preset === 'local') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(88.25, 21.8, 580000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-65.0),
          roll: 0.0
        },
        duration: 1.7
      });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#EBDCD8] shadow-md bg-[#0f1d2e]">
      {/* Top-Left Controls: 3D/2D Mode & Zoom Level Presets */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
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
            2D Radar
          </button>
        </div>

        {/* 3 Geographic Zoom Presets + Reset */}
        {viewMode === '3d' && (
          <div className="glass-panel-dark rounded-full p-1 flex items-center space-x-1 shadow-lg">
            <button
              onClick={() => flyToPreset('overview')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center space-x-1 transition ${
                zoomPreset === 'overview' ? 'bg-white text-[#28191D]' : 'text-white/80 hover:text-white'
              }`}
              title="Reset to India Subcontinent Overview"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to India</span>
            </button>
            <button
              onClick={() => flyToPreset('regional')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                zoomPreset === 'regional' ? 'bg-white text-[#28191D]' : 'text-white/80 hover:text-white'
              }`}
              title="Zoom to East Coast & State Boundaries"
            >
              Regional View
            </button>
            <button
              onClick={() => flyToPreset('local')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                zoomPreset === 'local' ? 'bg-white text-[#28191D]' : 'text-white/80 hover:text-white'
              }`}
              title="Zoom to Local Storm Cells & Shelters"
            >
              Local View
            </button>
          </div>
        )}
      </div>

      {/* Top-Right Controls: Layer Visibility Toggles */}
      {viewMode === '3d' && (
        <div className="absolute top-4 right-4 z-20 glass-panel-dark rounded-2xl p-2 shadow-xl hidden lg:flex items-center space-x-1.5 text-[11px] text-white">
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
              showBoundaries ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <MapIcon className="w-3 h-3" />
            <span>India Borders</span>
          </button>

          <button
            onClick={() => setShowCities(!showCities)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
              showCities ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Cities</span>
          </button>

          <button
            onClick={() => setShowCyclone(!showCyclone)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
              showCyclone ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Cyclone</span>
          </button>

          <button
            onClick={() => setShowStorms(!showStorms)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
              showStorms ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            <span>Storms</span>
          </button>

          <button
            onClick={() => setShowLightning(!showLightning)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
              showLightning ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Lightning</span>
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl transition ${
              showShelters ? 'bg-[#A51F52] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-[#D3E4B7]" />
            <span>Shelters</span>
          </button>
        </div>
      )}

      {/* 3D Earth Globe Canvas View */}
      {viewMode === '3d' && (
        <div className="w-full h-[580px] sm:h-[680px] relative">
          <div ref={containerRef} className="w-full h-full" id="cesium-container" />

          {/* Bottom-Left Imagery & GeoJSON Status Pill */}
          <div className="absolute bottom-4 left-4 z-20 glass-panel-dark rounded-2xl p-3 text-xs text-white space-y-1">
            <div className="flex items-center space-x-2 font-bold font-headline lowercase">
              <span className={`w-2 h-2 rounded-full ${
                imageryStatus === 'esri-satellite' || imageryStatus === 'osm-fallback'
                  ? 'bg-[#22c55e]'
                  : imageryStatus === 'loading'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-red-500'
              }`}></span>
              <span>
                {imageryStatus === 'esri-satellite' && 'esri world satellite imagery active.'}
                {imageryStatus === 'osm-fallback' && 'openstreetmap basemap active.'}
                {imageryStatus === 'loading' && 'loading earth satellite imagery...'}
                {imageryStatus === 'error' && 'imagery error — switch to 2d radar.'}
              </span>
            </div>
            <div className="text-[10px] text-white/75 font-mono flex items-center space-x-2">
              <span>India GeoJSON: {boundaryLoaded ? '36 States/UTs (incl. J&K & Ladakh)' : 'Loading...'}</span>
              <span>•</span>
              <span>WGS84 3D Ellipsoid</span>
            </div>
          </div>

          {/* Bottom-Right Cartographic & Atmospheric Legend */}
          <div className="absolute bottom-4 right-4 z-20 glass-panel-dark rounded-2xl p-3 text-xs text-white hidden sm:block space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 block">
              Cartographic &amp; Atmospheric Legend
            </span>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-3.5 h-0.5 bg-[#FFF3F0] inline-block"></span>
                <span>Claimed Intl. Boundary</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3.5 h-0.5 border-b-2 border-dashed border-[#f59e0b] inline-block"></span>
                <span>Line of Control (LoC)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A51F52]"></span>
                <span>Cyclone / Core</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Lightning</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D3E4B7]"></span>
                <span>Shelter</span>
              </span>
            </div>
            <div className="text-[9px] text-white/60 font-sans">
              Source: Survey of India / Census-aligned composite GeoJSON • Dashed LoC denotes administrative line.
            </div>
          </div>
        </div>
      )}

      {/* 2D Precision Radar View Fallback */}
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
