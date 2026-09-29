# ATLAS-Q: Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization

> **Smart India Hackathon (SIH) 2026 — Problem Statement PS 26072**  
> *"AIML based Nowcasting of thunderstorm and lightning using atmospheric observation including multiple radars, satellite, lightning and model data."*  
> **Phase 1 Working Prototype & Production Deployment Guide**

---

## 📌 Executive Summary

**ATLAS-Q** is an advanced meteorological intelligence prototype engineered for 0–60 minute high-resolution probabilistic nowcasting of severe convective thunderstorms, cloud-to-ground lightning initiation, and hazardous wind squalls across the Indian subcontinent.

The system addresses the critical humanitarian challenge of lightning fatalities and localized convective damage by harmonizing multimodal observational streams (Doppler Weather Radars, Geostationary INSAT-3D/3DR satellites, IITM/Damini lightning location networks, surface AWS, and WRF numerical weather models) into a unified predictive interface.

---

## ⚠️ Phase 1 Demarcation Notice

| Attribute | CURRENT PROTOTYPE (Phase 1) | FUTURE IMPLEMENTATION (Phase 2 & 3) |
| :--- | :--- | :--- |
| **Observation Data** | Realistic structured demo data simulating active Indian storms (Kalbaishakhi/Bengal, NCR, Odisha, Western Ghats) | Real-time automated NetCDF/HDF5 ingestion from IMD MOSDAC & NCMRWF streaming APIs |
| **AI Models** | Modular prototype architecture with synthetic spatiotemporal kinematics (no GPU required) | Fully trained 3D CNNs (reflectivity cores), Liquid Neural Networks (LNNs for continuous ODE dynamics), and GNNs |
| **Quantum Module** | Classical CPU-based Quantum-Inspired Simulated Annealing (QSA) & QPSO landscape search | Scalable quantum-inspired ensembling on distributed clusters with optional QPU hybrid acceleration |
| **Hardware Reqs** | Zero GPU / Zero Quantum hardware required; runs on standard free-tier cloud CPU | Multi-GPU cluster for distributed 3D volumetric convolution & tensor training |
| **Deployment** | Single unified Render service providing **ONE public URL** | Multi-region redundant cloud cluster with automated disaster alert dissemination |

---

## 🏛️ System Architecture

```
                  ┌──────────────────────────────────────────────────────────┐
                  │                 MULTIMODAL DATA INGESTION                │
                  └──────────────────────────────────────────────────────────┘
                        │               │              │             │
                 ┌─────────────┐ ┌─────────────┐ ┌───────────┐ ┌───────────┐
                 │ Doppler DWR │ │  INSAT-3D   │ │   IITM    │ │  NWP WRF  │
                 │   Radars    │ │  Satellite  │ │ Lightning │ │ 3km Model │
                 └─────────────┘ └─────────────┘ └───────────┘ └───────────┘
                        │               │              │             │
                        ▼               ▼              ▼             ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │      MULTIMODAL FUSION & SPATIOTEMPORAL ALIGNMENT        │
                  └──────────────────────────────────────────────────────────┘
                                               │
                                               ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │              ATLAS-Q DEEP LEARNING ENGINE                │
                  │                                                          │
                  │  [1] 3D CNN  ──> Storm Structure & Core Extraction      │
                  │  [2] LNN     ──> Continuous-Time Convective Dynamics     │
                  │  [3] GNN     ──> Storm-Cell Interactions & Outflows      │
                  └──────────────────────────────────────────────────────────┘
                                               │
                                               ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │               STORM DETECTION & TRACKING                 │
                  │          Kinematic Trajectory (T-30m to T+30m)           │
                  └──────────────────────────────────────────────────────────┘
                                               │
                                               ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │         QUANTUM-INSPIRED OPTIMIZATION (CLASSICAL)        │
                  │     Tunneling Parameter Search & Ensemble Weighting      │
                  └──────────────────────────────────────────────────────────┘
                                               │
                                               ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │          PROBABILISTIC NOWCAST & RISK SYNTHESIS          │
                  │           (LOW / MODERATE / HIGH Hazard Tiers)           │
                  └──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Custom SVG Geographic Projection Canvas
- **Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic
- **Protocols:** RESTful JSON APIs
- **Deployment Platform:** Render (Single Unified Web Service)
- **Containerization:** Multi-stage Dockerfile (Node 20 + Python 3.11 Slim)

---

## 🚀 Key Phase 1 Features

1. **Meteorological Monitoring Dashboard:**
   - Light scientific UI designed with Navy, Blue, Cyan, Slate, and Lightning Amber accents.
   - Hero metric cards: Storm Activity, Lightning Probability, Rainfall Intensity, Risk Level, Model Confidence.
   - Real-time operational system status telemetry.

2. **Interactive Weather Map of India:**
   - Vector SVG geographic canvas mapping Indian coordinates (8°N–37°N, 68°E–98°E).
   - Dynamic overlays: Doppler radar coverage rings (Delhi, Kolkata, Paradip, Mumbai, Nagpur, Chennai, Cherrapunji), active storm cells, lightning strikes, severe risk polygons, and trajectories.
   - Interactive zoom (+ / - / reset), pan dragging, and click-to-inspect storm cell telemetry.

3. **Interactive Storm Trajectory Nowcasting:**
   - Timeline scrubber spanning **T-30m → T-20m → T-10m → NOW → T+10m → T+20m → T+30m**.
   - Automated playback controls (Play / Pause / Step) displaying moving storm positions, dBZ intensity trends, and propagation vectors.

4. **Multimodal Harmonization Pipeline:**
   - Interactive sensor flow showcasing Radar, Satellite, Lightning, In-situ Atmospheric, and NWP data.
   - Clickable sensor cards revealing real-time latency, resolution, and physical parameters.

5. **Quantum-Inspired Optimization Module:**
   - Real-time animated non-convex potential energy landscape ($V(x)$) showcasing quantum tunneling across potential barriers.
   - Displays 8D search space, 32 candidate Q-states, and optimal hyperparameter values evaluated on classical hardware.

6. **Probabilistic Risk Gauge:**
   - Visual semi-circular radial gauge indicating hazard tier (**LOW**, **MODERATE**, **HIGH**).
   - Actionable 60-minute early warning corridors for disaster management authorities.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/atlas-q.git
cd atlas-q
```

