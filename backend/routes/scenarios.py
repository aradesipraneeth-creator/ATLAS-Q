from fastapi import APIRouter
from backend.services.scenario_service import SCENARIOS_CATALOG, build_scenario_timesteps

router = APIRouter(prefix="/api/scenarios", tags=["Scenario Playback & Demonstration"])

@router.get("/catalog")
def get_scenarios_catalog():
    """Lists available meteorological storm scenarios."""
    return {
        "status": "ok",
        "scenarios": SCENARIOS_CATALOG
    }

@router.get("/{scenario_id}")
def get_scenario_timeline(scenario_id: str):
    """Retrieves full 7-step observation timeline for repeatable playback."""
    return build_scenario_timesteps(scenario_id)
