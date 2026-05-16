import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { fetchMarkers } from '../../services/api';
import './MapView.css';

const TILES = {
  dark:      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  standard:  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain:   'https://tile.opentopomap.org/{z}/{x}/{y}.png',
};

const makePin = (emoji) =>
  L.divIcon({
    html: `<div class="mv-pin"><span>${emoji}</span></div>`,
    iconSize: [42, 42], iconAnchor: [21, 42], className: '',
  });

export default function MapView() {
  const containerRef  = useRef(null);
  const mapRef        = useRef(null);
  const layersRef     = useRef({});
  const userPinRef    = useRef(null);

  const { setMapRef, currentLayer, setActivePlace, showToast } = useApp();

  /* ── Init map once ── */
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([23.033, 72.585], 13);

    Object.entries(TILES).forEach(([key, url]) => {
      layersRef.current[key] = L.tileLayer(url);
    });
    layersRef.current.dark.addTo(map);

    map.on('click', () => setActivePlace(null));

    mapRef.current = map;
    setMapRef(map);

    /* Load markers from backend */
    fetchMarkers()
      .then((list) =>
        list.forEach((m) =>
          L.marker([m.lat, m.lng], { icon: makePin(m.emoji) })
            .addTo(map)
            .on('click', (e) => { e.originalEvent.stopPropagation(); setActivePlace(m); })
        )
      )
      .catch(() => showToast('⚠️ Could not load markers'));

    /* Try geolocation after 600 ms */
    setTimeout(() => geolocate(map, userPinRef, showToast), 600);

    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line

  /* ── Swap tile layer ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(layersRef.current).forEach((l) => { try { map.removeLayer(l); } catch {} });
    layersRef.current[currentLayer]?.addTo(map);
  }, [currentLayer]);

  return <div ref={containerRef} className="mapview-root" />;
}

function geolocate(map, pinRef, showToast) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      if (pinRef.current) map.removeLayer(pinRef.current);
      pinRef.current = L.marker([coords.latitude, coords.longitude], { icon: L.divIcon({
        html: '<div class="mv-user-pin"></div>', iconSize:[16,16], iconAnchor:[8,8], className:''
      })}).addTo(map);
      map.flyTo([coords.latitude, coords.longitude], 15, { duration: 1.4 });
      showToast('📍 Location found!');
    },
    () => {
      map.flyTo([23.033, 72.585], 14, { duration: 1.2 });
      showToast('Showing Ahmedabad (location denied)');
    }
  );
}
