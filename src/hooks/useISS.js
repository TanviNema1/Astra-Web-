// src/hooks/useISS.js
// Polls the ISS position every 5 seconds from WhereTheISS.at (no auth, CORS-safe)

import { useState, useEffect, useRef } from 'react';

const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const POLL_INTERVAL = 5000; // 5 seconds

export function useISS() {
  const [issData, setIssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [trail, setTrail]   = useState([]); // last N positions for trail rendering
  const intervalRef = useRef(null);

  const fetchISS = async () => {
    try {
      const res = await fetch(ISS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIssData(data);
      setError(null);
      setLoading(false);
      setTrail(prev => {
        const next = [...prev, { lat: data.latitude, lng: data.longitude, ts: Date.now() }];
        return next.slice(-30); // keep last 30 points
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISS();
    intervalRef.current = setInterval(fetchISS, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  return { issData, loading, error, trail };
}
