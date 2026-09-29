"""
ATLAS-Q: Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization
Phase 1 Prototype Demo Data
IMPORTANT: All values contained herein are SIMULATED / DEMO METEOROLOGICAL DATA
designed for architecture demonstration and SIH 2026 PS 26072 presentation.
"""

from datetime import datetime, timezone, timedelta

def get_current_iso():
    return datetime.now(timezone.utc).isoformat()

DEMO_DISCLAIMER = "DEMO / SIMULATION DATA - Atmospheric observations and model outputs are synthetic for Phase 1 architectural evaluation."

STORM_CELLS = [
    {
        "id": "STM-IND-081",
        "name": "Gangetic Convective Cluster (Kalbaishakhi)",
        "region": "West Bengal & Chota Nagpur Plateau",
        "nearest_radar": "Kolkata S-Band DWR (VECC)",
        "lat": 22.85,
        "lon": 87.95,
        "intensity_dbz": 54.2,
        "echo_top_km": 15.4,
        "lightning_rate_per_min": 68,
        "movement_direction": "SE (135°)",
        "movement_direction_deg": 135,
        "movement_speed_kmh": 46.5,
        "estimated_risk": "HIGH",
        "lightning_probability": 0.94,
        "hail_probability": 0.72,
        "gust_front_probability": 0.88,
        "cape_joules": 3450,
        "status": "ACTIVE NOWCAST",
        "description": "Multi-cell squall line propagating southeast with intense core reflectivity exceeding 50 dBZ and severe electrical activity.",
        "trajectory": [
            {"time_label": "T-30m", "lat": 23.45, "lon": 87.20, "intensity_dbz": 44.0, "status": "Past"},
            {"time_label": "T-20m", "lat": 23.25, "lon": 87.45, "intensity_dbz": 48.5, "status": "Past"},
            {"time_label": "T-10m", "lat": 23.05, "lon": 87.70, "intensity_dbz": 52.0, "status": "Past"},
            {"time_label": "NOW",   "lat": 22.85, "lon": 87.95, "intensity_dbz": 54.2, "status": "Current"},
            {"time_label": "T+10m", "lat": 22.65, "lon": 88.20, "intensity_dbz": 53.0, "status": "Predicted"},
            {"time_label": "T+20m", "lat": 22.45, "lon": 88.45, "intensity_dbz": 49.5, "status": "Predicted"},
            {"time_label": "T+30m", "lat": 22.25, "lon": 88.70, "intensity_dbz": 43.0, "status": "Predicted"}
        ]
    },
    {
        "id": "STM-IND-042",
        "name": "NCR Pre-Frontal Cell",
        "region": "Delhi-NCR & Western UP",
        "nearest_radar": "Palam C-Band DWR (New Delhi)",
        "lat": 28.61,
        "lon": 77.23,
        "intensity_dbz": 48.0,
        "echo_top_km": 12.8,
        "lightning_rate_per_min": 39,
        "movement_direction": "ENE (070°)",
        "movement_direction_deg": 70,
        "movement_speed_kmh": 38.0,
        "estimated_risk": "MODERATE",
        "lightning_probability": 0.78,
        "hail_probability": 0.41,
        "gust_front_probability": 0.65,
        "cape_joules": 2200,
        "status": "ACTIVE NOWCAST",
        "description": "Fast-moving convective pulse with dry air entrainment at mid-levels causing localized microburst risk.",
        "trajectory": [
            {"time_label": "T-30m", "lat": 28.40, "lon": 76.75, "intensity_dbz": 39.0, "status": "Past"},
            {"time_label": "T-20m", "lat": 28.47, "lon": 76.91, "intensity_dbz": 43.5, "status": "Past"},
            {"time_label": "T-10m", "lat": 28.54, "lon": 77.07, "intensity_dbz": 46.5, "status": "Past"},
            {"time_label": "NOW",   "lat": 28.61, "lon": 77.23, "intensity_dbz": 48.0, "status": "Current"},
            {"time_label": "T+10m", "lat": 28.68, "lon": 77.39, "intensity_dbz": 47.0, "status": "Predicted"},
            {"time_label": "T+20m", "lat": 28.75, "lon": 77.55, "intensity_dbz": 42.0, "status": "Predicted"},
            {"time_label": "T+30m", "lat": 28.82, "lon": 77.71, "intensity_dbz": 35.0, "status": "Predicted"}
        ]
    },
    {
        "id": "STM-IND-119",
        "name": "Coastal Odisha Marine-Inversion Cell",
        "region": "Bhubaneswar - Paradip Coastal Belt",
        "nearest_radar": "Paradip S-Band DWR",
        "lat": 20.27,
        "lon": 85.84,
        "intensity_dbz": 51.7,
        "echo_top_km": 14.1,
        "lightning_rate_per_min": 52,
        "movement_direction": "NNE (025°)",
        "movement_direction_deg": 25,
        "movement_speed_kmh": 41.2,
        "estimated_risk": "HIGH",
        "lightning_probability": 0.89,
        "hail_probability": 0.58,
        "gust_front_probability": 0.82,
        "cape_joules": 3100,
        "status": "ACTIVE NOWCAST",
        "description": "Marine moisture boundary interaction fueling rapid vertical development and high flash density.",
        "trajectory": [
            {"time_label": "T-30m", "lat": 19.82, "lon": 85.60, "intensity_dbz": 41.0, "status": "Past"},
            {"time_label": "T-20m", "lat": 19.97, "lon": 85.68, "intensity_dbz": 46.0, "status": "Past"},
            {"time_label": "T-10m", "lat": 20.12, "lon": 85.76, "intensity_dbz": 49.5, "status": "Past"},
            {"time_label": "NOW",   "lat": 20.27, "lon": 85.84, "intensity_dbz": 51.7, "status": "Current"},
            {"time_label": "T+10m", "lat": 20.42, "lon": 85.92, "intensity_dbz": 50.5, "status": "Predicted"},
            {"time_label": "T+20m", "lat": 20.57, "lon": 86.00, "intensity_dbz": 46.0, "status": "Predicted"},
            {"time_label": "T+30m", "lat": 20.72, "lon": 86.08, "intensity_dbz": 39.0, "status": "Predicted"}
        ]
    },
    {
        "id": "STM-IND-065",
        "name": "Western Ghats Orographic Convection",
        "region": "Maharashtra Ghats (Pune - Mahabaleshwar)",
        "nearest_radar": "Mumbai / Goa DWR",
        "lat": 18.15,
        "lon": 73.80,
        "intensity_dbz": 42.5,
        "echo_top_km": 10.9,
        "lightning_rate_per_min": 19,
        "movement_direction": "E (090°)",
        "movement_direction_deg": 90,
        "movement_speed_kmh": 26.0,
        "estimated_risk": "MODERATE",
        "lightning_probability": 0.62,
        "hail_probability": 0.15,
        "gust_front_probability": 0.44,
        "cape_joules": 1850,
        "status": "MONITORING",
        "description": "Orographic uplift along crest ridge producing continuous moderate rain and periodic cloud-to-ground strikes.",
        "trajectory": [
            {"time_label": "T-30m", "lat": 18.15, "lon": 73.40, "intensity_dbz": 36.0, "status": "Past"},
            {"time_label": "T-20m", "lat": 18.15, "lon": 73.53, "intensity_dbz": 39.0, "status": "Past"},
            {"time_label": "T-10m", "lat": 18.15, "lon": 73.66, "intensity_dbz": 41.0, "status": "Past"},
            {"time_label": "NOW",   "lat": 18.15, "lon": 73.80, "intensity_dbz": 42.5, "status": "Current"},
            {"time_label": "T+10m", "lat": 18.15, "lon": 73.94, "intensity_dbz": 40.0, "status": "Predicted"},
            {"time_label": "T+20m", "lat": 18.15, "lon": 74.08, "intensity_dbz": 36.0, "status": "Predicted"},
            {"time_label": "T+30m", "lat": 18.15, "lon": 74.22, "intensity_dbz": 31.0, "status": "Predicted"}
        ]
    },
    {
        "id": "STM-IND-093",
        "name": "Brahmaputra Valley Foothill Cell",
        "region": "Assam & Meghalaya Border",
        "nearest_radar": "Cherrapunji / Mohanbari DWR",
        "lat": 26.18,
        "lon": 91.75,
        "intensity_dbz": 38.0,
        "echo_top_km": 9.5,
        "lightning_rate_per_min": 11,
        "movement_direction": "NE (045°)",
        "movement_direction_deg": 45,
        "movement_speed_kmh": 22.0,
        "estimated_risk": "LOW",
        "lightning_probability": 0.35,
        "hail_probability": 0.08,
        "gust_front_probability": 0.25,
        "cape_joules": 1400,
        "status": "DISSIPATING",
        "description": "Weakening convective cell losing low-level thermal support under increasing valley subsidence.",
        "trajectory": [
            {"time_label": "T-30m", "lat": 26.00, "lon": 91.50, "intensity_dbz": 45.0, "status": "Past"},
            {"time_label": "T-20m", "lat": 26.06, "lon": 91.58, "intensity_dbz": 43.0, "status": "Past"},
            {"time_label": "T-10m", "lat": 26.12, "lon": 91.66, "intensity_dbz": 40.5, "status": "Past"},
            {"time_label": "NOW",   "lat": 26.18, "lon": 91.75, "intensity_dbz": 38.0, "status": "Current"},
            {"time_label": "T+10m", "lat": 26.24, "lon": 91.83, "intensity_dbz": 33.0, "status": "Predicted"},
            {"time_label": "T+20m", "lat": 26.30, "lon": 91.91, "intensity_dbz": 28.0, "status": "Predicted"},
            {"time_label": "T+30m", "lat": 26.36, "lon": 91.99, "intensity_dbz": 22.0, "status": "Predicted"}
        ]
    }
]

