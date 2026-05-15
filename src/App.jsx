
import { useEffect, useState } from "react";
import "./App.css";
import MapView from "./components/Map/MapView";
import Header from "./components/Header/Header";
import Panel from "./components/Panel/Panel";
import MapControls from "./components/MapControls/MapControls";
import LayerMenu from "./components/LayerMenu/LayerMenu";
import InfoPopup from "./components/InfoPopup/InfoPopup";
import BottomBar from "./components/BottomBar/BottomBar";
import Toast from "./components/Toast/Toast";

export default function App() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetch("https://mapvision-backend.onrender.com/api/markers")
      .then(res => res.json())
      .then(data => setMarkers(data))
      .catch(err => console.error("Error fetching markers:", err));
  }, []);

  return (
    <>
      <Header />
      <Panel />
      <MapView markers={markers} />
      <MapControls />
      <LayerMenu />
      <InfoPopup />
      <BottomBar />
      <Toast />
    </>
  );
}

