import { useApp } from '../../context/AppContext';
import './BottomBar.css';

const NAV = [
  { id:'explore', label:'Explore', svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { id:'route',   label:'Routes',  svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg> },
  { id:'locate',  label:'Locate',  svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> },
  { id:'saved',   label:'Saved',   svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
];

export default function BottomBar() {
  const { activeTab, setActiveTab, mapRef, showToast, savedPlaces, setPanelOpen } = useApp();

  const handle = (id) => {
    if (id === 'locate') {
      if (!mapRef || !navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        ({coords})=>{ mapRef.flyTo([coords.latitude,coords.longitude],15,{duration:1.4}); showToast('📍 Found!'); },
        ()=>showToast('⚠️ Location denied')
      );
      return;
    }
    setActiveTab(id); setPanelOpen(true);
  };

  return (
    <nav className="bbar">
      {NAV.map(n=>(
        <button key={n.id} className={`bb-btn${activeTab===n.id?' active':''}`} onClick={()=>handle(n.id)}>
          {n.svg}
          <span>{n.label}</span>
          {n.id==='saved' && savedPlaces.length>0 && <span className="bb-badge">{savedPlaces.length}</span>}
        </button>
      ))}
    </nav>
  );
}
