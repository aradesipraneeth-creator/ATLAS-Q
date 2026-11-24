from fastapi import APIRouter
from backend.services.lightning_service import analyze_lightning_density
from backend.data.demo_data import LIGHTNING_EVENTS

router = APIRouter(prefix="/api/lightning", tags=["Lightning Intelligence"])

@router.get("/analysis")
def get_lightning_intelligence():
    """Returns spatial lightning strike density, CG/IC partition, and risk classifications."""
    result = analyze_lightning_density(LIGHTNING_EVENTS)
    return {
        "status": "ok",
        "lightning": result
    }
