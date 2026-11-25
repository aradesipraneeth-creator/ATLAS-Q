/**
 * ATLAS-Q Shared Geographic Data Layer & In-Memory Cache
 * Ensures CinematicIntro3D and Globe3D consume the exact same verified India GeoJSON
 * assets without duplicate network requests.
 */

const geoCache = new Map();

async function fetchCachedJson(url) {
  if (geoCache.has(url)) {
    return geoCache.get(url);
  }
  const promise = fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to load geographic asset ${url}: ${res.status}`);
    }
    return res.json();
  });
  geoCache.set(url, promise);
  return promise;
}

export function loadIndiaBoundaries() {
  return fetchCachedJson('/data/geography/india-boundaries.geojson');
}

export function loadIndiaStates() {
  return fetchCachedJson('/data/geography/india-states.geojson');
}

export function loadIndiaDistricts() {
  return fetchCachedJson('/data/geography/india-districts.geojson');
}

export function loadGeographyMetadata() {
  return fetchCachedJson('/data/geography/geography-metadata.json');
}
