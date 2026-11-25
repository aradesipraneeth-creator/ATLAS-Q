import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

const EARTH_RADIUS = 2.0;

/**
 * Converts geographic (lat, lon) in degrees to 3D Cartesian coordinates on a sphere.
 */
function latLonToVec3(lat, lon, radius = EARTH_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Checks WebGL support before initializing 3D renderer.
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

// Hub coordinates for Scene 5 Atmospheric Intelligence Network
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
    }, 650);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || !isWebGLAvailable()) {
      setFallbackMode(true);
      setShowBrand(true);
      const t = setTimeout(handleFinish, 2400);
      return () => clearTimeout(t);
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    // Start far out looking toward Earth's sunlit rim
    const startLook = latLonToVec3(18.0, 55.0, 0);
    const startCam = latLonToVec3(12.0, 38.0, 6.8);
    camera.position.copy(startCam);
    camera.lookAt(startLook);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Track disposable GPU resources
    const disposables = [];
    const register = (obj) => {
      disposables.push(obj);
      return obj;
    };

    // 2. Subtle Deep-Space Starfield (1,800 particles)
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = register(new THREE.BufferGeometry());
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = register(new THREE.PointsMaterial({
      color: 0xcbe4ff,
      size: 0.045,
      transparent: true,
      opacity: 0.0
    }));
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 3. Earth Sphere with Custom Atmospheric Ocean/Surface GLSL Shader
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthGeo = register(new THREE.SphereGeometry(EARTH_RADIUS, 64, 64));
    const earthMat = register(new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 }
      },
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
        uniform float uTime;
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
          vec3 base = mix(deepOcean, twilightBlue, diff * 0.85);
          vec3 color = base + rimCyan * fresnel * 0.65;
          gl_FragColor = vec4(color * uReveal, 1.0);
        }
      `
    }));
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 4. Atmospheric Outer Rim Halo (Additive Fresnel Shader)
    const atmoGeo = register(new THREE.SphereGeometry(EARTH_RADIUS * 1.06, 64, 64));
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

    // Subtle Graticule Latitude/Longitude Rings
    const gridMat = register(new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.16 }));
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = [];
      for (let lon = -180; lon <= 180; lon += 6) {
        pts.push(latLonToVec3(lat, lon, EARTH_RADIUS * 1.002));
      }
      const g = register(new THREE.BufferGeometry().setFromPoints(pts));
      earthGroup.add(new THREE.Line(g, gridMat));
    }

    // 5. Real India National & 35-State GeoJSON Boundaries
    const indiaGroup = new THREE.Group();
    earthGroup.add(indiaGroup);

    const indiaLineMat = register(new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0
    }));
    const apLineMat = register(new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.0
    }));

    fetch('/data/india_states.geojson')
      .then(r => r.json())
      .then(geojson => {
        if (!geojson?.features) return;
        geojson.features.forEach(feat => {
          const isAP = feat.properties?.NAME_1?.toLowerCase().includes('andhra pradesh');
          const mat = isAP ? apLineMat : indiaLineMat;
          const rad = isAP ? EARTH_RADIUS * 1.006 : EARTH_RADIUS * 1.004;
          const geom = feat.geometry;
          const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
          polys.forEach(poly => {
            poly.forEach(ring => {
              if (ring.length < 3) return;
              const pts = ring.map(([lon, lat]) => latLonToVec3(lat, lon, rad));
              const lineGeo = register(new THREE.BufferGeometry().setFromPoints(pts));
              indiaGroup.add(new THREE.Line(lineGeo, mat));
            });
          });
        });
      })
      .catch(() => {});

    // 6. Scene 3: Swirling Cyclone over Bay of Bengal (17.2°N, 86.2°E)
    const cycloneCenter = latLonToVec3(17.2, 86.2, EARTH_RADIUS * 1.015);
    const cycloneGroup = new THREE.Group();
    cycloneGroup.position.copy(cycloneCenter);
    cycloneGroup.lookAt(cycloneCenter.clone().multiplyScalar(2));
    earthGroup.add(cycloneGroup);

    const cycCount = 650;
    const cycPos = new Float32Array(cycCount * 3);
    const cycColors = new Float32Array(cycCount * 3);
    for (let i = 0; i < cycCount; i++) {
      const arm = i % 3;
      const t = (i / cycCount);
      const radius = 0.018 + t * 0.145;
      const angle = arm * ((Math.PI * 2) / 3) + t * 7.5 + (Math.random() - 0.5) * 0.45;
      cycPos[i * 3] = Math.cos(angle) * radius;
      cycPos[i * 3 + 1] = Math.sin(angle) * radius;
      cycPos[i * 3 + 2] = (Math.random() - 0.5) * 0.015 + (1 - t) * 0.01;

      const c = t < 0.25 ? new THREE.Color(0xfbbf24) : new THREE.Color(0xe0f2fe);
      cycColors[i * 3] = c.r;
      cycColors[i * 3 + 1] = c.g;
      cycColors[i * 3 + 2] = c.b;
    }
    const cycGeo = register(new THREE.BufferGeometry());
    cycGeo.setAttribute('position', new THREE.BufferAttribute(cycPos, 3));
    cycGeo.setAttribute('color', new THREE.BufferAttribute(cycColors, 3));
    const cycMat = register(new THREE.PointsMaterial({
      size: 0.014,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    }));
    const cycloneParticles = new THREE.Points(cycGeo, cycMat);
    cycloneGroup.add(cycloneParticles);

    // Pressure Contour Rings around Cyclone Eye
    const contourRings = [];
    for (let rIdx = 1; rIdx <= 3; rIdx++) {
      const ringPts = [];
      const rad = 0.045 * rIdx;
      for (let a = 0; a <= 48; a++) {
        const ang = (a / 48) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(ang) * rad, Math.sin(ang) * rad, 0.004));
      }
      const rGeo = register(new THREE.BufferGeometry().setFromPoints(ringPts));
      const rMat = register(new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 }));
      const rLine = new THREE.Line(rGeo, rMat);
      cycloneGroup.add(rLine);
      contourRings.push(rMat);
    }

    // 7. Scene 4: Lightning Flashes & Radar Sweep along AP/Odisha Coast
    const lightningCoords = [
      [16.58, 82.01], // Konaseema
      [17.69, 83.22], // Visakhapatnam
      [16.19, 81.14], // Machilipatnam
      [20.27, 85.84], // Bhubaneswar
      [22.57, 88.36]  // Kolkata
    ];
    const lightningLights = lightningCoords.map(([lat, lon]) => {
      const pos = latLonToVec3(lat, lon, EARTH_RADIUS * 1.018);
      const lGeo = register(new THREE.SphereGeometry(0.014, 12, 12));
      const lMat = register(new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.0
      }));
      const mesh = new THREE.Mesh(lGeo, lMat);
      mesh.position.copy(pos);
      earthGroup.add(mesh);
      return lMat;
    });

    // Radar Sweep Ring centered on Konaseema/Krishna Coast
    const radarCenter = latLonToVec3(16.4, 81.5, EARTH_RADIUS * 1.012);
    const radarGroup = new THREE.Group();
    radarGroup.position.copy(radarCenter);
    radarGroup.lookAt(radarCenter.clone().multiplyScalar(2));
    earthGroup.add(radarGroup);
    const radarRingGeo = register(new THREE.RingGeometry(0.06, 0.068, 48));
    const radarRingMat = register(new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0
    }));
    const radarRing = new THREE.Mesh(radarRingGeo, radarRingMat);
    radarGroup.add(radarRing);

    // 8. Scene 5: Atmospheric Intelligence GNN Network Arcs across India
    const networkGroup = new THREE.Group();
    earthGroup.add(networkGroup);
    const arcMat = register(new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0
    }));
    const hubMat = register(new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.0
    }));

    INDIA_HUBS.forEach(h => {
      const hGeo = register(new THREE.SphereGeometry(0.013, 12, 12));
      const mesh = new THREE.Mesh(hGeo, hubMat);
      mesh.position.copy(latLonToVec3(h.lat, h.lon, EARTH_RADIUS * 1.01));
      networkGroup.add(mesh);
    });

    NETWORK_LINKS.forEach(([i, j]) => {
      const p1 = latLonToVec3(INDIA_HUBS[i].lat, INDIA_HUBS[i].lon, EARTH_RADIUS * 1.01);
      const p2 = latLonToVec3(INDIA_HUBS[j].lat, INDIA_HUBS[j].lon, EARTH_RADIUS * 1.01);
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(EARTH_RADIUS * 1.08);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const arcGeo = register(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)));
      networkGroup.add(new THREE.Line(arcGeo, arcMat));
    });

    // 9. GSAP 16-Second Master Cinematic Timeline
    const indiaTargetCam = latLonToVec3(20.5, 80.5, 3.65);
    const bayTargetCam = latLonToVec3(18.5, 83.2, 3.15);
    const wideIntelCam = latLonToVec3(21.0, 79.5, 3.85);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(handleFinish, 900);
      }
    });

    // SCENE 1 (0-3s): The Earth Awakens
    tl.to(earthMat.uniforms.uReveal, { value: 1.0, duration: 2.2, ease: 'power2.out' }, 0)
      .to(atmoMat.uniforms.uReveal, { value: 1.0, duration: 2.4, ease: 'power2.out' }, 0)
      .to(starMat, { opacity: 0.85, duration: 2.5, ease: 'power1.out' }, 0.2)
      .to(camera.position, {
        x: latLonToVec3(18.0, 68.0, 4.9).x,
        y: latLonToVec3(18.0, 68.0, 4.9).y,
        z: latLonToVec3(18.0, 68.0, 4.9).z,
        duration: 3.0,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0)
      }, 0)

    // SCENE 2 (3-6s): India Reveal
      .call(() => { setSceneIndex(2); setSceneLabel('India Subcontinent Reveal'); }, null, 3.0)
      .to(camera.position, {
        x: indiaTargetCam.x,
        y: indiaTargetCam.y,
        z: indiaTargetCam.z,
        duration: 3.0,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0)
      }, 3.0)
      .to(indiaLineMat, { opacity: 0.72, duration: 1.8, ease: 'power2.out' }, 3.5)
      .to(apLineMat, { opacity: 0.95, duration: 1.8, ease: 'power2.out' }, 4.2)

    // SCENE 3 (6-9s): Cyclone Formation over Bay of Bengal
      .call(() => { setSceneIndex(3); setSceneLabel('Bay of Bengal Cyclone Formation'); }, null, 6.0)
      .to(camera.position, {
        x: bayTargetCam.x,
        y: bayTargetCam.y,
        z: bayTargetCam.z,
        duration: 2.8,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0)
      }, 6.0)
      .to(cycMat, { opacity: 0.92, duration: 1.4, ease: 'power2.out' }, 6.2)
      .to(contourRings, { opacity: 0.55, duration: 1.2, stagger: 0.2 }, 6.6)

    // SCENE 4 (9-11s): Thunderstorm & Lightning
      .call(() => { setSceneIndex(4); setSceneLabel('Convective Lightning & Radar Sweep'); }, null, 9.0)
      .to(radarRingMat, { opacity: 0.75, duration: 0.6 }, 9.0)

    // SCENE 5 (11-14s): Atmospheric Intelligence Network
      .call(() => { setSceneIndex(5); setSceneLabel('ATLAS-Q Spatial Intelligence Graph'); }, null, 11.0)
      .to(camera.position, {
        x: wideIntelCam.x,
        y: wideIntelCam.y,
        z: wideIntelCam.z,
        duration: 2.6,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0)
      }, 11.0)
      .to(arcMat, { opacity: 0.78, duration: 1.4 }, 11.2)
      .to(hubMat, { opacity: 0.95, duration: 1.2 }, 11.2)

    // SCENE 6 (14-16s): Brand Reveal
      .call(() => {
        setSceneIndex(6);
        setSceneLabel('ATLAS-Q Online');
        setShowBrand(true);
      }, null, 13.8);

    // 10. 60 FPS Animation Loop
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      earthMat.uniforms.uTime.value = elapsed;
      stars.rotation.y = elapsed * 0.008;

      // Rotate cyclone particles counter-clockwise (Northern Hemisphere)
      cycloneParticles.rotation.z = elapsed * 1.45;

      // Subtle radar sweep pulse during Scene 4+
      if (elapsed >= 8.8) {
        const s = 1.0 + ((elapsed * 0.9) % 1.8);
        radarRing.scale.set(s, s, 1);
      }

      // Short realistic lightning flashes between 9s and 13.5s
      if (elapsed >= 9.0 && elapsed <= 13.5) {
        lightningLights.forEach((mat, idx) => {
          const pulse = Math.sin(elapsed * (9.5 + idx * 2.1)) > 0.92 ? 0.95 : 0.0;
          mat.opacity = pulse;
        });
      } else {
        lightningLights.forEach(mat => { mat.opacity = 0.0; });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // GPU Resource Cleanup on Unmount
    return () => {
      cancelAnimationFrame(rafId);
      tl.kill();
      window.removeEventListener('resize', handleResize);
      disposables.forEach(obj => {
        if (obj.dispose) obj.dispose();
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#030712] text-white overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      {!fallbackMode && <div ref={mountRef} className="w-full h-full" />}

      {/* Top Bar: Subtle Scene Indicator + Skip Intro */}
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

      {/* Scene 6: Brand Reveal Overlay */}
      {showBrand && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#030712]/55 backdrop-blur-[3px] animate-fadeIn px-6">
          <div className="max-w-2xl w-full text-center space-y-5 p-8 sm:p-12 rounded-[2rem] bg-slate-900/60 backdrop-blur-xl border border-white/15 shadow-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Atmospheric Intelligence</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white font-headline">
              ATLAS-Q
            </h1>

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
