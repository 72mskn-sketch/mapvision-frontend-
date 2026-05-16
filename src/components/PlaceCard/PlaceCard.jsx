import { useApp } from '../../context/AppContext';
import './PlaceCard.css';

const CAT_BG = { food:'#2d1b1b', hotel:'#1b2d2d', park:'#1b2d1b', shop:'#2d2b1b', landmark:'#1b1b2d' };

function Stars({ n }) {
  return (
    <span className="stars" aria-label={`${n} stars`}>
      {[...Array(5)].map((_, i) => <span key={i} style={{color: i < Math.round(n) ? '#e3b341':'#444'}}>★</span>)}
    </span>
  );
}

export default function PlaceCard({ place }) {
  const { mapRef, setActivePlace } = useApp();

  const click = () => {
    if (mapRef) mapRef.flyTo([place.lat, place.lng], 16, { duration: 1.2 });
    setActivePlace(place);
  };

  const fmtCount = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

  return (
    <div className="pcard" onClick={click} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&click()}>
      <div className="pcard-icon" style={{background: CAT_BG[place.category]||'#1e1e1e'}}>{place.emoji}</div>
      <div className="pcard-body">
        <div className="pcard-name">{place.name}</div>
        <div className="pcard-meta">{place.type} · {place.distance}</div>
        <div className="pcard-row">
          <Stars n={place.rating} />
          <span className="pcard-score">{place.rating} ({fmtCount(place.reviewCount)})</span>
          {place.openNow && <span className="pcard-open">Open</span>}
        </div>
      </div>
    </div>
  );
}
