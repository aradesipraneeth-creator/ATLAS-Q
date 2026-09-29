from fastapi import APIRouter
from backend.data.demo_data import (
    DEMO_DISCLAIMER,
    RISK_SUMMARY,
    STORM_CELLS,
    get_current_iso
)

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
        "operational_advice": "Severe weather protocol active in Eastern Sector. Issue Doppler alerts to state disaster management authorities."
    }
