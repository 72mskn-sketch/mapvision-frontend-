import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './LayerMenu.css';

const STYLES = [
  { key:'dark',      label:'Dark',      color:'#8b949e' },
  { key:'standard',  label:'Standard',  color:'#3fb950' },
  { key:'satellite', label:'Satellite', color:'#58a6ff' },
  { key:'terrain',   label:'Terrain',   color:'#e3b341' },
];

export default function LayerMenu() {
  const { currentLayer, setCurrentLayer, showToast } = useApp();
  const [open, setOpen] = useState(false);

  const pick = (key) => {
    setCurrentLayer(key); setOpen(false);
    showToast(`🗺 Style: ${key}`);
  };

  return (
    <>
      <button className="mc lyr-toggle" onClick={()=>setOpen(o=>!o)} title="Map Layers" style={{top:210}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
      </button>

      {open && (
        <div className="lyr-menu">
          <p className="section-label">Map Style</p>
          {STYLES.map(s=>(
            <button key={s.key} className={`lyr-opt${currentLayer===s.key?' active':''}`} onClick={()=>pick(s.key)}>
              <span className="lyr-dot" style={{background:s.color}}/>
              {s.label}
              {currentLayer===s.key && <span className="lyr-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
