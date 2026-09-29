from fastapi import APIRouter
from backend.data.demo_data import (
    DEMO_DISCLAIMER,
    STORM_CELLS,
    RISK_SUMMARY,
    SYSTEM_STATUS,
    LIGHTNING_EVENTS,
    get_current_iso
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_summary():
    """Returns hero metrics, active storm highlights, and system status."""
    active_storms = [s for s in STORM_CELLS if s["status"] != "DISSIPATING"]
    highest_risk = max(STORM_CELLS, key=lambda s: s["intensity_dbz"])

    return {
        "disclaimer": DEMO_DISCLAIMER,
        "timestamp": get_current_iso(),
        "hero_metrics": {
            "storm_activity": {
                "label": "Active Storm Cells",
                "value": f"{len(active_storms)} Active Cells",
                "subtext": "2 High Risk | 2 Moderate | 1 Dissipating",
                "status": "warning"
            },
            "lightning_probability": {
                "label": "Lightning Probability (Peak)",
                "value": f"{int(RISK_SUMMARY['overall_lightning_probability'] * 100)}%",
                "subtext": f"{len(LIGHTNING_EVENTS)} strikes detected in last 120s",
                "status": "danger"
            },
            "rainfall_intensity": {
                "label": "Peak Radar Reflectivity",
                "value": f"{RISK_SUMMARY['max_storm_intensity_dbz']} dBZ",
                "subtext": "Extremely heavy rain / Hail potential",
                "status": "danger"
            },
            "risk_level": {
                "label": "Overall Nowcast Risk",
                "value": RISK_SUMMARY["overall_risk_level"],
                "subtext": "Severe alert for Kolkata & Odisha corridors",
                "status": "danger"
            },
            "confidence": {
                "label": "Model Ensemble Confidence",
                "value": f"{RISK_SUMMARY['confidence_percentage']}%",
                "subtext": "Bayesian multi-radar variance: ±12%",
                "status": "success"
            }
        },
        "highest_risk_cell": highest_risk,
        "system_status": SYSTEM_STATUS,
        "active_cell_count": len(active_storms),
        "total_monitored_cells": len(STORM_CELLS)
    }
