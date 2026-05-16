// All API calls go through this file.
// Vite proxy forwards /api → http://localhost:5000/api during dev.
// In production, set VITE_API_URL in .env and replace BASE_URL.

const BASE = 'https://mapvision-backend.onrender.com/api';

async function req(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data.data;
}

export const fetchMarkers   = (cat = '') =>
  req(`${BASE}/markers${cat ? `?category=${cat}` : ''}`);

export const fetchMarkerById = (id) => req(`${BASE}/markers/${id}`);

export const searchPlaces   = (q) =>
  req(`${BASE}/search?q=${encodeURIComponent(q)}`);

export const getDirections  = (from, to, mode = 'drive') =>
  req(`${BASE}/directions?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&mode=${mode}`);

export const fetchSaved     = () => req(`${BASE}/saved`);

export const savePlace      = (place) =>
  fetch(`${BASE}/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(place),
  }).then(r => r.json()).then(d => d.data);

export const unsavePlace    = (id) =>
  fetch(`${BASE}/saved/${id}`, { method: 'DELETE' }).then(r => r.json());
