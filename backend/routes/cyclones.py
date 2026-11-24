"""
ATLAS-Q Cyclones API Router
Provides active tropical cyclone tracks, IMD-style advisories, and forecast trajectories.
"""

from fastapi import APIRouter, HTTPException
from backend.services.cyclone_service import get_active_cyclones, get_cyclone_by_id

router = APIRouter(prefix="/api/cyclones", tags=["Cyclones"])

@router.get("/active")
def list_active_cyclones():
    """Returns list of active tropical cyclones being tracked in the North Indian Ocean basin."""
    cyclones = get_active_cyclones()
    return {
        "status": "ok",
        "count": len(cyclones),
        "cyclones": cyclones
    }

@router.get("/{cyclone_id}")
def get_cyclone_details(cyclone_id: str):
    """Returns full meteorological profile, historical track, and forecast trajectory for a cyclone."""
    data = get_cyclone_by_id(cyclone_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Cyclone {cyclone_id} not found.")
    return {
        "status": "ok",
        "data": data
    }
