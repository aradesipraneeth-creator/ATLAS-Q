"""
ATLAS-Q Liquid Neural Network (LNN) Temporal Atmospheric Modelling Engine
Implements Closed-form Continuous-time (CfC) / Liquid Time-Constant (LTC) state-space dynamics
for continuous-time atmospheric sequence forecasting without future data leakage.
"""

from __future__ import annotations
import json
import math
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime, timezone

MODEL_ARTIFACT_PATH = Path(__file__).resolve().parent.parent / "models" / "lnn_cfc_v1.json"

def load_lnn_artifact() -> Dict[str, Any]:
    with open(MODEL_ARTIFACT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def sigmoid(x: float) -> float:
    x = max(-20.0, min(20.0, x))
    return 1.0 / (1.0 + math.exp(-x))

def normalize_features(obs: Dict[str, float]) -> List[float]:
    """Normalizes raw atmospheric observations into bounded [0, 1] feature vector."""
    return [
        (obs.get("temp_c", 30.0) - 20.0) / 25.0,
        obs.get("humidity_pct", 75.0) / 100.0,
        (obs.get("pressure_hpa", 1000.0) - 960.0) / 60.0,
        obs.get("wind_kmh", 40.0) / 150.0,
        obs.get("rain_mm_hr", 20.0) / 120.0,
        obs.get("radar_dbz", 40.0) / 70.0,
        obs.get("lightning_rate", 20.0) / 100.0,
        obs.get("cape_j_kg", 2000.0) / 4500.0
    ]

def run_cfc_step(
    h_prev: List[float],
    x_norm: List[float],
    dt_seconds: float,
    artifact: Dict[str, Any]
) -> tuple[List[float], List[float]]:
    """
    Closed-form Continuous-time (CfC) integration step:
      h(t + dt) = h_prev * exp(-dt / tau_eff) + A * (1 - exp(-dt / tau_eff))
    where tau_eff adapts dynamically to incoming atmospheric forcing (liquid time constant).
    """
    w_backbone = artifact["backbone_weights"]
    w_gate = artifact["time_gate_weights"]
    tau_bases = artifact["tau_base_sec"]

    forcing = sum(x_norm[i] * w_backbone[i] for i in range(len(x_norm)))
    gate_drive = sum(x_norm[i] * w_gate[i] for i in range(len(x_norm)))

    h_next = []
    tau_effs = []
    for k, h_k in enumerate(h_prev):
        tau_eff = tau_bases[k] / (1.0 + 1.5 * sigmoid(gate_drive + 0.1 * k))
        decay = math.exp(-dt_seconds / max(10.0, tau_eff))
        target_state = math.tanh(forcing + 0.25 * h_k)
        h_val = h_k * decay + target_state * (1.0 - decay)
        h_next.append(round(h_val, 4))
        tau_effs.append(round(tau_eff, 1))

    return h_next, tau_effs

def run_lnn_temporal_forecast(
    location_name: str = "Konaseema (AP-KNS)",
    sequence_obs: List[Dict[str, float]] | None = None
) -> Dict[str, Any]:
    """
    Executes causal CfC/LNN forward rollout over historical sequence (T-60m to T-0)
    and projects atmospheric instability, rainfall rate, and lightning probability out to +60m.
    """
    artifact = load_lnn_artifact()

    # Deterministic causal historical sequence if not supplied
    if not sequence_obs:
        sequence_obs = [
            {"time": "T-60m", "temp_c": 31.8, "humidity_pct": 80, "pressure_hpa": 995.2, "wind_kmh": 58, "rain_mm_hr": 24, "radar_dbz": 41.0, "lightning_rate": 16, "cape_j_kg": 2600},
            {"time": "T-45m", "temp_c": 31.4, "humidity_pct": 83, "pressure_hpa": 994.4, "wind_kmh": 66, "rain_mm_hr": 36, "radar_dbz": 45.5, "lightning_rate": 24, "cape_j_kg": 2950},
            {"time": "T-30m", "temp_c": 31.0, "humidity_pct": 86, "pressure_hpa": 993.2, "wind_kmh": 75, "rain_mm_hr": 49, "radar_dbz": 49.8, "lightning_rate": 33, "cape_j_kg": 3250},
            {"time": "T-15m", "temp_c": 30.7, "humidity_pct": 89, "pressure_hpa": 992.3, "wind_kmh": 84, "rain_mm_hr": 61, "radar_dbz": 52.6, "lightning_rate": 41, "cape_j_kg": 3400},
            {"time": "T-0",   "temp_c": 30.4, "humidity_pct": 91, "pressure_hpa": 991.5, "wind_kmh": 92, "rain_mm_hr": 74, "radar_dbz": 55.0, "lightning_rate": 46, "cape_j_kg": 3550}
        ]

    h_state = [0.0] * artifact["state_dim"]
    liquid_history = []
    latest_taus = artifact["tau_base_sec"]

    # Causal forward pass over historical window (no future leakage)
    for step in sequence_obs:
        x_norm = normalize_features(step)
        h_state, latest_taus = run_cfc_step(h_state, x_norm, dt_seconds=900.0, artifact=artifact)
        instability_idx = round(sigmoid(sum(h_state) * 1.15), 3)
        liquid_history.append({
            "time": step["time"],
            "observed_dbz": step["radar_dbz"],
            "observed_rain_mm_hr": step["rain_mm_hr"],
            "latent_instability_index": instability_idx,
            "dominant_tau_sec": latest_taus[0]
        })

    # Continuous-time forecast rollout (+15m, +30m, +60m)
    last_obs = dict(sequence_obs[-1])
    forecast_windows = []
    for lead_min in [15, 30, 60]:
        dt_sec = lead_min * 60.0
        x_norm = normalize_features(last_obs)
        h_roll, taus_roll = run_cfc_step(h_state, x_norm, dt_seconds=dt_sec, artifact=artifact)
        latent_drive = sum(h_roll) / len(h_roll)

        # Bounded physical projections with growing uncertainty
        lightning_prob = round(min(0.96, max(0.08, sigmoid(latent_drive * 1.4 + 0.35))), 3)
        proj_rain = round(max(0.0, last_obs["rain_mm_hr"] * (1.0 + 0.14 * latent_drive) - (0.12 * lead_min)), 1)
        proj_dbz = round(min(62.0, max(20.0, last_obs["radar_dbz"] + 2.5 * latent_drive - 0.04 * lead_min)), 1)
        proj_wind = round(max(15.0, last_obs["wind_kmh"] + 4.0 * latent_drive - 0.05 * lead_min), 1)
        uncertainty_pct = round(8.0 + (lead_min / 60.0) * 18.0, 1)

        forecast_windows.append({
            "lead_time": f"+{lead_min}m",
            "lead_minutes": lead_min,
            "lightning_probability": lightning_prob,
            "predicted_rain_mm_hr": proj_rain,
            "predicted_dbz": proj_dbz,
            "predicted_wind_kmh": proj_wind,
            "adaptive_tau_sec": taus_roll[0],
            "uncertainty_band_pct": uncertainty_pct
        })

    return {
        "model_id": artifact["model_id"],
        "architecture": artifact["architecture"],
        "location": location_name,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "data_provenance": "PREDICTED (Prototype CfC/LNN Continuous-Time Rollout)",
        "training_status": artifact["training_protocol"]["status"],
        "chronological_split": artifact["training_protocol"]["chronological_split"],
        "input_features": artifact["input_features"],
        "adaptive_time_constants_sec": latest_taus,
        "historical_state_trace": liquid_history,
        "forecast_outlook": forecast_windows,
        "scientific_note": "LNN outputs represent prototype continuous-time state-space dynamics calibrated for research evaluation; they do not replace official IMD nowcasts."
    }
