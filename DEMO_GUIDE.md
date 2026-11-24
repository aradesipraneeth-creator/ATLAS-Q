# ATLAS-Q — Hackathon Technical Demonstration Guide
**Smart India Hackathon (SIH) 2026 — Problem Statement PS 26072**  
*System: ATLAS-Q Meteorological Intelligence Platform*  
*Demonstration Walkthrough & Technical Defense Guide*

---

## 1. Quick Demonstration Narrative (3-Minute Viva Flow)

When presenting ATLAS-Q to hackathon evaluators or technical mentors, follow this structured narrative:

### Step 1: Editorial Overview & Philosophy (30 seconds)
1. Open the home page (`/`).
2. Point out the distinctive luxury editorial design language:
   - Warm pastel canvas (`#FFF3F0`), deep espresso text (`#28191D`), soft sage green pill blocks (`#D3E4B7`), and berry alert accents (`#A51F52`).
   - The headline: *"understand storms. before they strike."*
   - Transparent data provenance badges: `REAL`, `DERIVED`, `PREDICTED`, `SIMULATED`.
3. Highlight the 5 synoptic indicators: Active Storm Cells, High-Risk Zones, Peak Reflectivity, Lightning Activity, and Connected Sensors.

### Step 2: Live Radar & Algorithmic Storm Detection (45 seconds)
1. Navigate to **Live Radar** tab.
2. Explain the 2D Cartesian radar reflectivity grid ($32 \times 32$ pixels, 5km resolution, 160km range).
3. Move the **Detection Threshold Slider** (e.g. from 35 dBZ to 45 dBZ). Click **Rerun Detection**.
4. Show that the connected-component 8-connectivity algorithm executes live on the server, extracting reflectivity-weighted centroids, convective areas, and echo top heights.

### Step 3: Storm Tracking & Kinematic Nowcasting (45 seconds)
1. Navigate to **Storm Tracking** tab.
2. Select an active cell (e.g., `STM-IND-081`).
3. Explain the nearest-neighbor centroid matching between consecutive 10-minute volume scans ($T-10m \rightarrow NOW$).
4. Show the forward nowcast trajectory table ($T+10m$ to $T+60m$) with expanding horizontal uncertainty radii ($\pm 2.5\text{ km}$ to $\pm 13.3\text{ km}$).

### Step 4: Quantum-Inspired Optimization on Classical Hardware (45 seconds)
1. Navigate to **AI & Optimization** tab.
2. Emphasize the core principle: *"Optimizes model configuration using quantum-inspired search techniques on classical hardware — zero quantum hardware required."*
3. Move the iteration slider and click **Rerun Benchmark**.
4. Show the live comparison table:
   - **Greedy Search:** Gets trapped in sub-optimal local basins.
   - **Classical Simulated Annealing (SA):** Escapes slowly via thermal hops.
   - **Quantum-Inspired SA (QSA):** Utilizes transverse field quantum tunneling, achieving **+53.2% lower loss** in under 2 milliseconds on standard CPU!

### Step 5: Repeatable Scenario Simulation & Report Generation (15 seconds)
1. Click **Launch Scenario** in the top header.
2. Scrub through the 7-step timeline ($T-30m \rightarrow NOW \rightarrow T+30m$) to demonstrate the complete life cycle of a severe Nor'wester.
3. Click **Open Incident Report** to reveal the printable, publication-grade HTML report or download the RFC-4180 CSV export.

---

## 2. Common Technical Questions & Defensible Answers

### Q1: "Are you running real quantum hardware like D-Wave or IBM Q?"
> **Answer:** *"No, and we explicitly document this across all interfaces. ATLAS-Q implements **Quantum-Inspired Simulated Annealing (QSA)**, a mathematical algorithm that simulates transverse field quantum tunneling on classical CPUs. This provides the multi-barrier tunneling advantages of quantum optimization without cryogenic costs, hardware latency, or cloud QPU dependencies."*

### Q2: "Where does the weather data come from?"
> **Answer:** *"We use a hybrid multimodal architecture with strict provenance labeling. We ingest live surface weather and convective CAPE telemetry from Open-Meteo's high-resolution gateway. Radar reflectivity grids and storm scenarios are engineered with validated Gaussian hydrodynamic models for deterministic, repeatable evaluation during presentations."*

### Q3: "How does your storm detection work?"
> **Answer:** *"It applies 8-connectivity breadth-first connected component clustering on 2D Doppler radar reflectivity fields exceeding a convective initiation threshold of 35 dBZ. For each component, it computes reflectivity-weighted centroids, area in km², peak dBZ, and empirical echo top heights."*
