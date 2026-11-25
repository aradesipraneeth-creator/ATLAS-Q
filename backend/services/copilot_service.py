"""
ATLAS-Q Disaster Copilot (Evidence-Grounded RAG Assistant)
Retrieves structured live outputs from LNN, GNN, Cyclone, Flood, Exposure, and QSA Optimization engines
to answer disaster-intelligence queries with explicit timestamps, provenance, and uncertainty.
"""

from __future__ import annotations
from typing import Dict, List, Any
from datetime import datetime, timezone
from backend.services.gnn_service import run_gnn_spatial_inference
from backend.services.lnn_service import run_lnn_temporal_forecast
from backend.services.flood_service import simulate_ap_flood_progression
from backend.services.cyclone_service import get_active_cyclones
from backend.services.disaster_service import get_disaster_impact_assessment, solve_disaster_resource_allocation

GUIDELINE_DISCLAIMER = (
    "DECISION-SUPPORT NOTICE: ATLAS-Q Copilot summarizes modelled research outputs and structured datasets. "
    "It does not issue official warnings or authorize evacuations; all civil actions must defer to IMD and NDMA/SDMA."
)

def query_disaster_copilot(
    question: str,
    region: str = "andhra_pradesh",
    rainfall_multiplier: float = 1.0,
    storm_surge_m: float = 1.5
) -> Dict[str, Any]:
    """
    Grounds the user's question in live structured outputs from ATLAS-Q models.
    Never fabricates districts, probabilities, or shelter counts.
    """
    q_lower = question.lower().strip()
    now_iso = datetime.now(timezone.utc).isoformat()

    # Retrieve live structured context
    gnn_out = run_gnn_spatial_inference(cyclone_wind_boost=1.0, rain_multiplier=rainfall_multiplier)
    lnn_out = run_lnn_temporal_forecast()
    flood_out = simulate_ap_flood_progression(rainfall_multiplier=rainfall_multiplier, storm_surge_m=storm_surge_m)
    cyclones = get_active_cyclones()
    impact = get_disaster_impact_assessment()

    districts = gnn_out["district_predictions"]
    high_risk_districts = [d for d in districts if d["risk_tier"] in ("CRITICAL", "HIGH")]
    evidence_refs: List[Dict[str, str]] = []

    # 1. Cyclone intersection / Andhra Pradesh districts question
    if "cyclone" in q_lower or "district" in q_lower or "wind" in q_lower:
        cyc = cyclones[0] if cyclones else None
        top_names = ", ".join(f"{d['name']} (Score: {d['gnn_hazard_score']}/100, {d['modelled_wind_kmh']} km/h)" for d in high_risk_districts[:5])
        answer = (
            f"Based on the active ST-GAT spatial graph ({gnn_out['model_id']}), {len(high_risk_districts)} Andhra Pradesh "
            f"districts currently fall in CRITICAL or HIGH hazard tiers under the active coastal scenario: {top_names}. "
        )
        if cyc:
            answer += (
                f"Active Cyclone {cyc['name']} ({cyc['current_position']['classification']['category']}) is positioned at "
                f"{cyc['current_position']['lat']}°N, {cyc['current_position']['lon']}°E with max sustained winds of "
                f"{cyc['current_position']['max_wind_kmh']} km/h and central pressure {cyc['current_position']['central_pressure_hpa']} hPa."
            )
            evidence_refs.append({
                "source": cyc["advisory_source"],
                "provenance": cyc["data_provenance"],
                "timestamp": cyc["issue_time_utc"]
            })
        evidence_refs.append({
            "source": f"ST-GAT Graph Model ({gnn_out['model_id']})",
            "provenance": gnn_out["data_provenance"],
            "timestamp": gnn_out["timestamp_utc"]
        })

    # 2. Lightning probability / 30-minute outlook question
    elif "lightning" in q_lower or "30 min" in q_lower or "thunderstorm" in q_lower:
        elevated_lt = sorted(districts, key=lambda x: x["localized_lightning_prob"], reverse=True)[:4]
        lt_list = ", ".join(f"{d['name']} ({round(d['localized_lightning_prob']*100, 1)}%)" for d in elevated_lt)
        outlook_30 = next((o for o in lnn_out["forecast_outlook"] if o["lead_minutes"] == 30), lnn_out["forecast_outlook"][0])
        answer = (
            f"Over the next 30-minute forecast window, the CfC Liquid Neural Network ({lnn_out['model_id']}) estimates a "
            f"{round(outlook_30['lightning_probability']*100, 1)}% lightning occurrence probability (±{outlook_30['uncertainty_band_pct']}% uncertainty) "
            f"for {lnn_out['location']} with adaptive time constant τ={outlook_30['adaptive_tau_sec']}s. "
            f"Spatially, the highest district-level probabilities from the ST-GAT model are: {lt_list}."
        )
        evidence_refs.append({
            "source": f"LNN CfC Engine ({lnn_out['model_id']})",
            "provenance": lnn_out["data_provenance"],
            "timestamp": lnn_out["timestamp_utc"]
        })
        evidence_refs.append({
            "source": f"ST-GAT Graph Model ({gnn_out['model_id']})",
            "provenance": gnn_out["data_provenance"],
            "timestamp": gnn_out["timestamp_utc"]
        })

    # 3. Flood simulation / settlements / depth question
    elif "flood" in q_lower or "settlement" in q_lower or "inundat" in q_lower or "rain" in q_lower:
        basins = flood_out["basins"]
        basin_summary = "; ".join(
            f"{b['name']}: peak {b['peak_water_depth_m']}m depth across {b['peak_inundated_area_km2']} km² "
            f"(exposed: {', '.join(b['exposed_settlements'][:3])})"
            for b in basins
        )
        answer = (
            f"Under the current SCS-CN hydrological simulation (rainfall multiplier {rainfall_multiplier}x, surge {storm_surge_m}m), "
            f"modelled river-basin impacts are: {basin_summary}. "
            f"Note: GNN surrogate acceleration ({flood_out['surrogate_acceleration_note']['gnn_surrogate_runtime_ms']} ms) approximates the offline physical solver."
        )
        evidence_refs.append({
            "source": f"Hydrological Flood Simulator ({flood_out['simulation_id']})",
            "provenance": flood_out["data_provenance"],
            "timestamp": flood_out["timestamp_utc"]
        })

    # 4. Shelter allocation / QSA optimization question
    elif "shelter" in q_lower or "qsa" in q_lower or "allocat" in q_lower or "optim" in q_lower or "resource" in q_lower:
        qsa = solve_disaster_resource_allocation("shelter_dispatch", 12, 4)
        answer = (
            f"Current shelter registry tracks {impact['shelters_total']} engineered facilities with total capacity of "
            f"{impact['shelter_total_capacity']:,} persons ({impact['shelter_occupancy_pct']}% occupied). "
            f"Running Quantum-Inspired Simulated Annealing (QSA, Γ=1.8) yields an objective energy of "
            f"{qsa['quantum_inspired_solution']['objective_energy_score']:.4f} in {qsa['quantum_inspired_solution']['execution_time_ms']} ms, "
            f"achieving +{qsa['comparison_metrics']['energy_improvement_pct']}% coverage improvement over the greedy baseline."
        )
        evidence_refs.append({
            "source": "QSA Resource Optimizer (Classical CPU)",
            "provenance": "DERIVED (Algorithmic Optimization Benchmark)",
            "timestamp": now_iso
        })

    # 5. General / Situation Report Summary
    else:
        top_d = districts[0]
        top_basin = flood_out["basins"][0]
        answer = (
            f"ATLAS-Q Situation Summary ({region.replace('_', ' ').title()}): "
            f"Highest spatial risk district is {top_d['name']} (ST-GAT Score {top_d['gnn_hazard_score']}/100, {top_d['risk_tier']}). "
            f"Primary hydrological stress is in {top_basin['name']} (peak {top_basin['peak_water_depth_m']}m depth). "
            f"Ask specifically about AP districts, 30-minute lightning risk, flood settlements, or QSA shelter allocation for detailed breakdowns."
        )
        evidence_refs.append({
            "source": f"ST-GAT + Hydrological Engine",
            "provenance": "DERIVED / SIMULATED",
            "timestamp": now_iso
        })

    return {
        "question": question,
        "region": region,
        "answer": answer,
        "evidence": evidence_refs,
        "disclaimer": GUIDELINE_DISCLAIMER,
        "generated_at_utc": now_iso
    }
