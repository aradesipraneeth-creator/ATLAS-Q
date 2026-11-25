"""
ATLAS-Q Geographic Scope & Andhra Pradesh High-Detail Pilot Registry
Provides verified district, river-basin, mandal/locality samples, and explicit spatial resolution/coverage metadata.
"""

from __future__ import annotations
from typing import Dict, List, Any

REGION_COVERAGE_METADATA: Dict[str, Any] = {
    "india": {
        "id": "india",
        "name": "All India (National Intelligence)",
        "spatial_resolution_km": 25.0,
        "temporal_resolution_min": 15,
        "confidence_level": "Moderate-High (Macro-Synoptic & DWR Overlap Zones)",
        "coverage_notes": "Full national boundary coverage via INSAT-3D/3DR, Open-Meteo/GFS NWP grid, and IMD DWR radar network.",
        "camera": {"lon": 78.9629, "lat": 22.5937, "alt_m": 4800000.0}
    },
    "andhra_pradesh": {
        "id": "andhra_pradesh",
        "name": "Andhra Pradesh (High-Detail Pilot)",
        "spatial_resolution_km": 4.0,
        "temporal_resolution_min": 10,
        "confidence_level": "High (Coastal DWR + River-Basin Graph + Mandal Pilot)",
        "coverage_notes": "Enhanced district, mandal, and river-basin resolution across Coastal Andhra & Rayalaseema using Machilipatnam/Visakhapatnam DWR context and Godavari/Krishna/Pennar basin topology.",
        "camera": {"lon": 80.65, "lat": 16.35, "alt_m": 880000.0}
    }
}

