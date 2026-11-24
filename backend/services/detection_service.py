"""
ATLAS-Q Storm Detection Engine
Reproducible Connected-Component Spatial Clustering on Gridded Radar Reflectivity.
Calculates reflectivity-weighted centroids, area, Z_max, Z_mean, and stable cell identifiers.
"""

import math
import hashlib
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple

# Documented Meteorological Thresholds
CONVECTIVE_THRESHOLD_DBZ = 35.0  # Convective initiation threshold
SEVERE_CORE_THRESHOLD_DBZ = 50.0 # Hail / severe core threshold
MIN_CELL_PIXELS = 3              # Noise suppression threshold

def generate_radar_grid(
    scenario_type: str = "kalbaishakhi",
    center_lat: float = 22.85,
    center_lon: float = 87.95,
    grid_size: int = 32,
    cell_offset_x: float = 0.0,
    cell_offset_y: float = 0.0
) -> Tuple[List[List[float]], Dict[str, Any]]:
    """
    Generates a calibrated 2D synthetic radar reflectivity grid (dBZ) centered at (center_lat, center_lon).
    Resolution: ~5km per pixel, spanning 160km x 160km Doppler radar volume scan.
    """
    grid = [[0.0 for _ in range(grid_size)] for _ in range(grid_size)]
    
    # Define convective cores according to meteorological scenario
    if scenario_type == "kalbaishakhi":
        cores = [
            # Main squall core (Kolkata/Midnapore sector)
            {"cx": 16 + cell_offset_x, "cy": 16 + cell_offset_y, "peak_dbz": 56.4, "radius": 5.5, "elongation_x": 1.4, "elongation_y": 0.8},
            # Secondary flanking cell
            {"cx": 22 + cell_offset_x, "cy": 22 + cell_offset_y, "peak_dbz": 49.0, "radius": 4.0, "elongation_x": 1.0, "elongation_y": 1.0},
            # Developing pre-frontal pulse
            {"cx": 9 + cell_offset_x, "cy": 12 + cell_offset_y, "peak_dbz": 42.5, "radius": 3.2, "elongation_x": 0.9, "elongation_y": 1.2}
        ]
    elif scenario_type == "delhi_ncr":
        cores = [
            {"cx": 15 + cell_offset_x, "cy": 15 + cell_offset_y, "peak_dbz": 51.5, "radius": 4.5, "elongation_x": 1.1, "elongation_y": 1.1},
            {"cx": 23 + cell_offset_x, "cy": 10 + cell_offset_y, "peak_dbz": 44.0, "radius": 3.5, "elongation_x": 0.8, "elongation_y": 1.3}
        ]
    else:
        cores = [
            {"cx": 16 + cell_offset_x, "cy": 16 + cell_offset_y, "peak_dbz": 48.0, "radius": 5.0, "elongation_x": 1.0, "elongation_y": 1.0}
        ]

    for y in range(grid_size):
        for x in range(grid_size):
            dbz_val = 0.0
            for c in cores:
                dx = (x - c["cx"]) / c["elongation_x"]
                dy = (y - c["cy"]) / c["elongation_y"]
                dist = math.sqrt(dx*dx + dy*dy)
                if dist < c["radius"] * 2.2:
                    val = c["peak_dbz"] * math.exp(-0.5 * (dist / (c["radius"] * 0.55)) ** 2)
                    if val > dbz_val:
                        dbz_val = val
            # Add light background stratiform echo
            if dbz_val < 18.0 and (y % 4 == 0 or x % 4 == 0):
                dbz_val = max(dbz_val, 8.5)
            grid[y][x] = round(dbz_val, 1)

    metadata = {
        "grid_size": grid_size,
        "pixel_resolution_km": 5.0,
        "domain_width_km": grid_size * 5.0,
        "domain_height_km": grid_size * 5.0,
        "center_lat": center_lat,
        "center_lon": center_lon,
        "provenance": "SIMULATED",
        "methodology": "Gaussian Hydrodynamic Echo Synthesis"
    }

    return grid, metadata

