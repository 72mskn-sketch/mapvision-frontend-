import { useApp } from '../../context/AppContext';
import './MapControls.css';

export default function MapControls() {
  const { mapRef } = useApp();
  const fs = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(()=>{});
  return (
    <div className="mctrl">
      <button className="mc" onClick={()=>mapRef?.zoomIn()}  title="Zoom In">＋</button>
      <button className="mc" onClick={()=>mapRef?.zoomOut()} title="Zoom Out">－</button>
      <button className="mc" onClick={fs} title="Fullscreen">⛶</button>
    </div>
  );
}
