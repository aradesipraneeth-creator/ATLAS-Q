from fastapi import APIRouter
from backend.services.weather_service import fetch_live_station_weather, get_all_stations_summary, STATIONS

router = APIRouter(prefix="/api/weather", tags=["Live Weather Ingestion"])

@router.get("/stations")
def list_stations():
    """Returns real-time atmospheric observations across monitored Indian meteorological stations."""
    return {
        "status": "ok",
        "stations": get_all_stations_summary(),
        "available_keys": list(STATIONS.keys())
    }

@router.get("/station/{station_key}")
def get_station(station_key: str):
    """Fetches real-time atmospheric state for a specific Indian station."""
    return fetch_live_station_weather(station_key)
