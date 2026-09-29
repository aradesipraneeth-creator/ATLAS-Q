/**
 * ATLAS-Q API Client
 * Uses relative `/api` paths for zero-configuration deployment on Render
 * and Vite dev proxy in local development.
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

export async function fetchArchitecture() {
  const res = await fetch(`${API_BASE}/architecture`);
  return handleResponse(res);
}
