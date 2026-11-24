from fastapi import APIRouter, Query
from backend.services.detection_service import generate_radar_grid, run_storm_detection

router = APIRouter(prefix="/api/detection", tags=["Storm Detection Engine"])

@router.get("/grid")
def get_radar_grid_sample(
    scenario: str = Query("kalbaishakhi", description="Scenario type: kalbaishakhi, delhi_ncr, western_ghats"),
    grid_size: int = Query(32, ge=16, le=64)
):
    """Returns 2D synthetic radar reflectivity grid matrix for visual heatmap rendering."""
    grid, metadata = generate_radar_grid(scenario_type=scenario, grid_size=grid_size)
    return {
        "status": "ok",
        "grid": grid,
        "metadata": metadata
    }

@router.get("/run")
def execute_storm_detection(
    scenario: str = Query("kalbaishakhi", description="Scenario type"),
    threshold_dbz: float = Query(35.0, ge=20.0, le=55.0)
):
    """Executes connected-component spatial clustering on radar grid."""
    grid, metadata = generate_radar_grid(scenario_type=scenario, grid_size=32)
    detection_result = run_storm_detection(grid, metadata, threshold_dbz=threshold_dbz)
    return {
        "status": "ok",
        "detection": detection_result,
        "grid": grid
    }
