"""
ATLAS-Q Disaster Management & Response API Router
Provides multi-hazard impact assessment, shelter capacity, and QSA emergency allocation solving.
"""

from fastapi import APIRouter, Query
from backend.services.disaster_service import (
    get_disaster_impact_assessment,
    solve_disaster_resource_allocation,
    SHELTER_DATABASE,
    EVACUATION_ZONES
)

router = APIRouter(prefix="/api/disaster", tags=["Disaster Management"])

@router.get("/impact")
def get_impact():
    """Returns regional impact assessment, population exposure, and evacuation statistics."""
    return {
        "status": "ok",
        "impact": get_disaster_impact_assessment()
    }

@router.get("/shelters")
def list_shelters():
    """Returns directory of designated cyclone/flood shelters and current occupancy."""
    return {
        "status": "ok",
        "shelters": SHELTER_DATABASE
    }

@router.get("/evacuation-zones")
def list_evacuation_zones():
    """Returns evacuation sectors and clearance progress."""
    return {
        "status": "ok",
        "zones": EVACUATION_ZONES
    }

@router.post("/optimize-response")
def run_optimization(
    problem_type: str = "shelter_dispatch",
    num_zones: int = 12,
    num_facilities: int = 4
):
    """Executes Quantum-Inspired Simulated Annealing on emergency allocation problem and benchmarks baselines."""
    solution = solve_disaster_resource_allocation(
        problem_type=problem_type,
        num_zones=num_zones,
        num_facilities=num_facilities
    )
    return {
        "status": "ok",
        "solution": solution
    }
