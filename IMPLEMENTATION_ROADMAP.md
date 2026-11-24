# ATLAS-Q — Implementation Roadmap
**Complete Prototype Transformation: Editorial Meteorological Intelligence Platform**  
*SIH 2026 Problem Statement PS 26072*  
*Roadmap Version: 2.0*  
*Timestamp: 2026-11-24*

---

## 1. Prioritization Matrix

### P0 — Essential Core
- [x] Complete repository audit & architecture documentation (`PROJECT_AUDIT.md`, `CURRENT_ARCHITECTURE.md`).
- [ ] Premium Editorial Redesign:
  - Custom palette: `#FFF3F0` (warm pastel canvas), `#28191D` (primary text), `#735E60` (secondary), `#D3E4B7` (sage green), `#A51F52` (berry accent), `#F4E3E6` (light pink), `#FFFFFF` (pure white).
  - Oversized lowercase bold typography, DM Serif Display accents, DM Sans UI, circular atmospheric photography.
- [ ] 9-Page Complete Navigation:
  1. Overview
  2. Live Radar
  3. Storm Tracking
  4. Lightning Intelligence
  5. Risk Intelligence
  6. AI & Optimization
  7. Data Sources
  8. Reports
  9. Settings
- [ ] Real Weather Data Integration: Open-Meteo live atmospheric observations with explicit provenance labeling: `REAL`, `DERIVED`, `PREDICTED`, `SIMULATED`.
- [ ] Algorithmic Storm Detection Engine: Connected-component clustering on 2D radar reflectivity matrices calculating real centroids, area, and max/mean dBZ.
- [ ] Algorithmic Storm Tracking Engine: Consecutive observation matching (Hungarian / Nearest-Neighbor) with displacement vectors, velocity, heading, and Kalman/linear 0-60m extrapolation.
- [ ] Repeatable Demonstration Scenario Playback with narrative controls.

### P1 — Important Enhancements
- [ ] Lightning Intelligence: Density clustering, flash-rate trends, and risk categorization.
- [ ] Geographic Risk Intelligence & Alert Center: Multi-factor risk engine and structured, explainable alert generation with recommended actions.
- [ ] Real Quantum-Inspired Optimization Engine: Executable Python benchmarks (QSA with tunneling vs Classical SA vs Greedy vs Random) on a reproducible parameter-tuning loss function.
- [ ] Downloadable Report Suite: Printable HTML/PDF summary & exportable CSV data tables.
- [ ] Data Source Management Dashboard: Provider health, latency, refresh intervals, and provenance tags.

### P2 — Advanced Capabilities
- [ ] Advanced uncertainty visualization (expanding prediction cone on map).
- [ ] Historical model evaluation metrics (precision, recall, FAR, displacement error).
- [ ] Extended local setting toggles (units, sound alerts, simulation speed).

---

## 2. Stage-by-Stage Implementation Plan

### Stage 1: Design System & Editorial Frontend Foundation (Phases 2 & 3)
- Update `frontend/tailwind.config.js` and `frontend/index.html` to integrate Google Fonts (`Space Grotesk`, `DM Serif Display`, `DM Sans`).
- Build global editorial components:
  - Editorial Header with logo, 9-tab navigation, data connection status, notification bell, and demo mode switch.
  - Editorial Hero section with lowercase oversized bold headline (`understand storms. before they strike.`), circular atmospheric imagery, and dual action buttons.
  - Large rounded pill containers (`#D3E4B7`, `#F4E3E6`, `#A51F52`) inspired by the reference bakery layout.

### Stage 2: Backend Algorithmic Services (Phases 6, 7, 8, 9, 10, 11)
- Create `backend/services/weather_service.py`: Real Open-Meteo live integration for Indian meteorological stations (Delhi, Kolkata, Mumbai, Chennai, Bhubaneswar, etc.) fetching live temperature, precipitation, wind speed, pressure, and convective CAPE.
- Create `backend/services/detection_service.py`: 2D radar grid simulation & real connected-component storm cell clustering, centroid extraction, and area calculation.
- Create `backend/services/tracking_service.py`: Consecutive observation matching across time steps with velocity, heading, and Kalman extrapolation with uncertainty cones.
- Create `backend/services/lightning_service.py`: Spatial flash clustering and density calculation.
- Create `backend/services/risk_service.py`: Multi-factor risk scoring and explainable alert generation with safety recommendations.
- Create `backend/services/optimization_service.py`: Executable Quantum-Inspired Simulated Annealing (QSA), Classical Simulated Annealing, Greedy, and Random search benchmarks.
- Create `backend/services/scenario_service.py`: Repeatable multi-step storm scenario player.
- Create `backend/services/report_service.py`: CSV and structured incident report compiler.

### Stage 3: New REST API Endpoints & Routes (Phase 15)
- Add routes for:
  - `/api/radar/grid` (radar reflectivity matrices)
  - `/api/detection/run` (execute detection pipeline)
  - `/api/tracking/predict` (execute tracking & nowcasting)
  - `/api/lightning/analysis` (lightning intelligence)
  - `/api/risk/alerts` (active alerts & risk zones)
  - `/api/optimization/benchmark` (run real optimization comparison)
  - `/api/sources` (data provenance & status)
  - `/api/scenarios` (scenario playback sequence)
  - `/api/reports/generate` (downloadable reports)

### Stage 4: Page Implementations & Component Integration (Phases 4, 5, 8, 9, 10, 11, 13, 14)
- Implement all 9 views:
  1. `OverviewPage.jsx`
  2. `LiveRadarPage.jsx`
  3. `StormTrackingPage.jsx`
  4. `LightningPage.jsx`
  5. `RiskIntelligencePage.jsx`
  6. `OptimizationPage.jsx`
  7. `DataSourcesPage.jsx`
  8. `ReportsPage.jsx`
  9. `SettingsPage.jsx`
- Integrate interactive vector GIS map with real-time layer toggles, radar reflectivity, cell markers, trajectories, and risk zones.
- Implement scenario playback controller (Play, Pause, Step, Scrubber).

### Stage 5: Testing, Documentation & Git Versioning (Phases 15, 16)
- Execute Python unit tests on detection, tracking, risk, and QSA optimization services.
- Execute frontend production build (`npm run build`).
- Verify full-stack integration and static file serving on FastAPI.
- Generate complete documentation suite: `README.md`, `ARCHITECTURE.md`, `DATA_SOURCES.md`, `MODEL_METHODOLOGY.md`, `API_DOCUMENTATION.md`, `DEMO_GUIDE.md`, `.env.example`.
- Commit all changes cleanly to Git.
