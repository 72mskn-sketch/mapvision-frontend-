import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [mapRef,       setMapRef]       = useState(null);
  const [currentLayer, setCurrentLayer] = useState('dark');
  const [trafficOn,    setTrafficOn]    = useState(false);
  const [panelOpen,    setPanelOpen]    = useState(true);
  const [activeTab,    setActiveTab]    = useState('explore');
  const [activePlace,  setActivePlace]  = useState(null);
  const [savedPlaces,  setSavedPlaces]  = useState([]);
  const [routeResult,  setRouteResult]  = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = useCallback((message, variant = 'default') => {
    setToast({ message, variant, id: Date.now() });
  }, []);

  return (
    <Ctx.Provider value={{
      mapRef, setMapRef,
      currentLayer, setCurrentLayer,
      trafficOn, setTrafficOn,
      panelOpen, setPanelOpen,
      activeTab, setActiveTab,
      activePlace, setActivePlace,
      savedPlaces, setSavedPlaces,
      routeResult, setRouteResult,
      toast, showToast,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be inside <AppProvider>');
  return ctx;
};