def run_storm_detection(
    grid: List[List[float]],
    metadata: Dict[str, Any],
    threshold_dbz: float = CONVECTIVE_THRESHOLD_DBZ,
    timestamp: str = None
) -> Dict[str, Any]:
    """
    Executes connected-component spatial clustering (8-connectivity) on the radar reflectivity grid.
    Returns extracted storm cells with centroids, area, echo tops, and intensity statistics.
    """
    if timestamp is None:
        timestamp = datetime.now(timezone.utc).isoformat()

    H = len(grid)
    W = len(grid[0]) if H > 0 else 0
    visited = [[False for _ in range(W)] for _ in range(H)]

    detected_cells = []
    cell_counter = 1

    # 8-connectivity neighbors
    neighbors = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

    for y in range(H):
        for x in range(W):
            if not visited[y][x] and grid[y][x] >= threshold_dbz:
                # Connected component search (BFS)
                component = []
                queue = [(x, y)]
                visited[y][x] = True

                while queue:
                    cx, cy = queue.pop(0)
                    component.append((cx, cy, grid[cy][cx]))

                    for dx, dy in neighbors:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < W and 0 <= ny < H:
                            if not visited[ny][nx] and grid[ny][nx] >= threshold_dbz:
                                visited[ny][nx] = True
                                queue.append((nx, ny))

                # Check minimum cell size
                if len(component) >= MIN_CELL_PIXELS:
                    # Calculate reflectivity-weighted centroid
                    sum_z = sum(z for _, _, z in component)
                    weighted_x = sum(px * z for px, _, z in component) / sum_z
                    weighted_y = sum(py * z for _, py, z in component) / sum_z

                    # Map grid coordinates to geographic coordinates
                    px_km = metadata.get("pixel_resolution_km", 5.0)
                    center_lat = metadata.get("center_lat", 22.85)
                    center_lon = metadata.get("center_lon", 87.95)

                    # 1 deg lat approx 111 km, 1 deg lon approx 111 * cos(lat) km
                    km_per_lat = 111.0
                    km_per_lon = 111.0 * math.cos(math.radians(center_lat))

                    offset_x_km = (weighted_x - (W / 2.0)) * px_km
                    offset_y_km = ((H / 2.0) - weighted_y) * px_km  # Y inverted in grid

                    cell_lat = center_lat + (offset_y_km / km_per_lat)
                    cell_lon = center_lon + (offset_x_km / km_per_lon)

                    # Compute statistics
                    z_values = [z for _, _, z in component]
                    z_max = max(z_values)
                    z_mean = sum(z_values) / len(z_values)
                    area_km2 = len(component) * (px_km * px_km)

                    # Echo top height estimation empirical formula (dBZ -> km AGL)
                    echo_top_km = round(min(17.5, max(4.0, 3.5 + 0.23 * (z_max - 20.0))), 1)

                    # Stable deterministic hash identifier
                    id_seed = f"{round(cell_lat, 2)}_{round(cell_lon, 2)}_{round(z_max, 1)}"
                    stable_hash = hashlib.md5(id_seed.encode()).hexdigest()[:4].upper()
                    cell_id = f"STM-{stable_hash}"

                    risk_level = "CRITICAL" if z_max >= 52.0 else "HIGH" if z_max >= 45.0 else "MODERATE"

                    detected_cells.append({
                        "id": cell_id,
                        "sequence_index": cell_counter,
                        "centroid_grid": {"x": round(weighted_x, 2), "y": round(weighted_y, 2)},
                        "lat": round(cell_lat, 3),
                        "lon": round(cell_lon, 3),
                        "intensity_dbz": round(z_max, 1),
                        "mean_intensity_dbz": round(z_mean, 1),
                        "area_km2": round(area_km2, 1),
                        "pixel_count": len(component),
                        "echo_top_km": echo_top_km,
                        "estimated_risk": risk_level,
                        "status": "ACTIVE NOWCAST",
                        "provenance": "DERIVED",
                        "detection_threshold_dbz": threshold_dbz,
                        "timestamp": timestamp
                    })
                    cell_counter += 1

    # Sort cells by peak intensity descending
    detected_cells.sort(key=lambda c: c["intensity_dbz"], reverse=True)

    return {
        "timestamp": timestamp,
        "detection_threshold_dbz": threshold_dbz,
        "grid_metadata": metadata,
        "total_cells_detected": len(detected_cells),
        "cells": detected_cells,
        "provenance": "DERIVED",
        "methodology": "Connected-Component Spatial Clustering (8-Connectivity) with Intensity Weighting"
    }