RADAR_STATIONS = [
    {"name": "Delhi DWR", "code": "VIDD", "lat": 28.58, "lon": 77.10, "band": "C-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Kolkata DWR", "code": "VECC", "lat": 22.65, "lon": 88.45, "band": "S-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Paradip DWR", "code": "VOPD", "lat": 20.30, "lon": 86.70, "band": "S-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Mumbai DWR", "code": "VABB", "lat": 18.90, "lon": 72.82, "band": "S-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Nagpur DWR", "code": "VANP", "lat": 21.09, "lon": 79.06, "band": "S-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Chennai DWR", "code": "VOMM", "lat": 13.08, "lon": 80.28, "band": "S-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Cherrapunji DWR", "code": "VEBI", "lat": 25.29, "lon": 91.73, "band": "S-Band", "range_km": 250, "status": "Transmitting"},
    {"name": "Patna DWR", "code": "VNPT", "lat": 25.60, "lon": 85.10, "band": "S-Band", "range_km": 250, "status": "Transmitting"}
]

LIGHTNING_EVENTS = [
    {"id": "LGT-001", "lat": 22.84, "lon": 87.92, "type": "CG-", "peak_current_ka": -42.8, "time_offset_sec": -18},
    {"id": "LGT-002", "lat": 22.88, "lon": 87.97, "type": "IC", "peak_current_ka": 15.2, "time_offset_sec": -25},
    {"id": "LGT-003", "lat": 22.81, "lon": 87.94, "type": "CG+", "peak_current_ka": 68.4, "time_offset_sec": -42},
    {"id": "LGT-004", "lat": 28.60, "lon": 77.20, "type": "IC", "peak_current_ka": 18.6, "time_offset_sec": -30},
    {"id": "LGT-005", "lat": 28.63, "lon": 77.25, "type": "CG-", "peak_current_ka": -29.1, "time_offset_sec": -55},
    {"id": "LGT-006", "lat": 20.25, "lon": 85.82, "type": "CG-", "peak_current_ka": -51.3, "time_offset_sec": -12},
    {"id": "LGT-007", "lat": 20.29, "lon": 85.86, "type": "IC", "peak_current_ka": 22.0, "time_offset_sec": -38},
    {"id": "LGT-008", "lat": 18.14, "lon": 73.78, "type": "CG-", "peak_current_ka": -21.4, "time_offset_sec": -70}
]

