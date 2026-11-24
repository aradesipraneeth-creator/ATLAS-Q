from fastapi import APIRouter, Query
from backend.services.detection_service import generate_radar_grid, run_storm_detection
from backend.services.tracking_service import match_and_track_cells

router = APIRouter(prefix="/api/tracking", tags=["Storm Tracking & Kinematics"])

@router.get("/live")
def get_live_tracking_and_predictions(
    scenario: str = Query("kalbaishakhi")
):
    """
    Executes consecutive observation matching between T-10m and NOW steps,
    computing velocities, directions, and 0–60 min extrapolation cones.
    """
    # Generate T-10m observation
    grid_prev, meta_prev = generate_radar_grid(scenario, cell_offset_x=-2.0, cell_offset_y=-1.5)
    det_prev = run_storm_detection(grid_prev, meta_prev, threshold_dbz=35.0, timestamp="T-10m")

    # Generate NOW observation
    grid_curr, meta_curr = generate_radar_grid(scenario, cell_offset_x=0.0, cell_offset_y=0.0)
    det_curr = run_storm_detection(grid_curr, meta_curr, threshold_dbz=35.0, timestamp="NOW")

    # Match and track
    tracked_cells = match_and_track_cells(
        previous_cells=det_prev["cells"],
        current_cells=det_curr["cells"],
        delta_minutes=10.0
    )

    return {
        "status": "ok",
        "tracked_cells": tracked_cells,
        "delta_minutes": 10.0,
        "provenance": "DERIVED_KINEMATIC_TRACKING",
        "methodology": "Spatial Centroid Nearest-Neighbor Matching & Extrapolation"
    }
