# ATLAS-Q — Current Architecture Document
**Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization**  
*Document Version: 1.0 (Phase 1 Baseline)*  
*Timestamp: 2026-11-24*

---

## 1. System Topology Overview

ATLAS-Q operates as a unified full-stack application deployed as a single Web Service on Render:

```
[ Client Browser (React SPA) ]
               │
               │ HTTP / JSON (Relative /api/* requests)
               ▼
[ Python FastAPI Server (Uvicorn @ 0.0.0.0:$PORT) ]
       ├── Static File Handler (Serves frontend/dist/ at root '/')
       ├── /api/health (Liveness Probe)
       ├── /api/dashboard
       ├── /api/storms
       ├── /api/risk
       └── /api/architecture
               │
               ▼
   [ backend/data/demo_data.py ]
   (In-Memory Structured Dictionary)
```

---

## 2. Directory Layout & Key Modules

- `backend/main.py`: ASGI entry point. Configures CORS, mounts API routers, dynamically locates `frontend/dist`, and serves static assets (`/assets`) and `index.html` with SPA fallback.
- `backend/routes/`:
  - `dashboard.py`: Returns hero metrics, highest risk storm, and system statuses.
  - `storms.py`: Returns list of monitored storm cells, Doppler radar stations, and lightning events.
  - `risk.py`: Returns overall risk level, gauge specifications, and high-risk zones.
  - `architecture.py`: Returns multimodal pipeline stages, deep learning modules, and quantum optimization metadata.
- `backend/data/demo_data.py`: Comprehensive Python dictionary containing simulated storm cells, radar stations, lightning points, and system states.
- `frontend/src/`:
  - `App.jsx`: State orchestrator fetching `/api/*` data and switching tabs.
  - `components/`:
    - `Header.jsx`: Brand, status indicators, SIH PS 26072 banner, and navigation tabs.
    - `WeatherMap.jsx`: Vector SVG projection of India with pan, zoom, radar rings, and storm markers.
    - `HeroMetrics.jsx`: 5 metric cards showing storm activity, lightning probability, rainfall intensity, risk level, confidence.
    - `StormTrajectory.jsx`: Step-by-step waypoint scrubber (T-30m to T+30m).
    - `MultimodalPipeline.jsx`: 5-sensor visual ingestion flow with detail drawer.
    - `AiEngineArchitecture.jsx`: 8-step deep learning pipeline.
    - `QuantumOptimization.jsx`: Energy potential SVG graphic with iteration timer.
    - `RiskGauge.jsx`: Semi-circular radial probability arc with risk breakdown.
    - `StormDetailModal.jsx`: Modal popup showing cell telemetry.
    - `SystemStatus.jsx`: Telemetry status row.
  - `services/api.js`: Fetch client wrappers for backend REST endpoints.

---

## 3. Communication Patterns

- **Dev Mode:** Vite dev server on `http://localhost:5173` proxies `/api` calls to `http://127.0.0.1:8000`.
- **Production Mode:** FastAPI runs on `0.0.0.0:$PORT`. When a user navigates to `/`, FastAPI serves the pre-compiled `frontend/dist/index.html`. All `/api/*` calls hit the same server without cross-origin latency.

---

## 4. Current Limitations & Transition Path

1. **Monolithic Data File:** All storm and radar data is static within `demo_data.py`. Transitioning requires a dynamic services layer in Python for live fetching, real detection, and real tracking.
2. **Standard Tailwind Blue UI:** Current design uses generic scientific blues. Transitioning requires custom theme extension matching the luxury bakery editorial aesthetic (`#FFF3F0` warm pastel canvas, `#28191D` espresso text, `#D3E4B7` sage green, `#A51F52` berry accent, large typography, circular imagery).
3. **Illustrative AI/QIO:** Optimization metrics are non-computed illustrations. Transitioning requires an executable Python engine running real QSA, Classical SA, Greedy, and Random search benchmarks on real objective functions.
