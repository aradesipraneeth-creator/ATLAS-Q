from fastapi import APIRouter, Response, Query
from backend.services.scenario_service import build_scenario_timesteps
from backend.services.report_service import generate_csv_report, generate_html_printable_report

router = APIRouter(prefix="/api/reports", tags=["Incident Reports"])

@router.get("/csv")
def download_csv_report(scenario: str = Query("kalbaishakhi")):
    """Generates and returns RFC-4180 CSV export of storm detections and kinematics."""
    data = build_scenario_timesteps(scenario)
    csv_content = generate_csv_report(data)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=atlasq_report_{scenario}.csv"}
    )

@router.get("/html")
def view_html_report(scenario: str = Query("kalbaishakhi")):
    """Generates and displays styled, printable HTML incident report."""
    data = build_scenario_timesteps(scenario)
    html_content = generate_html_printable_report(data)
    return Response(
        content=html_content,
        media_type="text/html"
    )

@router.get("/summary")
def get_report_summary(scenario: str = Query("kalbaishakhi")):
    """Returns JSON summary of scenario incident report."""
    data = build_scenario_timesteps(scenario)
    return {
        "status": "ok",
        "scenario": data.get("scenario"),
        "total_timesteps": data.get("total_steps"),
        "provenance": "SIMULATED_REPRODUCIBLE_SCENARIO"
    }
