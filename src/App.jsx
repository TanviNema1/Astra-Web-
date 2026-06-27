// src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GlobeView from './components/GlobeView';
import ISSPanel from './components/ISSPanel';
import SkyPanel from './components/SkyPanel';
import { useISS } from './hooks/useISS';

export default function App() {
  const [activeTab, setActiveTab] = useState('globe');
  const [userLat, setUserLat]     = useState(28.6);
  const [userLng, setUserLng]     = useState(77.2);
  const [userCity, setUserCity]   = useState('');

  const { issData, loading, error } = useISS();

  // Get user geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        // Reverse geocode (no key needed)
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          setUserCity(data.address?.city || data.address?.town || data.address?.state || 'Earth');
        } catch {
          setUserCity('Earth');
        }
      },
      () => setUserCity('New Delhi, IN')
    );
  }, []);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--space-black)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userCity={userCity} />

      <div className="flex flex-1 overflow-hidden gap-3 p-3">
        {/* Left sidebar */}
        <aside
          className="glass flex flex-col p-4 overflow-y-auto"
          style={{ width: '300px', flexShrink: 0 }}
        >
          <ISSPanel issData={issData} loading={loading} error={error} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden rounded-xl relative">
          {/* Globe tab */}
          <div style={{ display: activeTab === 'globe' ? 'block' : 'none', width: '100%', height: '100%' }}>
            <GlobeView onISSClick={() => setActiveTab('globe')} />
          </div>

          {/* Sky tab */}
          {activeTab === 'sky' && (
            <div className="glass p-4 h-full overflow-hidden fade-in">
              <SkyPanel userLat={userLat} userLng={userLng} />
            </div>
          )}

          {/* Floating satellite count badge */}
          <div
            className="glass absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2"
            style={{ pointerEvents: 'none' }}
          >
            <span className="text-xs" style={{ color: '#a78bfa' }}>🛰</span>
            <span className="text-xs font-mono" style={{ color: '#a78bfa' }}>Tracking live objects</span>
          </div>
        </main>
      </div>
    </div>
  );
}