MULTIMODAL_SOURCES = [
    {
        "id": "radar",
        "name": "Doppler Weather Radar (DWR)",
        "source": "IMD Radar Network (S-Band / C-Band)",
        "parameters": ["Reflectivity (Z)", "Radial Velocity (V)", "Spectrum Width (W)", "Differential Reflectivity (ZDR)"],
        "resolution": "250m radial bin / 10-minute volume scan",
        "latency": "2.4 minutes",
        "status": "Nominal",
        "role": "Detects high-reflectivity convective precipitation cores and hydrometeor phase differentiation."
    },
    {
        "id": "satellite",
        "name": "Geostationary Satellite",
        "source": "INSAT-3D / INSAT-3DR Imager & Sounder",
        "parameters": ["Thermal Infrared (TIR-1 10.8µm)", "Water Vapor (WV 6.7µm)", "Cloud Top Temperature (CTT)", "Cloud Top Height (CTH)"],
        "resolution": "4 km spatial / 15-minute rapid scan",
        "latency": "6.8 minutes",
        "status": "Nominal",
        "role": "Tracks anvil expansion, cloud-top cooling rates, and upper tropospheric moisture convergence."
    },
    {
        "id": "lightning",
        "name": "Lightning Location Network (LLN)",
        "source": "IITM Pune / Damini Network",
        "parameters": ["Cloud-to-Ground (CG) strikes", "Intra-Cloud (IC) pulses", "Peak Current (kA)", "Flash Density"],
        "resolution": "500m spatial accuracy / Millisecond temporal",
        "latency": "1.1 seconds",
        "status": "Nominal",
        "role": "Provides near instantaneous identification of severe updraft electrification and lightning risk."
    },
    {
        "id": "atmospheric",
        "name": "Atmospheric In-Situ Observations",
        "source": "Surface Automatic Weather Stations (AWS) & Radiosondes",
        "parameters": ["Surface Temp & Dew Point", "CAPE (Convective Available Potential Energy)", "CIN (Convective Inhibition)", "0-6km Bulk Wind Shear"],
        "resolution": "Hourly AWS / 12-hourly Radiosonde profile",
        "latency": "8.0 minutes",
        "status": "Nominal",
        "role": "Establishes thermodynamic instability thresholds and boundary-layer moisture convergence."
    },
    {
        "id": "nwp",
        "name": "Numerical Weather Prediction (NWP)",
        "source": "IMD High-Resolution WRF (3km) / NCMRWF Unified Model",
        "parameters": ["Simulated Reflectivity", "Updraft Helicity (UH)", "Boundary Layer Moisture Flux", "Mesoscale Pressure Gradients"],
        "resolution": "3 km grid / 3-hour cycle",
        "latency": "45 minutes",
        "status": "Nominal",
        "role": "Supplies synoptic and mesoscale environmental forcing boundaries to guide extrapolation nowcasts."
    }
]

