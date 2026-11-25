"""
ATLAS-Q Geographic Graph Neural Network (ST-GNN / GAT) Engine
Models spatial hazard propagation across Indian districts and river basins using physically
justified spatial adjacency and upstream-to-downstream hydrological edges.
"""

from __future__ import annotations
import math
from typing import Dict, List, Any
from datetime import datetime, timezone
from backend.services.ap_pilot_data import AP_DISTRICTS, AP_RIVER_EDGES

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2)
    return R * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

def sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-20.0, min(20.0, x))))

def build_ap_atmospheric_graph() -> Dict[str, Any]:
    """
    Constructs physically justified graph:
    - Nodes: 16 Andhra Pradesh districts with meteorological & topographic features
    - Edges: Geographic proximity (<= 145 km) + Directed River Upstream->Downstream edges
    """
    edges: List[Dict[str, Any]] = []
    seen_pairs = set()

    # 1. Directed River-Basin Hydrological Edges
    for re in AP_RIVER_EDGES:
        edges.append({
            "source": re["from"],
            "target": re["to"],
            "edge_type": "river_downstream",
            "label": f"{re['river']} Flow",
            "weight": re["weight"]
        })
        seen_pairs.add((re["from"], re["to"]))

    # 2. Spatial Meteorological Adjacency Edges (Haversine <= 145 km)
    for i, u in enumerate(AP_DISTRICTS):
        for j, v in enumerate(AP_DISTRICTS):
            if i >= j:
                continue
            dist = haversine_km(u["lat"], u["lon"], v["lat"], v["lon"])
            if dist <= 145.0:
                prox_weight = round(max(0.25, 1.0 - (dist / 160.0)), 3)
                if (u["id"], v["id"]) not in seen_pairs:
                    edges.append({
                        "source": u["id"],
                        "target": v["id"],
                        "edge_type": "spatial_adjacency",
                        "distance_km": round(dist, 1),
                        "weight": prox_weight
                    })
                if (v["id"], u["id"]) not in seen_pairs:
                    edges.append({
                        "source": v["id"],
                        "target": u["id"],
                        "edge_type": "spatial_adjacency",
                        "distance_km": round(dist, 1),
                        "weight": prox_weight
                    })

    return {"nodes": AP_DISTRICTS, "edges": edges}

