from fastapi import APIRouter
from backend.data.demo_data import (
    DEMO_DISCLAIMER,
    MULTIMODAL_SOURCES,
    AI_ENGINE_MODULES,
    QUANTUM_MODULE_INFO,
    get_current_iso
)

router = APIRouter(prefix="/api/architecture", tags=["Architecture"])

@router.get("")
def get_architecture_overview():
    """Returns technical architecture specifications for multimodal ingestion, AI models, and quantum-inspired optimizer."""
    return {
        "disclaimer": DEMO_DISCLAIMER,
        "timestamp": get_current_iso(),
        "project": {
            "title": "ATLAS-Q",
            "full_name": "Atmospheric Thunderstorm & Lightning Analysis System with Quantum-Inspired Optimization",
            "problem_statement": "SIH 2026 PS 26072",
            "phase": "Phase 1 - Prototype Architecture"
        },
        "multimodal_pipeline": MULTIMODAL_SOURCES,
        "ai_engine_layers": AI_ENGINE_MODULES,
        "quantum_optimization": QUANTUM_MODULE_INFO
    }