AI_ENGINE_MODULES = [
    {
        "step": 1,
        "module": "Multimodal Ingestion & Alignment",
        "type": "Spatiotemporal Harmonization",
        "purpose": "Normalizes disparate radar volumetric grids, satellite brightness temperatures, point lightning coordinates, and NWP fields onto a unified canonical coordinate manifold.",
        "badge": "Prototype Ingestion Pipeline"
    },
    {
        "step": 2,
        "module": "3D CNN Core",
        "type": "Storm Structure Extraction",
        "purpose": "Extracts 3D volumetric spatial features (overhangs, bounded weak echo regions, echo tops) from multi-elevation radar scans.",
        "badge": "Prototype Architecture"
    },
    {
        "step": 3,
        "module": "Liquid Neural Network (LNN)",
        "type": "Continuous-Time Temporal Dynamics",
        "purpose": "Models non-linear convective growth, sudden intensification, and dissipation dynamics across irregular observation timestamps without discretization lag.",
        "badge": "Prototype Architecture"
    },
    {
        "step": 4,
        "module": "Spatio-Temporal Graph Neural Network (GNN)",
        "type": "Multi-Cell Relationship Modeling",
        "purpose": "Treats neighboring convective cells as graph nodes with interaction edges representing cold-pool outflows, cell merging, and gust front triggering.",
        "badge": "Prototype Architecture"
    },
    {
        "step": 5,
        "module": "Probabilistic Nowcast Generator",
        "type": "Ensemble Uncertainty Engine",
        "purpose": "Outputs 0 to 60 minute spatiotemporal probability distribution maps for lightning occurrence, reflectivity >= 45 dBZ, and wind gust thresholds.",
        "badge": "Prototype Architecture"
    },
    {
        "step": 6,
        "module": "Quantum-Inspired Optimization Module",
        "type": "Combinatorial Hyperparameter & Ensembling Tuning",
        "purpose": "Uses Quantum-Inspired Simulated Annealing (QSA) and Quantum Particle Swarm Optimization (QPSO) on classical hardware to optimize ensemble weights and threshold parameters under severe computational time constraints.",
        "badge": "Simulated on Classical HW"
    },
    {
        "step": 7,
        "module": "Decision & Alert Synthesis",
        "type": "Risk & Uncertainty Quantification",
        "purpose": "Generates operational alert levels (LOW / MODERATE / HIGH) with calibrated Bayesian confidence bounds for early warning dissemination.",
        "badge": "Operational Simulation"
    }
]

