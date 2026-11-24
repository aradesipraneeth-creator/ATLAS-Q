/**
 * ATLAS-Q Full-Stack API Client
 * Relative /api endpoints for unified Render deployment and Vite dev proxy.
 */

const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
  }
  return response.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  return handleResponse(res);
}

export async function fetchStorms() {
  const res = await fetch(`${API_BASE}/storms`);
  return handleResponse(res);
}

export async function fetchStormDetail(stormId) {
  const res = await fetch(`${API_BASE}/storms/${encodeURIComponent(stormId)}`);
  return handleResponse(res);
}

export async function fetchRiskAnalysis() {
  const res = await fetch(`${API_BASE}/risk`);
  return handleResponse(res);
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/risk/alerts`);
  return handleResponse(res);
}

export async function fetchArchitecture() {
  const res = await fetch(`${API_BASE}/architecture`);
  return handleResponse(res);
}

export async function fetchWeatherStations() {
  const res = await fetch(`${API_BASE}/weather/stations`);
  return handleResponse(res);
}

export async function fetchRadarGrid(scenario = "kalbaishakhi", gridSize = 32) {
  const res = await fetch(`${API_BASE}/detection/grid?scenario=${scenario}&grid_size=${gridSize}`);
  return handleResponse(res);
}

export async function runStormDetection(scenario = "kalbaishakhi", thresholdDbz = 35.0) {
  const res = await fetch(`${API_BASE}/detection/run?scenario=${scenario}&threshold_dbz=${thresholdDbz}`);
  return handleResponse(res);
}

export async function fetchLiveTracking(scenario = "kalbaishakhi") {
  const res = await fetch(`${API_BASE}/tracking/live?scenario=${scenario}`);
  return handleResponse(res);
}

export async function fetchLightningAnalysis() {
  const res = await fetch(`${API_BASE}/lightning/analysis`);
  return handleResponse(res);
}

export async function runOptimizationBenchmark(iterations = 60, seed = 42) {
  const res = await fetch(`${API_BASE}/optimization/benchmark?iterations=${iterations}&seed=${seed}`);
  return handleResponse(res);
}

export async function fetchScenariosCatalog() {
  const res = await fetch(`${API_BASE}/scenarios/catalog`);
  return handleResponse(res);
}

export async function fetchScenarioTimeline(scenarioId = "kalbaishakhi") {
  const res = await fetch(`${API_BASE}/scenarios/${encodeURIComponent(scenarioId)}`);
  return handleResponse(res);
}

export function getReportCsvUrl(scenario = "kalbaishakhi") {
  return `${API_BASE}/reports/csv?scenario=${encodeURIComponent(scenario)}`;
}

export function getReportHtmlUrl(scenario = "kalbaishakhi") {
  return `${API_BASE}/reports/html?scenario=${encodeURIComponent(scenario)}`;
}
