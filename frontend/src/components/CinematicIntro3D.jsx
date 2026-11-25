import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { loadIndiaBoundaries, loadIndiaStates } from '../data/geography/geoLoader';

const EARTH_RADIUS = 2.0;

function latLonToVec3(lat, lon, radius = EARTH_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

const INDIA_HUBS = [
  { name: 'New Delhi', lat: 28.61, lon: 77.21 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88 },
  { name: 'Kolkata', lat: 22.57, lon: 88.36 },
  { name: 'Chennai', lat: 13.08, lon: 80.27 },
  { name: 'Visakhapatnam', lat: 17.69, lon: 83.22 },
  { name: 'Konaseema', lat: 16.58, lon: 82.01 },
  { name: 'Hyderabad', lat: 17.39, lon: 78.49 },
  { name: 'Bengaluru', lat: 12.97, lon: 77.59 }
];

const NETWORK_LINKS = [
  [0, 6], [6, 4], [4, 5], [5, 3], [6, 1], [6, 7], [7, 3], [4, 2], [0, 2]
];

export default function CinematicIntro3D({ onComplete }) {
  const mountRef = useRef(null);
  const [sceneIndex, setSceneIndex] = useState(1);
  const [sceneLabel, setSceneLabel] = useState('The Earth Awakens');
  const [showBrand, setShowBrand] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete?.();
    }, 450);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || !isWebGLAvailable()) {
      setFallbackMode(true);
      setShowBrand(true);
      const t = setTimeout(handleFinish, 1800);
      return () => clearTimeout(t);
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.copy(latLonToVec3(12.0, 42.0, 6.4));
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const disposables = [];
    const register = (obj) => {
      disposables.push(obj);
      return obj;
    };

    // Lightweight Starfield (600 stars)
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 16 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = register(new THREE.BufferGeometry());
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = register(new THREE.PointsMaterial({ color: 0xcbe4ff, size: 0.045, transparent: true, opacity: 0.0 }));
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Earth Sphere (48x48 segments for fast GPU rasterization)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthGeo = register(new THREE.SphereGeometry(EARTH_RADIUS, 48, 48));
    const earthMat = register(new THREE.ShaderMaterial({
      uniforms: { uReveal: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uReveal;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
          vec3 deepOcean = vec3(0.015, 0.045, 0.11);
          vec3 twilightBlue = vec3(0.04, 0.14, 0.28);
          vec3 rimCyan = vec3(0.22, 0.74, 0.97);
          vec3 sunDir = normalize(vec3(0.7, 0.4, 0.6));
          float diff = max(dot(vNormal, sunDir), 0.0);
          vec3 color = mix(deepOcean, twilightBlue, diff * 0.85) + rimCyan * fresnel * 0.65;
          gl_FragColor = vec4(color * uReveal, 1.0);
        }
      `
    }));
    earthGroup.add(new THREE.Mesh(earthGeo, earthMat));

    // Atmospheric Rim Halo
    const atmoGeo = register(new THREE.SphereGeometry(EARTH_RADIUS * 1.06, 48, 48));
    const atmoMat = register(new THREE.ShaderMaterial({
      uniforms: { uReveal: { value: 0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uReveal;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(0.68 - dot(vNormal, viewDir), 3.2);
          gl_FragColor = vec4(0.20, 0.68, 0.98, 1.0) * max(intensity, 0.0) * 0.85 * uReveal;
        }
      `
    }));
    earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

    // Unified GeoJSON Layers (Shared Cache: Full J&K + Ladakh + LoC)
    const indiaGroup = new THREE.Group();
    earthGroup.add(indiaGroup);

    const outerBoundMat = register(new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 }));
    const locDashedMat = register(new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.03, gapSize: 0.02, transparent: true, opacity: 0.0 }));
    const stateLineMat = register(new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.0 }));
    const apLineMat = register(new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.0 }));

    // Helper to add GeoJSON lines
    const addGeoJsonLines = (geojson, mat, rad, dashed = false) => {
      if (!geojson?.features) return;
      geojson.features.forEach(feat => {
        const geom = feat.geometry;
        if (!geom) return;
        const lines = [];
        if (geom.type === 'Polygon') {
          geom.coordinates.forEach(r => lines.push(r));
        } else if (geom.type === 'MultiPolygon') {
          geom.coordinates.forEach(p => p.forEach(r => lines.push(r)));
        } else if (geom.type === 'LineString') {
          lines.push(geom.coordinates);
        } else if (geom.type === 'MultiLineString') {
          geom.coordinates.forEach(l => lines.push(l));
        }
        lines.forEach(ring => {
          if (ring.length < 2) return;
          const pts = ring.map(([lon, lat]) => latLonToVec3(lat, lon, rad));
          const g = register(new THREE.BufferGeometry().setFromPoints(pts));
          const line = new THREE.Line(g, mat);
          if (dashed) line.computeLineDistances();
          indiaGroup.add(line);
        });
      });
    };

    // Progressive Load: 29 KB outer boundary + LoC first, then 153 KB states
    loadIndiaBoundaries().then(gj => {
      const claimed = { type: 'FeatureCollection', features: gj.features.filter(f => f.properties.boundary_type === 'international_claimed') };
      const loc = { type: 'FeatureCollection', features: gj.features.filter(f => f.properties.boundary_type === 'line_of_control') };
      addGeoJsonLines(claimed, outerBoundMat, EARTH_RADIUS * 1.006, false);
      addGeoJsonLines(loc, locDashedMat, EARTH_RADIUS * 1.007, true);
    }).catch(() => {});

    loadIndiaStates().then(gj => {
      const others = { type: 'FeatureCollection', features: gj.features.filter(f => f.properties.NAME_1 !== 'Andhra Pradesh') };
      const ap = { type: 'FeatureCollection', features: gj.features.filter(f => f.properties.NAME_1 === 'Andhra Pradesh') };
      addGeoJsonLines(others, stateLineMat, EARTH_RADIUS * 1.004, false);
      addGeoJsonLines(ap, apLineMat, EARTH_RADIUS * 1.008, false);
    }).catch(() => {});

    // Bay of Bengal Cyclone Particles (320 optimized particles)
    const cycloneCenter = latLonToVec3(17.2, 86.2, EARTH_RADIUS * 1.015);
    const cycloneGroup = new THREE.Group();
    cycloneGroup.position.copy(cycloneCenter);
    cycloneGroup.lookAt(cycloneCenter.clone().multiplyScalar(2));
    earthGroup.add(cycloneGroup);

    const cycCount = 320;
    const cycPos = new Float32Array(cycCount * 3);
    const cycColors = new Float32Array(cycCount * 3);
    for (let i = 0; i < cycCount; i++) {
      const arm = i % 3;
      const t = i / cycCount;
      const radius = 0.018 + t * 0.145;
      const angle = arm * ((Math.PI * 2) / 3) + t * 7.5 + (Math.random() - 0.5) * 0.4;
      cycPos[i * 3] = Math.cos(angle) * radius;
      cycPos[i * 3 + 1] = Math.sin(angle) * radius;
      cycPos[i * 3 + 2] = (1 - t) * 0.01;
      const c = t < 0.25 ? new THREE.Color(0xfbbf24) : new THREE.Color(0xe0f2fe);
      cycColors[i * 3] = c.r; cycColors[i * 3 + 1] = c.g; cycColors[i * 3 + 2] = c.b;
    }
    const cycGeo = register(new THREE.BufferGeometry());
    cycGeo.setAttribute('position', new THREE.BufferAttribute(cycPos, 3));
    cycGeo.setAttribute('color', new THREE.BufferAttribute(cycColors, 3));
    const cycMat = register(new THREE.PointsMaterial({ size: 0.016, vertexColors: true, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }));
    const cycloneParticles = new THREE.Points(cycGeo, cycMat);
    cycloneGroup.add(cycloneParticles);

    // Lightning Flashes
    const lightningLights = [[16.58, 82.01], [17.69, 83.22], [16.19, 81.14], [22.57, 88.36]].map(([lat, lon]) => {
      const lGeo = register(new THREE.SphereGeometry(0.015, 8, 8));
      const lMat = register(new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.0 }));
      const m = new THREE.Mesh(lGeo, lMat);
      m.position.copy(latLonToVec3(lat, lon, EARTH_RADIUS * 1.018));
      earthGroup.add(m);
      return lMat;
    });

    // Atmospheric Intelligence Network Arcs
    const networkGroup = new THREE.Group();
    earthGroup.add(networkGroup);
    const arcMat = register(new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 }));
    const hubMat = register(new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.0 }));

    INDIA_HUBS.forEach(h => {
      const m = new THREE.Mesh(register(new THREE.SphereGeometry(0.013, 8, 8)), hubMat);
      m.position.copy(latLonToVec3(h.lat, h.lon, EARTH_RADIUS * 1.01));
      networkGroup.add(m);
    });
    NETWORK_LINKS.forEach(([i, j]) => {
      const p1 = latLonToVec3(INDIA_HUBS[i].lat, INDIA_HUBS[i].lon, EARTH_RADIUS * 1.01);
      const p2 = latLonToVec3(INDIA_HUBS[j].lat, INDIA_HUBS[j].lon, EARTH_RADIUS * 1.01);
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(EARTH_RADIUS * 1.08);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      networkGroup.add(new THREE.Line(register(new THREE.BufferGeometry().setFromPoints(curve.getPoints(20))), arcMat));
    });

    // Fast, Punchy 10.5-Second GSAP Timeline
    const indiaTargetCam = latLonToVec3(22.5, 80.5, 3.85);
    const bayTargetCam = latLonToVec3(18.5, 83.2, 3.25);

    const tl = gsap.timeline({
      onComplete: () => setTimeout(handleFinish, 700)
    });

    tl.to(earthMat.uniforms.uReveal, { value: 1.0, duration: 1.4, ease: 'power2.out' }, 0)
      .to(atmoMat.uniforms.uReveal, { value: 1.0, duration: 1.5, ease: 'power2.out' }, 0)
      .to(starMat, { opacity: 0.8, duration: 1.5 }, 0.1)
      .call(() => { setSceneIndex(2); setSceneLabel('India & Northern Territories Reveal'); }, null, 1.8)
      .to(camera.position, {
        x: indiaTargetCam.x, y: indiaTargetCam.y, z: indiaTargetCam.z,
        duration: 2.2, ease: 'power3.inOut', onUpdate: () => camera.lookAt(0, 0, 0)
      }, 1.8)
      .to([outerBoundMat, stateLineMat], { opacity: 0.8, duration: 1.2 }, 2.2)
      .to(locDashedMat, { opacity: 0.85, duration: 1.2 }, 2.4)
      .to(apLineMat, { opacity: 0.95, duration: 1.2 }, 2.6)
      .call(() => { setSceneIndex(3); setSceneLabel('Bay of Bengal Cyclone Formation'); }, null, 4.0)
      .to(camera.position, {
        x: bayTargetCam.x, y: bayTargetCam.y, z: bayTargetCam.z,
        duration: 2.0, ease: 'power2.inOut', onUpdate: () => camera.lookAt(0, 0, 0)
      }, 4.0)
      .to(cycMat, { opacity: 0.9, duration: 1.0 }, 4.1)
      .call(() => { setSceneIndex(4); setSceneLabel('Convective Lightning & Network'); }, null, 6.2)
      .to([arcMat, hubMat], { opacity: 0.85, duration: 1.0 }, 6.4)
      .call(() => {
        setSceneIndex(6);
        setSceneLabel('ATLAS-Q Online');
        setShowBrand(true);
      }, null, 8.6);

    let rafId;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      stars.rotation.y = elapsed * 0.008;
      cycloneParticles.rotation.z = elapsed * 1.5;

      if (elapsed >= 6.0 && elapsed <= 9.0) {
        lightningLights.forEach((mat, idx) => {
          mat.opacity = Math.sin(elapsed * (9.5 + idx * 2.1)) > 0.9 ? 0.95 : 0.0;
        });
      } else {
        lightningLights.forEach(mat => { mat.opacity = 0.0; });
      }
      renderer.render(scene, camera);
    };
    animate();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      tl.kill();
      window.removeEventListener('resize', handleResize);
      disposables.forEach(obj => obj.dispose && obj.dispose());
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#030712] text-white overflow-hidden transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {!fallbackMode && <div ref={mountRef} className="w-full h-full" />}

      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        <div className="px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-wider text-sky-200 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>0{sceneIndex} / 06</span>
          <span className="text-white/40">•</span>
          <span className="text-white/90">{sceneLabel}</span>
        </div>

        <button
          onClick={handleFinish}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-white transition flex items-center space-x-1.5"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {showBrand && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#030712]/55 backdrop-blur-[3px] px-6">
          <div className="max-w-2xl w-full text-center space-y-5 p-8 sm:p-12 rounded-[2rem] bg-slate-900/60 backdrop-blur-xl border border-white/15 shadow-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Atmospheric Intelligence</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white font-headline">ATLAS-Q</h1>
            <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-amber-300/95 font-semibold">
              ATMOSPHERIC INTELLIGENCE &amp; PREDICTIVE DISASTER SIMULATION SYSTEM
            </p>
            <p className="text-base sm:text-lg text-slate-200 font-sans tracking-wide pt-1">
              Predict the Threat. Simulate the Impact. Optimize the Response.
            </p>
            <div className="pt-3">
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-full bg-[#A51F52] hover:bg-[#8e1945] text-white text-xs font-bold uppercase tracking-wider transition shadow-lg inline-flex items-center space-x-2"
              >
                <span>Enter Earth Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
