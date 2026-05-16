import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDirections } from '../../services/api';
import './RoutePanel.css';

const MODES = [
  { id:'drive',   icon:'🚗', label:'Drive'   },
  { id:'walk',    icon:'🚶', label:'Walk'    },
  { id:'bike',    icon:'🚲', label:'Bike'    },
  { id:'transit', icon:'🚌', label:'Transit' },
];

export default function RoutePanel() {
  const { showToast, routeResult, setRouteResult } = useApp();
  const [from, setFrom]   = useState('');
  const [to,   setTo]     = useState('');
  const [mode, setMode]   = useState('drive');
  const [busy, setBusy]   = useState(false);

  const go = async () => {
    if (!from.trim() || !to.trim()) { showToast('Enter both origin & destination'); return; }
    setBusy(true); showToast('🔄 Calculating route…');
    try {
      const r = await getDirections(from, to, mode);
      setRouteResult(r); showToast('✅ Route ready!');
    } catch { showToast('⚠️ Could not get directions'); }
    finally  { setBusy(false); }
  };

  return (
    <div className="rp">
      <p className="section-label">Get Directions</p>

      <div className="rp-inputs">
        <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="📍 Starting point" />
        <div className="rp-divider"/>
        <input value={to} onChange={e=>setTo(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="🏁 Destination" />
      </div>

      <div className="rp-modes">
        {MODES.map(m=>(
          <button key={m.id} className={`rp-mode${mode===m.id?' active':''}`} onClick={()=>setMode(m.id)}>
            <span>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      <button className="rp-go" onClick={go} disabled={busy}>{busy?'Calculating…':'Get Directions'}</button>

      {routeResult && (
        <div className="rp-result">
          <div className="rp-stats">
            <div className="rp-stat"><b>{routeResult.distanceKm} km</b><span>Distance</span></div>
            <div className="rp-sep"/>
            <div className="rp-stat"><b>{routeResult.durationMins} min</b><span>Duration</span></div>
            <div className="rp-sep"/>
            <div className="rp-stat"><b>{routeResult.eta}</b><span>ETA</span></div>
          </div>
          <div className="rp-steps">
            {routeResult.steps.map((s,i)=>(
              <div key={i} className="rp-step"><div className="rp-dot"/><span>{s}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