# 16 Key Districts of Andhra Pradesh Pilot with physical attributes & sample mandals
AP_DISTRICTS: List[Dict[str, Any]] = [
    {
        "id": "AP-VSP", "name": "Visakhapatnam", "lat": 17.6868, "lon": 83.2185,
        "elevation_m": 45, "basin": "Coastal-North", "coastal": True,
        "mandals": ["Bheemunipatnam", "Gajuwaka", "Pendurthi"],
        "population_exposed": 215000, "critical_infra": ["Visakhapatnam Port", "Steel Plant Grid", "NH-16 Corridor"],
        "base_temp_c": 31.2, "base_humidity_pct": 84, "base_pressure_hpa": 996.4,
        "base_wind_kmh": 68.0, "base_rain_mm_hr": 38.5, "radar_dbz": 48.0, "lightning_rate": 24
    },
    {
        "id": "AP-KKD", "name": "Kakinada", "lat": 16.9891, "lon": 82.2475,
        "elevation_m": 6, "basin": "Godavari-Delta", "coastal": True,
        "mandals": ["Kakinada Rural", "Tallarevu", "Uppada"],
        "population_exposed": 340000, "critical_infra": ["Kakinada Deep Water Port", "Godavari Gas Terminal", "Coastal Embankment"],
        "base_temp_c": 30.8, "base_humidity_pct": 89, "base_pressure_hpa": 992.1,
        "base_wind_kmh": 88.0, "base_rain_mm_hr": 62.0, "radar_dbz": 53.5, "lightning_rate": 42
    },
    {
        "id": "AP-KNS", "name": "Konaseema (Amalapuram)", "lat": 16.5787, "lon": 82.0061,
        "elevation_m": 4, "basin": "Godavari-Delta", "coastal": True,
        "mandals": ["Amalapuram", "Mummidivaram", "Razole"],
        "population_exposed": 295000, "critical_infra": ["Dowleswaram Barrage Canal Network", "NH-216", "Deltaic Bridges"],
        "base_temp_c": 30.4, "base_humidity_pct": 91, "base_pressure_hpa": 991.5,
        "base_wind_kmh": 92.0, "base_rain_mm_hr": 74.0, "radar_dbz": 55.0, "lightning_rate": 46
    },
    {
        "id": "AP-EGD", "name": "East Godavari (Rajahmundry)", "lat": 17.0005, "lon": 81.8040,
        "elevation_m": 22, "basin": "Godavari-Main", "coastal": False,
        "mandals": ["Rajahmundry Urban", "Kadiam", "Kovvur"],
        "population_exposed": 180000, "critical_infra": ["Godavari Rail-Cum-Road Bridge", "Dowleswaram Barrage"],
        "base_temp_c": 31.5, "base_humidity_pct": 82, "base_pressure_hpa": 995.8,
        "base_wind_kmh": 62.0, "base_rain_mm_hr": 48.0, "radar_dbz": 49.5, "lightning_rate": 31
    },
    {
        "id": "AP-ELR", "name": "Eluru", "lat": 16.7107, "lon": 81.0952,
        "elevation_m": 18, "basin": "Kolleru-Krishna", "coastal": False,
        "mandals": ["Eluru", "Kaikaluru", "Bhimadole"],
        "population_exposed": 145000, "critical_infra": ["Kolleru Lake Spillway", "NH-16"],
        "base_temp_c": 31.8, "base_humidity_pct": 80, "base_pressure_hpa": 997.0,
        "base_wind_kmh": 54.0, "base_rain_mm_hr": 42.0, "radar_dbz": 46.5, "lightning_rate": 28
    },
    {
        "id": "AP-KRS", "name": "Krishna (Machilipatnam)", "lat": 16.1875, "lon": 81.1389,
        "elevation_m": 5, "basin": "Krishna-Delta", "coastal": True,
        "mandals": ["Machilipatnam", "Avanigadda", "Nagayalanka"],
        "population_exposed": 310000, "critical_infra": ["Machilipatnam DWR Station", "Krishna Estuary Bunds", "NH-65"],
        "base_temp_c": 30.2, "base_humidity_pct": 92, "base_pressure_hpa": 990.8,
        "base_wind_kmh": 95.0, "base_rain_mm_hr": 78.5, "radar_dbz": 56.2, "lightning_rate": 51
    },
    {
        "id": "AP-NTR", "name": "NTR (Vijayawada)", "lat": 16.5062, "lon": 80.6480,
        "elevation_m": 24, "basin": "Krishna-Main", "coastal": False,
        "mandals": ["Vijayawada Central", "Ibrahimpatnam", "Kankipadu"],
        "population_exposed": 420000, "critical_infra": ["Prakasam Barrage", "Budameru Drain", "Vijayawada Rail Hub"],
        "base_temp_c": 32.1, "base_humidity_pct": 79, "base_pressure_hpa": 996.2,
        "base_wind_kmh": 58.0, "base_rain_mm_hr": 54.0, "radar_dbz": 50.8, "lightning_rate": 38
    },
    {
        "id": "AP-GNT", "name": "Guntur", "lat": 16.3067, "lon": 80.4365,
        "elevation_m": 32, "basin": "Krishna-Delta", "coastal": False,
        "mandals": ["Guntur East", "Mangalagiri", "Tenali"],
        "population_exposed": 210000, "critical_infra": ["Guntur Canal Headworks", "AIIMS Mangalagiri Corridor"],
        "base_temp_c": 32.4, "base_humidity_pct": 76, "base_pressure_hpa": 997.4,
        "base_wind_kmh": 52.0, "base_rain_mm_hr": 44.0, "radar_dbz": 47.0, "lightning_rate": 29
    },
    {
        "id": "AP-BPT", "name": "Bapatla", "lat": 15.9044, "lon": 80.4675,
        "elevation_m": 6, "basin": "Krishna-Delta", "coastal": True,
        "mandals": ["Bapatla", "Chirala", "Repalle"],
        "population_exposed": 265000, "critical_infra": ["Suryalanka Coastal Belt", "Nizampatnam Fishing Harbour"],
        "base_temp_c": 30.5, "base_humidity_pct": 88, "base_pressure_hpa": 993.0,
        "base_wind_kmh": 84.0, "base_rain_mm_hr": 66.0, "radar_dbz": 52.8, "lightning_rate": 41
    },
    {
        "id": "AP-PKM", "name": "Prakasam (Ongole)", "lat": 15.5057, "lon": 80.0499,
        "elevation_m": 15, "basin": "Gundlakamma", "coastal": True,
        "mandals": ["Ongole", "Kothapatnam", "Singarayakonda"],
        "population_exposed": 175000, "critical_infra": ["Gundlakamma Reservoir", "NH-16 Coastal Highway"],
        "base_temp_c": 31.6, "base_humidity_pct": 81, "base_pressure_hpa": 997.8,
        "base_wind_kmh": 64.0, "base_rain_mm_hr": 39.0, "radar_dbz": 45.2, "lightning_rate": 22
    },
    {
        "id": "AP-NLR", "name": "SPSR Nellore", "lat": 14.4426, "lon": 79.9865,
        "elevation_m": 18, "basin": "Pennar-Delta", "coastal": True,
        "mandals": ["Nellore Rural", "Krishnapatnam", "Kavali"],
        "population_exposed": 250000, "critical_infra": ["Somasila-Pennar Barrage", "Krishnapatnam Port", "NH-16"],
        "base_temp_c": 31.0, "base_humidity_pct": 85, "base_pressure_hpa": 998.2,
        "base_wind_kmh": 60.0, "base_rain_mm_hr": 45.0, "radar_dbz": 46.8, "lightning_rate": 26
    },
    {
        "id": "AP-TPT", "name": "Tirupati", "lat": 13.6288, "lon": 79.4192,
        "elevation_m": 162, "basin": "Swarnamukhi", "coastal": False,
        "mandals": ["Tirupati Urban", "Srikalahasti", "Gudur"],
        "population_exposed": 160000, "critical_infra": ["Tirupati Airport", "Swarnamukhi River Crossing"],
        "base_temp_c": 31.4, "base_humidity_pct": 74, "base_pressure_hpa": 1000.2,
        "base_wind_kmh": 42.0, "base_rain_mm_hr": 28.0, "radar_dbz": 41.0, "lightning_rate": 18
    },
    {
        "id": "AP-SKL", "name": "Srikakulam", "lat": 18.2949, "lon": 83.8938,
        "elevation_m": 12, "basin": "Vamsadhara-Nagavali", "coastal": True,
        "mandals": ["Srikakulam", "Kalingapatnam", "Ichchapuram"],
        "population_exposed": 195000, "critical_infra": ["Vamsadhara Barrage", "Kalingapatnam Coast"],
        "base_temp_c": 30.6, "base_humidity_pct": 86, "base_pressure_hpa": 997.1,
        "base_wind_kmh": 66.0, "base_rain_mm_hr": 41.0, "radar_dbz": 47.4, "lightning_rate": 25
    },
    {
        "id": "AP-VZM", "name": "Vizianagaram", "lat": 18.1067, "lon": 83.3956,
        "elevation_m": 74, "basin": "Nagavali-Champavati", "coastal": False,
        "mandals": ["Vizianagaram", "Bobbili", "Bhogapuram"],
        "population_exposed": 120000, "critical_infra": ["Thotapalli Barrage", "NH-26"],
        "base_temp_c": 31.2, "base_humidity_pct": 78, "base_pressure_hpa": 998.5,
        "base_wind_kmh": 48.0, "base_rain_mm_hr": 32.0, "radar_dbz": 43.0, "lightning_rate": 20
    },
    {
        "id": "AP-KNL", "name": "Kurnool", "lat": 15.8281, "lon": 78.0373,
        "elevation_m": 274, "basin": "Tungabhadra-Krishna", "coastal": False,
        "mandals": ["Kurnool", "Nandyal", "Adoni"],
        "population_exposed": 110000, "critical_infra": ["Srisailam Upstream Flow Gauge", "NH-44"],
        "base_temp_c": 34.0, "base_humidity_pct": 62, "base_pressure_hpa": 1001.5,
        "base_wind_kmh": 34.0, "base_rain_mm_hr": 18.0, "radar_dbz": 36.5, "lightning_rate": 14
    },
    {
        "id": "AP-ATP", "name": "Anantapur", "lat": 14.6819, "lon": 77.6006,
        "elevation_m": 335, "basin": "Pennar-Upper", "coastal": False,
        "mandals": ["Anantapur", "Dharmavaram", "Tadipatri"],
        "population_exposed": 75000, "critical_infra": ["Upper Pennar Catchment", "NH-44"],
        "base_temp_c": 34.8, "base_humidity_pct": 54, "base_pressure_hpa": 1002.4,
        "base_wind_kmh": 28.0, "base_rain_mm_hr": 10.0, "radar_dbz": 31.0, "lightning_rate": 8
    }
]