### Step 2: Set Up Backend
```bash
# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install Python requirements
pip install -r requirements.txt
```

### Step 3: Set Up and Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 4: Run Application
```bash
# Start backend (which automatically serves the compiled frontend!)
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
Open your browser at **`http://localhost:8000`** to view ATLAS-Q!

---

## 🌐 Render Deployment Instructions (Single Public URL)

ATLAS-Q is engineered as a **single unified deployable service** on Render so that you get **ONE clean public URL** with zero CORS configurations.

### Option 1: Deploy with Git (Recommended)

1. **Push your repository to GitHub / GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository containing ATLAS-Q.
5. Configure the following settings:
   - **Name:** `atlas-q`
   - **Region:** `Singapore` (or nearest)
   - **Branch:** `main`
   - **Runtime:** `Python`
   - **Build Command:**
     ```bash
     npm --prefix frontend install && npm --prefix frontend run build && pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan:** Free
6. Under **Advanced Settings**, add:
   - `PYTHON_VERSION`: `3.11.9`
   - `NODE_VERSION`: `20.12.0`
7. Click **Deploy Web Service**.
8. Once deployed, Render will provide a public URL like:
   `https://atlas-q.onrender.com`

### Option 2: Deploy with Blueprint (`render.yaml`)

1. Connect your repository on Render.
2. Select **Blueprints** → **New Blueprint Instance**.
3. Render will detect `render.yaml` and configure the build and start commands automatically!

---

## 📡 REST API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service liveness and readiness probe for Render |
| `/api/dashboard` | `GET` | Hero metrics, active storm summaries, and system telemetry |
| `/api/storms` | `GET` | List of monitored storm cells, radar stations, and lightning events |
| `/api/storms/{storm_id}` | `GET` | Detailed telemetry, trajectory waypoints, and probabilities for a cell |
| `/api/risk` | `GET` | Overall nowcast hazard levels, radial gauge values, and alert zones |
| `/api/architecture` | `GET` | Multimodal sensor metadata, deep learning layers, and QIO specifications |

Example `/api/health` response:
```json
{
  "status": "ok",
  "service": "ATLAS-Q",
  "phase": "Phase 1 Prototype",
  "version": "1.0.0",
  "timestamp": "2026-09-30T00:00:00Z",
  "problem_statement": "SIH 2026 PS 26072"
}
```

---

## 🔮 Future Roadmap (Phase 2 & 3)

1. **Real-Time Data Connectors:**
   - Integration with IMD MOSDAC FTP/S3 buckets for real-time S-Band/C-Band DWR volume scans.
   - Ingestion of INSAT-3DR rapid-scan infrared and water vapor brightness temperature channels.

2. **Advanced Deep Learning Execution:**
   - **Liquid Neural Networks (LNN):** Implementing adaptive continuous-time ordinary differential equation (ODE) neurons to capture flash-burst convective acceleration.
   - **Graph Neural Networks (GNN):** Modeling cold-pool outflows and multi-cell convective mergers as dynamic graph topologies.

3. **Hybrid Quantum Optimization:**
   - Porting classical quantum-inspired annealing algorithms (QSA) to quantum annealers (e.g., D-Wave Leap) or QAOA on gate-based QPUs for hyper-dimensional multi-sensor parameter search.

---

## 👥 Credits & Hackathon Presentation

- **System:** ATLAS-Q (Atmospheric Thunderstorm & Lightning Analysis System)
- **Competition:** Smart India Hackathon (SIH) 2026
- **Problem Statement ID:** PS 26072
- **Category:** AIML Weather Nowcasting & Disaster Management