QUANTUM_MODULE_INFO = {
    "title": "Quantum-Inspired Optimization (QIO)",
    "paradigm": "Simulated Quantum Annealing & Q-Swarm on Classical Architecture",
    "description": "Optimizes model configuration, feature selection and decision parameters using quantum-inspired search techniques on classical hardware.",
    "hardware_note": "No quantum hardware used. Executes on standard x86/ARM CPU using quantum tunneling probability analogs.",
    "search_space_dimension": 8,
    "current_iteration": 420,
    "max_iterations": 500,
    "best_objective_loss": 0.0428,
    "classical_greedy_loss": 0.0914,
    "improvement_percentage": 53.2,
    "candidate_states": [
        {"id": "Q-State #1", "tunneling_prob": 0.84, "energy": 0.0428, "status": "Global Optimum Candidate", "selected": True},
        {"id": "Q-State #2", "tunneling_prob": 0.41, "energy": 0.0612, "status": "Sub-optimal Well", "selected": False},
        {"id": "Q-State #3", "tunneling_prob": 0.22, "energy": 0.0784, "status": "Local Minimum Escape", "selected": False},
        {"id": "Q-State #4", "tunneling_prob": 0.15, "energy": 0.0890, "status": "Exploring High Barrier", "selected": False}
    ],
    "parameters_optimized": [
        {"name": "Doppler Attenuation Correction α", "value": "0.038 dB/km"},
        {"name": "Convective Initiation Threshold γ", "value": "36.4 dBZ"},
        {"name": "GNN Outflow Edge Distance Radius", "value": "42.0 km"},
        {"name": "LNN Continuous Time Constant τ", "value": "1.28 s"},
        {"name": "Lightning Flash Clustered DBSCAN ε", "value": "3.5 km"}
    ]
}

RISK_SUMMARY = {
    "overall_risk_level": "HIGH",
    "overall_lightning_probability": 0.94,
    "max_storm_intensity_dbz": 54.2,
    "peak_movement_speed_kmh": 46.5,
    "forecast_uncertainty_score": 0.12,  # Low uncertainty = high confidence
    "confidence_percentage": 88.0,
    "high_risk_zones": [
        {"zone": "Kolkata Metropolitan Area & Howrah", "lead_time_min": 25, "primary_hazard": "Severe Cloud-to-Ground Lightning & 50+ dBZ Hail Core"},
        {"zone": "Bhubaneswar - Cuttack Urban Corridor", "lead_time_min": 35, "primary_hazard": "Intense Squall Line & Gusts > 70 km/h"},
        {"zone": "Delhi South & Faridabad Belt", "lead_time_min": 40, "primary_hazard": "Isolated Severe Convective Gusts & Moderate Lightning"}
    ],
    "gauge_levels": [
        {"label": "LOW", "min": 0, "max": 40, "color": "#10b981", "active": False},
        {"label": "MODERATE", "min": 40, "max": 75, "color": "#f59e0b", "active": False},
        {"label": "HIGH", "min": 75, "max": 100, "color": "#ef4444", "active": True}
    ]
}

SYSTEM_STATUS = {
    "engine": {"label": "ATLAS-Q ENGINE", "status": "ONLINE", "state": "nominal"},
    "api": {"label": "API GATEWAY", "status": "ONLINE", "state": "nominal"},
    "data_pipeline": {"label": "DATA PIPELINE", "status": "DEMO MODE", "state": "demo"},
    "quantum_opt": {"label": "QUANTUM OPTIMIZATION", "status": "SIMULATION MODE", "state": "simulation"},
    "model_status": {"label": "MODEL STATUS", "status": "PROTOTYPE", "state": "prototype"}
}
