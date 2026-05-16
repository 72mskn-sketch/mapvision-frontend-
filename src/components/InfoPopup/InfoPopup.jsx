import { useApp } from '../../context/AppContext';
import { savePlace } from '../../services/api';
import './InfoPopup.css';

export default function InfoPopup() {
  const { activePlace, setActivePlace, showToast, savedPlaces, setSavedPlaces, setActiveTab, setPanelOpen } = useApp();
  if (!activePlace) return null;

  const isSaved = savedPlaces.some(p => p.id === activePlace.id);
  const stars   = Math.round(activePlace.rating || 4);
  const fmtCount = n => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

  const onSave = async () => {
    if (isSaved) { showToast('Already saved!'); return; }
    try {
      const saved = await savePlace({ id:activePlace.id, name:activePlace.name, type:activePlace.type, emoji:activePlace.emoji });
      setSavedPlaces(p => [...p, saved]);
      showToast(`❤️ "${activePlace.name}" saved!`);
      setActivePlace(null);
    } catch { showToast('Already saved!'); }
  };

  const onDirections = () => {
    setActiveTab('route'); setPanelOpen(true);
    showToast(`🗺 Open Directions tab for ${activePlace.name}`);
    setActivePlace(null);
  };

  return (
    <div className="ipop" role="dialog" aria-label={activePlace.name}>
      <button className="ipop-close" onClick={()=>setActivePlace(null)}>✕</button>

      <div className="ipop-head">
        <span className="ipop-emoji">{activePlace.emoji}</span>
        <div>
          <div className="ipop-name">{activePlace.name}</div>
          <div className="ipop-type">{activePlace.type}</div>
        </div>
      </div>

      <div className="ipop-meta">
        <span className="open-tag">● Open</span>
        <span>|</span>
        <span className="starz">{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</span>
        <span className="ipop-score">{activePlace.rating} ({fmtCount(activePlace.reviewCount || 0)} reviews)</span>
      </div>

      <div className="ipop-actions">
        <button className="ipop-btn primary" onClick={onDirections}>🗺 Directions</button>
        <button className={`ipop-btn${isSaved?' saved':''}`} onClick={onSave}>{isSaved?'❤️ Saved':'♡ Save'}</button>
        <button className="ipop-btn" onClick={()=>{ navigator.clipboard?.writeText(activePlace.name); showToast('📤 Copied!'); }}>📤 Share</button>
      </div>
    </div>
  );
}
