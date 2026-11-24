from fastapi import APIRouter
from backend.data.demo_data import (
    DEMO_DISCLAIMER,
    RISK_SUMMARY,
    STORM_CELLS,
    get_current_iso
)
from backend.services.risk_service import generate_system_alerts, compute_multi_factor_risk

router = APIRouter(prefix="/api/risk", tags=["Risk Analysis"])

@router.get("")
def get_risk_analysis():
    """Returns nowcast thunderstorm risk levels, probability gauges, and regional alerts."""
    return {
        "disclaimer": DEMO_DISCLAIMER,
        "timestamp": get_current_iso(),
        "summary": RISK_SUMMARY,
        "storm_risk_matrix": [
            {
                "id": s["id"],
                "name": s["name"],
                "region": s["region"],
                "estimated_risk": s["estimated_risk"],
                "lightning_probability": s["lightning_probability"],
                "intensity_dbz": s["intensity_dbz"],
                "speed_kmh": s["movement_speed_kmh"],
                "status": s["status"]
            }
            for s in STORM_CELLS
        ],
        "active_alerts": generate_system_alerts(STORM_CELLS),
        "operational_advice": "Severe weather protocol active in Eastern Sector. Issue Doppler alerts to state disaster management authorities."
    }

@router.get("/alerts")
def get_alerts():
    """Returns generated explainable warning alerts based on multi-factor risk computation."""
    return {
        "status": "ok",
        "alerts": generate_system_alerts(STORM_CELLS),
        "timestamp": get_current_iso()
    }