def run_gnn_spatial_inference(cyclone_wind_boost: float = 1.0, rain_multiplier: float = 1.0) -> Dict[str, Any]:
    """
    Executes 2-layer Graph Attention Network (GAT) message passing across the AP geographic graph.
    Propagates coastal cyclone forcing, convective dBZ, and upstream rainfall downstream.
    """
    graph = build_ap_atmospheric_graph()
    nodes = graph["nodes"]
    edges = graph["edges"]

    # Initial Node Feature Vectors: [rain_norm, wind_norm, dbz_norm, lightning_norm, low_elev_norm]
    h0: Dict[str, List[float]] = {}
    for n in nodes:
        rain_val = n["base_rain_mm_hr"] * rain_multiplier
        wind_val = n["base_wind_kmh"] * cyclone_wind_boost
        elev_vuln = max(0.05, 1.0 - (min(n["elevation_m"], 250.0) / 250.0))
        h0[n["id"]] = [
            min(1.5, rain_val / 80.0),
            min(1.5, wind_val / 100.0),
            min(1.2, n["radar_dbz"] / 60.0),
            min(1.2, n["lightning_rate"] / 50.0),
            elev_vuln
        ]

    # Build incoming adjacency list
    incoming: Dict[str, List[Dict[str, Any]]] = {n["id"]: [] for n in nodes}
    for e in edges:
        incoming[e["target"]].append(e)

    # Layer 1 & Layer 2 Message Passing with Graph Attention coefficients
    h_curr = {k: list(v) for k, v in h0.items()}
    attention_highlights: Dict[str, float] = {}

    for _layer in range(2):
        h_next: Dict[str, List[float]] = {}
        for n in nodes:
            nid = n["id"]
            self_feat = h_curr[nid]
            inc_edges = incoming[nid]

            if not inc_edges:
                h_next[nid] = self_feat
                continue

            # Compute unnormalized attention scores e_ij
            raw_scores = []
            for e in inc_edges:
                src_feat = h_curr[e["source"]]
                # Stronger attention for river downstream & high upstream rainfall/wind
                river_bonus = 0.45 if e["edge_type"] == "river_downstream" else 0.0
                score = e["weight"] * (0.6 * src_feat[0] + 0.4 * src_feat[1] + river_bonus)
                raw_scores.append(math.exp(min(5.0, score)))

            denom = sum(raw_scores) + 1e-6
            agg = [0.0] * 5
            max_alpha = 0.0
            for idx, e in enumerate(inc_edges):
                alpha_ij = raw_scores[idx] / denom
                max_alpha = max(max_alpha, alpha_ij)
                src_feat = h_curr[e["source"]]
                for f_idx in range(5):
                    agg[f_idx] += alpha_ij * src_feat[f_idx]

            attention_highlights[nid] = round(max_alpha, 3)

            # Residual GAT update with ReLU/tanh bounding
            updated = [
                round(0.65 * self_feat[f_idx] + 0.35 * agg[f_idx], 4)
                for f_idx in range(5)
            ]
            h_next[nid] = updated
        h_curr = h_next

    # Decode Spatial Hazard Outputs per District
    district_predictions = []
    for n in nodes:
        nid = n["id"]
        emb = h_curr[nid]
        # Composite spatial hazard score (0-100)
        raw_hazard = 0.30 * emb[0] + 0.25 * emb[1] + 0.20 * emb[2] + 0.10 * emb[3] + 0.15 * emb[4]
        hazard_score = round(min(98.0, max(5.0, raw_hazard * 76.0)), 1)
        lightning_prob = round(min(0.95, max(0.08, sigmoid((emb[2] + emb[3]) * 1.4 - 0.6))), 3)
        flood_suscept = round(min(0.96, max(0.05, sigmoid((emb[0] * 1.6 + emb[4] * 1.1) - 0.9))), 3)

        risk_tier = (
            "CRITICAL" if hazard_score >= 75 else
            "HIGH" if hazard_score >= 58 else
            "MODERATE" if hazard_score >= 38 else
            "LOW"
        )

        district_predictions.append({
            "id": nid,
            "name": n["name"],
            "lat": n["lat"],
            "lon": n["lon"],
            "basin": n["basin"],
            "coastal": n["coastal"],
            "elevation_m": n["elevation_m"],
            "mandals": n["mandals"],
            "population_exposed": n["population_exposed"],
            "critical_infra": n["critical_infra"],
            "gnn_hazard_score": hazard_score,
            "risk_tier": risk_tier,
            "localized_lightning_prob": lightning_prob,
            "flood_susceptibility": flood_suscept,
            "modelled_rain_mm_hr": round(n["base_rain_mm_hr"] * rain_multiplier, 1),
            "modelled_wind_kmh": round(n["base_wind_kmh"] * cyclone_wind_boost, 1),
            "peak_neighbor_attention": attention_highlights.get(nid, 0.0)
        })

    # Sort highest hazard first
    district_predictions.sort(key=lambda x: x["gnn_hazard_score"], reverse=True)

    return {
        "model_id": "atlasq-stgat-ap-v1.0.0",
        "architecture": "2-Layer Spatiotemporal Graph Attention Network (ST-GAT)",
        "region": "Andhra Pradesh High-Detail Pilot (16 Districts)",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "data_provenance": "DERIVED / PREDICTED (Prototype GNN Message Passing)",
        "graph_stats": {
            "num_nodes": len(nodes),
            "num_edges": len(edges),
            "river_basin_edges": len(AP_RIVER_EDGES),
            "spatial_adjacency_edges": len(edges) - len(AP_RIVER_EDGES)
        },
        "edges": edges,
        "district_predictions": district_predictions
    }
