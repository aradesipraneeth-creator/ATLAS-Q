import os
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

# Ensure root directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.routes.dashboard import router as dashboard_router
from backend.routes.storms import router as storms_router
from backend.routes.risk import router as risk_router
from backend.routes.architecture import router as architecture_router
from backend.routes.weather import router as weather_router
from backend.routes.detection import router as detection_router
from backend.routes.tracking import router as tracking_router
from backend.routes.lightning import router as lightning_router
from backend.routes.optimization import router as optimization_router
from backend.routes.scenarios import router as scenarios_router
from backend.routes.reports import router as reports_router
from backend.routes.cyclones import router as cyclones_router
from backend.routes.disaster import router as disaster_router
from backend.routes.intelligence import router as intelligence_router
from backend.data.demo_data import get_current_iso, DEMO_DISCLAIMER

app = FastAPI(
    title="ATLAS-Q National Atmospheric Intelligence & Predictive Disaster Simulation",
    description="AI-powered atmospheric forecasting (LNN + GNN), hydrological flood simulation, and quantum-inspired disaster decision support.",
    version="3.0.0-research"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(dashboard_router)
app.include_router(storms_router)
app.include_router(risk_router)
app.include_router(architecture_router)
app.include_router(weather_router)
app.include_router(detection_router)
app.include_router(tracking_router)
app.include_router(lightning_router)
app.include_router(optimization_router)
app.include_router(scenarios_router)
app.include_router(reports_router)
app.include_router(cyclones_router)
app.include_router(disaster_router)
app.include_router(intelligence_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint for Render / monitoring systems."""
    return {
        "status": "ok",
        "service": "ATLAS-Q",
        "version": "2.0.0-editorial",
        "timestamp": get_current_iso(),
        "problem_statement": "SIH 2026 PS 26072",
        "disclaimer": DEMO_DISCLAIMER,
        "capabilities": [
            "live_weather_ingestion",
            "storm_detection_engine",
            "kinematic_tracking_nowcasting",
            "lightning_density_intelligence",
            "multi_factor_risk_alerts",
            "quantum_inspired_optimization_benchmarks",
            "reproducible_scenario_playback",
            "automated_report_generation"
        ]
    }

# Check for built frontend dist directory
possible_dist_paths = [
    BASE_DIR / "frontend" / "dist",
    BASE_DIR / "dist",
    Path("frontend/dist"),
    Path("dist")
]

dist_path = None
for p in possible_dist_paths:
    if p.exists() and (p / "index.html").exists():
        dist_path = p.resolve()
        break

if dist_path:
    # Mount assets folder
    assets_dir = dist_path / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        file_candidate = dist_path / full_path
        if full_path and file_candidate.exists() and file_candidate.is_file():
            return FileResponse(file_candidate)
        
        return FileResponse(dist_path / "index.html")
else:
    @app.get("/", tags=["Root"])
    def root():
        return {
            "service": "ATLAS-Q Backend API",
            "version": "2.0.0-editorial",
            "message": "FastAPI is operational. Frontend dist has not been built or mounted yet.",
            "health": "/api/health",
            "endpoints": [
                "/api/health",
                "/api/dashboard",
                "/api/storms",
                "/api/risk",
                "/api/risk/alerts",
                "/api/architecture",
                "/api/weather/stations",
                "/api/detection/grid",
                "/api/detection/run",
                "/api/tracking/live",
                "/api/lightning/analysis",
                "/api/optimization/benchmark",
                "/api/scenarios/catalog",
                "/api/scenarios/kalbaishakhi",
                "/api/reports/csv",
                "/api/reports/html"
            ]
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
