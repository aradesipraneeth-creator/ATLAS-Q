"""
ATLAS-Q Demonstration & Scenario Playback Service
Provides repeatable, deterministic multi-step meteorological narratives:
1. Severe Nor'wester (Kalbaishakhi) — Bengal & Odisha
2. Monsoon Squall Line & Microburst — Delhi-NCR
3. Orographic Convection — Western Ghats
"""

from typing import List, Dict, Any
from backend.services.detection_service import generate_radar_grid, run_storm_detection
from backend.services.tracking_service import match_and_track_cells
from backend.services.lightning_service import analyze_lightning_density
from backend.services.risk_service import generate_system_alerts

SCENARIOS_CATALOG = [
    {
        "id": "kalbaishakhi",
        "title": "Severe Nor'wester (Kalbaishakhi)",
        "region": "West Bengal & Odisha Sector",
        "nearest_dwr": "Kolkata S-Band DWR (VECC)",
        "narrative": "Intense pre-monsoon supercell cluster initiating over Chota Nagpur Plateau, propagating southeast into the Gangetic delta with 55+ dBZ core and violent cloud-to-ground lightning.",
        "center_lat": 22.85,
        "center_lon": 87.95,
        "hazard_type": "Hail (≥ 2.5cm), Downburst (> 75 km/h), High CG Flash Density",
        "climatological_period": "March–May Pre-Monsoon"
    },
    {
        "id": "delhi_ncr",
        "title": "Pre-Monsoon Convective Squall Line",
        "region": "Delhi-NCR & Western Uttar Pradesh",
        "nearest_dwr": "Palam C-Band DWR (New Delhi)",
        "narrative": "Fast-moving convective pulse with dry air entrainment at mid-levels causing localized microbursts, dust-raising squalls, and sudden gust fronts across the urban corridor.",
        "center_lat": 28.61,
        "center_lon": 77.23,
        "hazard_type": "Microburst Winds (65-85 km/h), Dry Lightning, Visibility Drop",
        "climatological_period": "May–June Heatwave Pre-Monsoon"
    },
    {
        "id": "western_ghats",
        "title": "Orographic Moisture Convergence",
        "region": "Western Ghats (Pune - Mahabaleshwar Crest)",
        "nearest_dwr": "Mumbai S-Band DWR (Colaba)",
        "narrative": "Strong Arabian Sea maritime inflow forced over steep terrain triggering continuous convective updrafts, moderate lightning, and localized torrential precipitation.",
        "center_lat": 18.15,
        "center_lon": 73.80,
        "hazard_type": "Heavy Rain (> 50mm/hr), Cloud-to-Ground Lightning, Flash Runoff",
        "climatological_period": "Monsoon Onset"
    }
]

def build_scenario_timesteps(scenario_id: str = "kalbaishakhi") -> Dict[str, Any]:
    """
    Constructs a deterministic sequence of 7 observations (T-30m to T+30m)
    with real-time computed detection, kinematics, lightning density, and alerts.
    """
    meta = next((s for s in SCENARIOS_CATALOG if s["id"] == scenario_id), SCENARIOS_CATALOG[0])

    steps_definition = [
        {"step_idx": 0, "label": "T-30m", "offset_x": -6.0, "offset_y": -4.5, "time_str": "15:00 UTC",
         "narrative": "Convective initiation detected along thermal boundary. Initial echo tops reach 8.5 km AGL."},
        {"step_idx": 1, "label": "T-20m", "offset_x": -4.0, "offset_y": -3.0, "time_str": "15:10 UTC",
         "narrative": "Rapid vertical expansion. Reflectivity core exceeds 45 dBZ; first intra-cloud lightning detected."},
        {"step_idx": 2, "label": "T-10m", "offset_x": -2.0, "offset_y": -1.5, "time_str": "15:20 UTC",
         "narrative": "Multi-cell squall line consolidation. Strong updraft helicity indicated by DWR Doppler radial velocity."},
        {"step_idx": 3, "label": "NOW",   "offset_x":  0.0, "offset_y":  0.0, "time_str": "15:30 UTC",
         "narrative": "Peak convective intensity: 55.4 dBZ core, 68 flashes/min, severe gust front expanding toward urban centers."},
        {"step_idx": 4, "label": "T+10m", "offset_x":  2.0, "offset_y":  1.5, "time_str": "15:40 UTC",
         "narrative": "Extrapolated nowcast: Squall line enters Kolkata-Howrah corridor. Alert level elevated to CRITICAL."},
        {"step_idx": 5, "label": "T+20m", "offset_x":  4.0, "offset_y":  3.0, "time_str": "15:50 UTC",
         "narrative": "Cold-pool outflow dominance. Surface precipitation peaks; lightning begins transitioning to stratiform trailing zone."},
        {"step_idx": 6, "label": "T+30m", "offset_x":  6.0, "offset_y":  4.5, "time_str": "16:00 UTC",
         "narrative": "Gradual convective decay. Core weakens to 42 dBZ as boundary layer CAPE is depleted."}
    ]

    timesteps = []
    previous_cells = []

    for step in steps_definition:
        # Generate radar grid for this time step
        grid, grid_meta = generate_radar_grid(
            scenario_type=scenario_id,
            center_lat=meta["center_lat"],
            center_lon=meta["center_lon"],
            grid_size=32,
            cell_offset_x=step["offset_x"],
            cell_offset_y=step["offset_y"]
        )

        # Run storm detection
        detection = run_storm_detection(
            grid=grid,
            metadata=grid_meta,
            threshold_dbz=35.0,
            timestamp=step["time_str"]
        )

        # Run storm tracking against previous time step
        tracked_cells = match_and_track_cells(
            previous_cells=previous_cells,
            current_cells=detection["cells"],
            delta_minutes=10.0
        )
        previous_cells = tracked_cells

        # Generate realistic lightning events proportional to core intensity
        lightning_events = []
        if tracked_cells:
            lead_cell = tracked_cells[0]
            count = int(lead_cell["intensity_dbz"] * 0.35)
            for i in range(count):
                lightning_events.append({
                    "id": f"LGT-{step['step_idx']}-{i+1:02d}",
                    "lat": round(lead_cell["lat"] + (i * 0.02 - 0.05), 3),
                    "lon": round(lead_cell["lon"] + (i * 0.02 - 0.04), 3),
                    "type": "CG-" if i % 2 == 0 else "IC",
                    "peak_current_ka": -35.0 if i % 2 == 0 else 18.0
                })

        lightning_summary = analyze_lightning_density(
            lightning_events=lightning_events,
            center_lat=meta["center_lat"],
            center_lon=meta["center_lon"]
        )

        # Generate alerts
        alerts = generate_system_alerts(tracked_cells)

        timesteps.append({
            "step_index": step["step_idx"],
            "time_label": step["label"],
            "timestamp": step["time_str"],
            "narrative": step["narrative"],
            "radar_grid": grid,
            "grid_metadata": grid_meta,
            "cells": tracked_cells,
            "lightning": lightning_summary,
            "alerts": alerts
        })

    return {
        "scenario": meta,
        "total_steps": len(timesteps),
        "steps": timesteps,
        "provenance": "SIMULATED_REPRODUCIBLE_SCENARIO",
        "disclaimer": "Scenario engineered for deterministic SIH 2026 presentation & algorithm evaluation."
    }
