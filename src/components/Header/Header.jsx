import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { searchPlaces } from '../../services/api';
import './Header.css';

export default function Header() {
  const { mapRef, setPanelOpen, panelOpen, trafficOn, setTrafficOn, showToast } = useApp();
  const [q, setQ]           = useState('');
  const [busy, setBusy]     = useState(false);

  const search = async () => {
    if (!q.trim()) return;
    setBusy(true);
    try {
      const res = await searchPlaces(q);
      if (res.length && mapRef) {
        mapRef.flyTo([res[0].lat, res[0].lng], 15, { duration: 1.2 });
        showToast(`📍 Found: ${res[0].name}`);
      } else showToast('No results found');
    } catch { showToast('⚠️ Search failed'); }
    finally  { setBusy(false); }
  };

  const locate = () => {
    if (!navigator.geolocation || !mapRef) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { mapRef.flyTo([coords.latitude, coords.longitude], 15, { duration: 1.4 }); showToast('📍 Location found!'); },
      () => showToast('⚠️ Location denied')
    );
  };

  return (
    <header className="hdr">
      <div className="hdr-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        Map<span>Vision</span>
      </div>

      <div className="hdr-search">
        <svg className="hdr-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search places, cities, landmarks…"
          aria-label="Search"
        />
        <button onClick={search} disabled={busy}>{busy ? '…' : 'Go'}</button>
      </div>

      <div className="hdr-actions">
        <button className={`hbtn${panelOpen ? ' on' : ''}`} onClick={() => setPanelOpen(p => !p)}>
          <span className="icon">☰</span><span className="lbl">Menu</span>
        </button>
        <button className="hbtn" onClick={locate}>
          <span className="icon">◎</span><span className="lbl">Locate</span>
        </button>
        <button className={`hbtn${trafficOn ? ' on' : ''}`} onClick={() => { setTrafficOn(t=>!t); showToast(trafficOn?'Traffic OFF':'Traffic ON'); }}>
          <span className="icon">🚦</span><span className="lbl">Traffic</span>
        </button>
      </div>
    </header>
  );
}