# Physically justified directed river-basin flow edges (Upstream -> Downstream)
AP_RIVER_EDGES: List[Dict[str, Any]] = [
    {"from": "AP-EGD", "to": "AP-KNS", "river": "Godavari", "type": "river_downstream", "weight": 0.92},
    {"from": "AP-EGD", "to": "AP-KKD", "river": "Godavari-East", "type": "river_downstream", "weight": 0.85},
    {"from": "AP-KNL", "to": "AP-NTR", "river": "Krishna", "type": "river_downstream", "weight": 0.88},
    {"from": "AP-NTR", "to": "AP-KRS", "river": "Krishna-Delta", "type": "river_downstream", "weight": 0.95},
    {"from": "AP-NTR", "to": "AP-GNT", "river": "Krishna-Right", "type": "river_downstream", "weight": 0.82},
    {"from": "AP-GNT", "to": "AP-BPT", "river": "Krishna-Estuary", "type": "river_downstream", "weight": 0.86},
    {"from": "AP-ATP", "to": "AP-NLR", "river": "Pennar", "type": "river_downstream", "weight": 0.78},
    {"from": "AP-VZM", "to": "AP-SKL", "river": "Nagavali", "type": "river_downstream", "weight": 0.84}
]

def get_ap_district_by_id(district_id: str) -> Dict[str, Any] | None:
    for d in AP_DISTRICTS:
        if d["id"] == district_id:
            return d
    return None
