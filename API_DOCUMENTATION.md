# ATLAS-Q — RESTful API Documentation
**Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization**  
*SIH 2026 Problem Statement PS 26072*  
*API Version: 2.0.0-editorial*

---

## 1. Overview

The ATLAS-Q backend is built on **Python FastAPI** and deployed as a single unified service on Render. All endpoints return standardized JSON structures (or RFC-4180 CSV / HTML for report downloads).

**Base URL:** `http://localhost:8000` (Local) or `https://atlas-q.onrender.com` (Production)

---

## 2. API Endpoints Directory

### 2.1 System & Health

#### `GET /api/health`
Liveness and operational readiness check for Render and monitoring clusters.
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "service": "ATLAS-Q",
  "version": "2.0.0-editorial",
  "timestamp": "2026-11-24T12:00:00Z",
  "problem_statement": "SIH 2026 PS 26072",
  "capabilities": ["live_weather_ingestion", "storm_detection_engine", "kinematic_tracking_nowcasting", "quantum_inspired_optimization_benchmarks"]
}
```

---

### 2.2 Live Atmospheric Ingestion

#### `GET /api/weather/stations`
Fetches real-time surface meteorological telemetry and instability indices across all monitored Indian stations.
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "stations": [
    {
      "station": "Kolkata (Alipore)",
      "station_code": "VECC",
      "lat": 22.57,
      "lon": 88.36,
      "provenance": "REAL",
      "surface_metrics": { "temperature_c": 31.4, "relative_humidity_pct": 78, "wind_speed_kmh": 38.5, "precipitation_mm": 12.4 },
      "instability_indices": { "cape_j_kg": 2850.0, "lifted_index": -4.2 }
    }
  ]
}
```

#### `GET /api/weather/station/{station_key}`
Fetches live telemetry for a specific station (`DELHI`, `KOLKATA`, `BHUBANESWAR`, `MUMBAI`, `CHENNAI`, `NAGPUR`, `GUWAHATI`).

---

### 2.3 Storm Detection Engine

#### `GET /api/detection/grid?scenario=kalbaishakhi&grid_size=32`
Returns the 2D Cartesian radar reflectivity matrix ($32 \times 32$) in dBZ for visual heatmap canvas rendering.

#### `GET /api/detection/run?scenario=kalbaishakhi&threshold_dbz=35.0`
Executes connected-component spatial clustering (8-connectivity) on the radar grid and returns extracted cells with centroids and areas.
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "detection": {
    "total_cells_detected": 3,
    "cells": [
      {
        "id": "STM-IND-081",
        "lat": 22.85,
        "lon": 87.95,
        "intensity_dbz": 55.4,
        "mean_intensity_dbz": 44.2,
        "area_km2": 225.0,
        "echo_top_km": 15.6,
        "estimated_risk": "CRITICAL",
        "provenance": "DERIVED"
      }
    ]
  }
}
```

---

### 2.4 Storm Tracking & Nowcasting

#### `GET /api/tracking/live?scenario=kalbaishakhi`
Matches cells across consecutive 10-minute volume scans, computing velocities, headings, and 0–60 min extrapolation waypoints with expanding uncertainty radii.

---

### 2.5 Lightning Intelligence

#### `GET /api/lightning/analysis`
Calculates spatial strike density (per 1000 km²), Cloud-to-Ground (CG) vs Intra-Cloud (IC) balance, mean peak current ($kA$), and risk classification.

---

### 2.6 Risk Intelligence & Warnings

#### `GET /api/risk`
Returns composite Bayesian Hazard Index (BHI) breakdown and regional storm severity matrix.

#### `GET /api/risk/alerts`
Returns prioritized, explainable operational warning advisories with supporting observations and recommended safety actions.

---

### 2.7 Quantum-Inspired Optimization (QIO)

#### `GET /api/optimization/benchmark?iterations=60&seed=42`
Executes authentic Python optimization benchmarks on server CPU comparing QSA against Classical SA, Greedy Local Search, and Random Search.
- **Response `200 OK`:**
```json
{
  "iterations_evaluated": 60,
  "hardware": "Classical CPU — Zero Quantum Hardware Required",
  "algorithms": {
    "quantum_inspired_sa": { "best_loss": 0.0428, "runtime_ms": 1.45, "tunneling_rate_pct": 21.7, "improvement_over_greedy_pct": 53.2 },
    "simulated_annealing": { "best_loss": 0.0612, "runtime_ms": 1.28 },
    "greedy_search": { "best_loss": 0.0914, "runtime_ms": 0.85 }
  },
  "provenance": "REAL_ALGORITHM_EXECUTION"
}
```

---

### 2.8 Demonstration Scenarios & Reports

#### `GET /api/scenarios/catalog`
Lists available repeatable meteorological scenarios (`kalbaishakhi`, `delhi_ncr`, `western_ghats`).

#### `GET /api/scenarios/{scenario_id}`
Returns complete 7-step observation timeline ($T-30m$ to $T+30m$) with radar grids, tracked cells, and generated alerts.

#### `GET /api/reports/csv?scenario=kalbaishakhi`
Downloads an RFC-4180 compliant CSV file of storm cell detections, advection kinematics, and risk tiers.

#### `GET /api/reports/html?scenario=kalbaishakhi`
Generates a printable, styled HTML incident nowcast report for PDF conversion or browser viewing.
