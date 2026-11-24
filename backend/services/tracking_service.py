"""
ATLAS-Q Storm Tracking & Trajectory Nowcast Engine
Consecutive Observation Centroid Matching, Kinematic Displacement Estimation,
and 0–60 Minute Extrapolation with Calibrated Uncertainty Cones.
"""

from __future__ import annotations
import math
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two geographic coordinates in kilometers."""
    R = 6371.0 # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def compute_kinematics(
    lat_prev: float, lon_prev: float,
    lat_curr: float, lon_curr: float,
    delta_minutes: float = 10.0
) -> Dict[str, Any]:
    """Computes speed (km/h), heading (0-360 deg), and compass direction between consecutive positions."""
    dist_km = haversine_distance_km(lat_prev, lon_prev, lat_curr, lon_curr)
    speed_kmh = (dist_km / delta_minutes) * 60.0

    # Direction angle (azimuth clockwise from North)
    dlon = math.radians(lon_curr - lon_prev)
    lat1 = math.radians(lat_prev)
    lat2 = math.radians(lat_curr)

    y = math.sin(dlon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    bearing_rad = math.atan2(y, x)
    heading_deg = (math.degrees(bearing_rad) + 360.0) % 360.0

    # Compass string
    compass_sectors = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                       "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    idx = int((heading_deg + 11.25) / 22.5) % 16
    compass = compass_sectors[idx]

    return {
        "speed_kmh": round(speed_kmh, 1),
        "heading_deg": round(heading_deg, 1),
        "compass": compass,
        "displacement_km": round(dist_km, 2)
    }

def match_and_track_cells(
    previous_cells: List[Dict[str, Any]],
    current_cells: List[Dict[str, Any]],
    delta_minutes: float = 10.0,
    max_search_radius_km: float = 35.0
) -> List[Dict[str, Any]]:
    """
    Performs nearest-neighbor spatial matching between consecutive observation cycles.
    Maintains persistent storm cell identities across time-steps.
    """
    matched_tracks = []
    used_prev_indices = set()

    for curr in current_cells:
        best_prev = None
        best_dist = float("inf")
        best_idx = -1

        for idx, prev in enumerate(previous_cells):
            if idx in used_prev_indices:
                continue
            dist = haversine_distance_km(prev["lat"], prev["lon"], curr["lat"], curr["lon"])
            if dist < max_search_radius_km and dist < best_dist:
                best_dist = dist
                best_prev = prev
                best_idx = idx

        if best_prev is not None:
            used_prev_indices.add(best_idx)
            # Inherit persistent cell ID from ancestor
            persistent_id = best_prev.get("id", curr["id"])
            kinematics = compute_kinematics(
                best_prev["lat"], best_prev["lon"],
                curr["lat"], curr["lon"],
                delta_minutes
            )
            # Intensity trend
            dbz_delta = curr["intensity_dbz"] - best_prev.get("intensity_dbz", curr["intensity_dbz"])
            trend = "Intensifying" if dbz_delta > 1.5 else "Decaying" if dbz_delta < -1.5 else "Steady"

            history = best_prev.get("history_positions", []) + [
                {"lat": best_prev["lat"], "lon": best_prev["lon"], "timestamp": best_prev.get("timestamp", "T-10m")}
            ]

            track_record = {
                **curr,
                "id": persistent_id,
                "movement_speed_kmh": kinematics["speed_kmh"],
                "movement_direction_deg": kinematics["heading_deg"],
                "movement_direction": f"{kinematics['compass']} ({kinematics['heading_deg']}°)",
                "displacement_km": kinematics["displacement_km"],
                "intensity_trend": trend,
                "dbz_delta": round(dbz_delta, 1),
                "history_positions": history,
                "tracking_status": "TRACKED"
            }
        else:
            # Newly formed convective cell
            track_record = {
                **curr,
                "movement_speed_kmh": 32.0,  # Default environmental advection
                "movement_direction_deg": 135.0,
                "movement_direction": "SE (135°)",
                "displacement_km": 0.0,
                "intensity_trend": "Newly Formed",
                "dbz_delta": 0.0,
                "history_positions": [],
                "tracking_status": "NEW_CELL"
            }

        # Generate future predicted trajectory waypoints (10m, 20m, 30m, 60m)
        predictions = generate_trajectory_prediction(
            track_record["lat"], track_record["lon"],
            track_record["movement_speed_kmh"],
            track_record["movement_direction_deg"],
            track_record["intensity_dbz"],
            track_record.get("dbz_delta", 0.0)
        )
        track_record["predicted_trajectory"] = predictions
        matched_tracks.append(track_record)

    return matched_tracks

def generate_trajectory_prediction(
    start_lat: float, start_lon: float,
    speed_kmh: float, heading_deg: float,
    current_dbz: float, dbz_trend_per_10m: float = 0.0
) -> List[Dict[str, Any]]:
    """
    Extrapolates short-term convective trajectory (0-60m) using kinematic advection
    with expanding uncertainty radius.
    """
    forecast_steps = [10, 20, 30, 45, 60]
    predictions = []

    rad = math.radians(heading_deg)
    km_per_lat = 111.0
    km_per_lon = 111.0 * math.cos(math.radians(start_lat))

    for minutes in forecast_steps:
        hours = minutes / 60.0
        dist_km = speed_kmh * hours

        # Extrapolated displacement
        dx_km = dist_km * math.sin(rad)
        dy_km = dist_km * math.cos(rad)

        pred_lat = start_lat + (dy_km / km_per_lat)
        pred_lon = start_lon + (dx_km / km_per_lon)

        # Decay extrapolation: intense cells naturally dissipate over 60 mins
        decay_factor = math.exp(-0.012 * minutes)
        projected_dbz = max(20.0, (current_dbz + (dbz_trend_per_10m * (minutes / 10.0))) * decay_factor)

        # Expanding positional uncertainty radius (km)
        uncertainty_radius_km = round(2.5 + (dist_km * 0.18), 1)

        predictions.append({
            "lead_time_minutes": minutes,
            "time_label": f"T+{minutes}m",
            "lat": round(pred_lat, 3),
            "lon": round(pred_lon, 3),
            "projected_intensity_dbz": round(projected_dbz, 1),
            "uncertainty_radius_km": uncertainty_radius_km,
            "provenance": "PREDICTED",
            "confidence_pct": round(max(35.0, 92.0 - (minutes * 0.85)), 1)
        })

    return predictions
