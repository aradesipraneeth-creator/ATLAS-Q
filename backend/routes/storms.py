from fastapi import APIRouter, HTTPException
from backend.data.demo_data import (
    DEMO_DISCLAIMER,
    STORM_CELLS,
    RADAR_STATIONS,
    LIGHTNING_EVENTS,
    get_current_iso
)

router = APIRouter(prefix="/api/storms", tags=["Storms"])

@router.get("")
def list_storms():
    """Lists all monitored storm cells, Doppler radar stations, and recent lightning points."""
    return {
        "disclaimer": DEMO_DISCLAIMER,
        "timestamp": get_current_iso(),
        "storms": STORM_CELLS,
        "radar_stations": RADAR_STATIONS,
        "lightning_events": LIGHTNING_EVENTS,
        "total_active": len([s for s in STORM_CELLS if s["status"] != "DISSIPATING"])
    }

@router.get("/{storm_id}")
def get_storm_by_id(storm_id: str):
    """Retrieves full telemetry, trajectory, and radar metrics for a specific storm cell."""
    matched = next((s for s in STORM_CELLS if s["id"].lower() == storm_id.lower()), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Storm cell '{storm_id}' not found in monitoring registry.")
    
    return {
        "disclaimer": DEMO_DISCLAIMER,
        "timestamp": get_current_iso(),
        "storm": matched,
        "note": "Prototype simulation — real-time model integration planned."
    }
