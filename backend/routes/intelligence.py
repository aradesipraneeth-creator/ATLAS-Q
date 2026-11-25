"""
ATLAS-Q Intelligence & Predictive Simulation API Router
Exposes LNN temporal forecasting, GNN spatial hazard graph, AP high-detail pilot,
hydrological flood progression, model evaluation, and evidence-grounded Disaster Copilot.
"""

from fastapi import APIRouter, Body
from pydantic import BaseModel
from backend.services.ap_pilot_data import REGION_COVERAGE_METADATA, AP_DISTRICTS
from backend.services.lnn_service import run_lnn_temporal_forecast
from backend.services.gnn_service import run_gnn_spatial_inference
from backend.services.flood_service import simulate_ap_flood_progression
from backend.services.evaluation_service import get_model_evaluation_report
from backend.services.copilot_service import query_disaster_copilot

router = APIRouter(prefix="/api/intelligence", tags=["AI & Simulation"])

class CopilotQuery(BaseModel):
    question: str
    region: str = "andhra_pradesh"
    rainfall_multiplier: float = 1.0
    storm_surge_m: float = 1.5

@router.get("/regions")
def get_region_modes():
    """Returns India national and Andhra Pradesh high-detail pilot coverage & resolution metadata."""
    return {
        "status": "ok",
        "regions": REGION_COVERAGE_METADATA,
        "ap_district_count": len(AP_DISTRICTS)
    }

@router.get("/lnn")
def get_lnn_forecast(location: str = "Konaseema (AP-KNS)"):
    """Runs causal CfC/LNN continuous-time temporal rollout."""
    return {
        "status": "ok",
        "lnn": run_lnn_temporal_forecast(location_name=location)
    }

@router.get("/gnn")
def get_gnn_spatial(cyclone_wind_boost: float = 1.0, rain_multiplier: float = 1.0):
    """Runs 2-layer ST-GAT Graph Neural Network inference across AP districts & river basins."""
    return {
        "status": "ok",
        "gnn": run_gnn_spatial_inference(
            cyclone_wind_boost=cyclone_wind_boost,
            rain_multiplier=rain_multiplier
        )
    }

@router.get("/flood")
def get_flood_simulation(rainfall_multiplier: float = 1.0, storm_surge_m: float = 1.5):
    """Runs SCS-CN hydrological flood progression across Godavari, Krishna, and Pennar basins."""
    return {
        "status": "ok",
        "flood": simulate_ap_flood_progression(
            rainfall_multiplier=rainfall_multiplier,
            storm_surge_m=storm_surge_m
        )
    }

@router.get("/evaluation")
def get_evaluation():
    """Returns transparent model evaluation metrics across Cyclone, Lightning, Flood, LNN, and GNN."""
    return {
        "status": "ok",
        "evaluation": get_model_evaluation_report()
    }

@router.post("/copilot")
def ask_copilot(payload: CopilotQuery = Body(...)):
    """Answers disaster-intelligence queries grounded in live LNN, GNN, Cyclone, Flood, and QSA outputs."""
    return {
        "status": "ok",
        "copilot": query_disaster_copilot(
            question=payload.question,
            region=payload.region,
            rainfall_multiplier=payload.rainfall_multiplier,
            storm_surge_m=payload.storm_surge_m
        )
    }
