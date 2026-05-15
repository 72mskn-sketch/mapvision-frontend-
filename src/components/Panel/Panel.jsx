import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import PlaceCard  from '../PlaceCard/PlaceCard';
import RoutePanel from '../RoutePanel/RoutePanel';
import { fetchMarkers, fetchSaved, unsavePlace } from '../../services/api';
import './Panel.css';

const TABS = ['explore','route','saved'];
const LABELS = ['Explore','Directions','Saved'];

const CATS = [
  {icon:'🍽',label:'Food'}, {icon:'⛽',label:'Fuel'}, {icon:'🏥',label:'Health'},
  {icon:'🏫',label:'Schools'}, {icon:'🏦',label:'ATM'}, {icon:'🌤',label:'Weather'},
];

export default function Panel() {
  const {
    panelOpen, activeTab, setActiveTab,
    showToast, savedPlaces, setSavedPlaces,
  } = useApp();
  const [markers, setMarkers] = [[], () => {}];

  /* load markers once */
  const [mList, setMList] = [[], () => {}];
  useEffect(() => {
    fetchMarkers().then(data => window.__mv_markers = data).catch(()=>{});
    fetchSaved().then(setSavedPlaces).catch(()=>{});
  }, []); // eslint-disable-line

  /* force a re-render when markers load (simple approach without extra state) */
  const [tick, setTick] = [0, () => {}];
  useEffect(()=>{ const id=setInterval(()=>{ if(window.__mv_markers){ clearInterval(id); setTick(1); }},300); return ()=>clearInterval(id); },[]); // eslint-disable-line

  const markerList = window.__mv_markers || [];

  const removeSaved = async (id) => {
    try { await unsavePlace(id); setSavedPlaces(p=>p.filter(x=>x.id!==id)); showToast('🗑 Removed'); }
    catch { showToast('⚠️ Error'); }
  };

  return (
    <aside className={`panel${panelOpen?'':' closed'}`} aria-label="Sidebar">
      <div className="panel-tabs" role="tablist">
        {TABS.map((t,i)=>(
          <button key={t} role="tab" aria-selected={activeTab===t}
            className={`ptab${activeTab===t?' active':''}`} onClick={()=>setActiveTab(t)}>
            {LABELS[i]}
            {t==='saved' && savedPlaces.length>0 && <span className="badge">{savedPlaces.length}</span>}
          </button>
        ))}
      </div>

      {activeTab==='explore' && (
        <div className="panel-body">
          <p className="section-label">Nearby Places</p>
          {markerList.map(m=><PlaceCard key={m.id} place={m}/>)}
          <p className="section-label" style={{marginTop:4}}>Categories</p>
          <div className="cat-grid">
            {CATS.map(c=>(
              <button key={c.label} className="cat-btn" onClick={()=>showToast(`${c.icon} Loading ${c.label}…`)}>
                <span>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab==='route' && (
        <div className="panel-body"><RoutePanel/></div>
      )}

      {activeTab==='saved' && (
        <div className="panel-body">
          <p className="section-label">Saved Places</p>
          {savedPlaces.length===0 ? (
            <div className="empty"><span>❤️</span><p>No saved places yet.</p><p>Tap a marker and click Save.</p></div>
          ) : savedPlaces.map(p=>(
            <div key={p.id} className="saved-row">
              <span style={{fontSize:'1.3rem'}}>{p.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:'.86rem'}}>{p.name}</div>
                <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{p.type}</div>
              </div>
              <button className="rm-btn" onClick={()=>removeSaved(p.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
