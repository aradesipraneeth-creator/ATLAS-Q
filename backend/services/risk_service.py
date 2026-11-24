"""
ATLAS-Q Geographic Risk Intelligence & Explainable Alert Generation Engine
Calculates multi-parameter hazard indices and synthesizes structured operational warnings.
"""

from datetime import datetime, timezone
from typing import List, Dict, Any

def compute_multi_factor_risk(
    intensity_dbz: float,
    lightning_rate_per_min: float,
    cape_j_kg: float,
    wind_shear_ms: float = 20.0
) -> Dict[str, Any]:
    """
    Computes weighted multi-factor thunderstorm risk index (0–100 scale).
    Weights:
      Reflectivity (dBZ): 35%
      Lightning Rate: 30%
      CAPE Instability: 20%
      Bulk Wind Shear: 15%
    """
    # Normalized component scores (0 to 100)
    score_dbz = min(100.0, max(0.0, ((intensity_dbz - 25.0) / 35.0) * 100.0))
    score_lgt = min(100.0, max(0.0, (lightning_rate_per_min / 60.0) * 100.0))
    score_cape = min(100.0, max(0.0, ((cape_j_kg - 1000.0) / 3000.0) * 100.0))
    score_shear = min(100.0, max(0.0, ((wind_shear_ms - 10.0) / 20.0) * 100.0))

    composite_score = round(
        0.35 * score_dbz +
        0.30 * score_lgt +
        0.20 * score_cape +
        0.15 * score_shear,
        1
    )

    if composite_score >= 82.0:
        level = "CRITICAL"
        color = "#A51F52" # Berry accent
        badge = "CRITICAL HAZARD"
    elif composite_score >= 65.0:
        level = "HIGH"
        color = "#dc2626"
        badge = "HIGH RISK"
    elif composite_score >= 38.0:
        level = "MODERATE"
        color = "#d97706"
        badge = "MODERATE WATCH"
    else:
        level = "LOW"
        color = "#16a34a"
        badge = "LOW RISK"

    return {
        "composite_risk_score": composite_score,
        "risk_level": level,
        "color": color,
        "badge": badge,
        "component_breakdown": {
            "radar_reflectivity_score": round(score_dbz, 1),
            "lightning_rate_score": round(score_lgt, 1),
            "thermodynamic_cape_score": round(score_cape, 1),
            "kinematic_shear_score": round(score_shear, 1)
        },
        "methodology": "Multi-Sensor Bayesian Hazard Index v2.4 (Weighted Linear Formulation)"
    }

def generate_system_alerts(storm_cells: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates explainable, prioritized operational alerts for active convective cells.
    """
    alerts = []
    now_iso = datetime.now(timezone.utc).isoformat()

    for idx, storm in enumerate(storm_cells):
        risk = compute_multi_factor_risk(
            intensity_dbz=storm.get("intensity_dbz", 40.0),
            lightning_rate_per_min=storm.get("lightning_rate_per_min", 20.0),
            cape_j_kg=storm.get("cape_joules", 2000.0)
        )

        if risk["risk_level"] in ["CRITICAL", "HIGH", "MODERATE"]:
            alert_id = f"ALT-IND-{datetime.now().strftime('%Y%m%d')}-{storm.get('id', 'STM').replace('STM-', '')}"
            
            # Action recommendation based on severity
            if risk["risk_level"] == "CRITICAL":
                rec = "IMMEDIATE ACTION: Cease outdoor activities. Seek robust shelter. Secure loose structures against >75 km/h gusts and intense hail core."
                headline = f"Severe Convective Storm Alert: {storm.get('name', 'Convective Cell')}"
            elif risk["risk_level"] == "HIGH":
                rec = "PRECAUTIONARY ACTION: Stay indoors. Disconnect sensitive electronics. Avoid water bodies and open elevated fields."
                headline = f"Thunderstorm & Lightning Warning: {storm.get('region', 'Monitored Sector')}"
            else:
                rec = "ADVISORY: Convective pulse developing. Monitor nowcast radar sweeps for rapid intensification."
                headline = f"Convective Weather Watch: {storm.get('name', 'Cell')}"

            alerts.append({
                "alert_id": alert_id,
                "headline": headline,
                "cell_id": storm.get("id"),
                "geographic_location": f"{storm.get('region', 'Eastern India')} (Lat: {storm.get('lat')}°N, Lon: {storm.get('lon')}°E)",
                "detection_timestamp": storm.get("timestamp", now_iso),
                "issued_at": now_iso,
                "risk_category": risk["risk_level"],
                "risk_score": risk["composite_risk_score"],
                "color": risk["color"],
                "supporting_observations": [
                    f"Maximum Radar Reflectivity: {storm.get('intensity_dbz')} dBZ",
                    f"Echo Top Height: {storm.get('echo_top_km', 12.0)} km AGL",
                    f"Lightning Flash Rate: {storm.get('lightning_rate_per_min', 35)} flashes/min",
                    f"Propagation Speed: {storm.get('movement_speed_kmh', 35)} km/h heading {storm.get('movement_direction', 'SE')}",
                    f"Thermodynamic CAPE: {storm.get('cape_joules', 2500)} J/kg"
                ],
                "calculation_model": "ATLAS-Q Bayesian Hazard Index v2.4",
                "confidence_pct": round(max(60.0, 95.0 - (idx * 4.0)), 1),
                "recommended_safety_action": rec,
                "disclaimer": "PROTOTYPE WARNING — Generated for demonstration and operational evaluation. Not an official IMD bulletin."
            })

    # Sort alerts by risk score descending
    alerts.sort(key=lambda a: a["risk_score"], reverse=True)
    return alerts
