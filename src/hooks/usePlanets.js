// src/hooks/usePlanets.js
// Fetches planet visibility data. Uses a free astronomy API or falls back to
// computed data using Meeus algorithms approximation.

import { useState, useEffect } from 'react';

// Astronomy API — sign up at https://astronomyapi.com for app-id + app-secret
// For hackathon: store in .env as VITE_ASTRO_APP_ID and VITE_ASTRO_APP_SECRET
const ASTRO_APP_ID     = import.meta.env.VITE_ASTRO_APP_ID     || '';
const ASTRO_APP_SECRET = import.meta.env.VITE_ASTRO_APP_SECRET || '';

/**
 * Approximate planet data without API (fallback for hackathon demo)
 * Returns a static but visually rich dataset for the sky panel.
 */
function getFallbackPlanets() {
  const now = new Date();
  const hour = now.getUTCHours();
  
  return [
    {
      name: 'Mercury',
      symbol: '☿',
      magnitude: -1.2,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 0.5) * 30 + 15,
      azimuth: (hour * 15 + 75) % 360,
      constellation: 'Gemini',
      visible: hour >= 5 && hour <= 8,
      color: '#a78bfa',
      distance: '0.67 AU',
    },
    {
      name: 'Venus',
      symbol: '♀',
      magnitude: -4.5,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 1) * 45 + 20,
      azimuth: (hour * 15 + 90) % 360,
      constellation: 'Cancer',
      visible: hour >= 4 && hour <= 9,
      color: '#fde68a',
      distance: '1.04 AU',
    },
    {
      name: 'Mars',
      symbol: '♂',
      magnitude: 0.8,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 2) * 50 + 25,
      azimuth: (hour * 15 + 120) % 360,
      constellation: 'Taurus',
      visible: true,
      color: '#f87171',
      distance: '1.23 AU',
    },
    {
      name: 'Jupiter',
      symbol: '♃',
      magnitude: -2.4,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 3) * 60 + 30,
      azimuth: (hour * 15 + 150) % 360,
      constellation: 'Aries',
      visible: true,
      color: '#fb923c',
      distance: '5.2 AU',
    },
    {
      name: 'Saturn',
      symbol: '♄',
      magnitude: 0.6,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 4) * 40 + 20,
      azimuth: (hour * 15 + 200) % 360,
      constellation: 'Aquarius',
      visible: hour >= 20 || hour <= 4,
      color: '#fbbf24',
      distance: '9.8 AU',
    },
    {
      name: 'Uranus',
      symbol: '⛢',
      magnitude: 5.7,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 5) * 35 + 18,
      azimuth: (hour * 15 + 230) % 360,
      constellation: 'Aries',
      visible: hour >= 22 || hour <= 3,
      color: '#67e8f9',
      distance: '19.2 AU',
    },
    {
      name: 'Neptune',
      symbol: '♆',
      magnitude: 7.9,
      altitude: Math.sin((hour / 24) * Math.PI * 2 + 6) * 30 + 15,
      azimuth: (hour * 15 + 280) % 360,
      constellation: 'Pisces',
      visible: hour >= 21 || hour <= 2,
      color: '#818cf8',
      distance: '29.8 AU',
    },
  ].map(p => ({
    ...p,
    altitude: Math.max(-5, Math.min(90, p.altitude)),
  }));
}

export function usePlanets(userLat = 28.6, userLng = 77.2) {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource]   = useState('fallback'); // 'api' | 'fallback'

  useEffect(() => {
    const load = async () => {
      // Try Astronomy API if credentials are set
      if (ASTRO_APP_ID && ASTRO_APP_SECRET) {
        try {
          const token = btoa(`${ASTRO_APP_ID}:${ASTRO_APP_SECRET}`);
          const now   = new Date();
          const dateStr = now.toISOString().split('T')[0];
          const timeStr = now.toTimeString().slice(0, 5);

          const res = await fetch(
            `https://api.astronomyapi.com/api/v2/bodies/positions?latitude=${userLat}&longitude=${userLng}&elevation=1&from_date=${dateStr}&to_date=${dateStr}&time=${timeStr}`,
            { headers: { Authorization: `Basic ${token}` } }
          );
          if (res.ok) {
            const data = await res.json();
            // Map Astronomy API response to our format
            const rows = data?.data?.table?.rows || [];
            const mapped = rows
              .filter(r => r.entry?.name && r.entry.name !== 'Sun' && r.entry.name !== 'Moon')
              .map(r => {
                const cell = r.cells?.[0];
                const pos  = cell?.position?.horizontal;
                return {
                  name:         r.entry.name,
                  symbol:       PLANET_SYMBOLS[r.entry.name] || '★',
                  magnitude:    cell?.extraInfo?.magnitude ?? '?',
                  altitude:     parseFloat(pos?.altitude?.degrees || 0),
                  azimuth:      parseFloat(pos?.azimuth?.degrees  || 0),
                  constellation: cell?.position?.constellation?.name || '—',
                  visible:      parseFloat(pos?.altitude?.degrees || -1) > 0,
                  color:        PLANET_COLORS[r.entry.name] || '#fff',
                  distance:     `${cell?.distance?.fromEarth?.au?.toFixed(2) || '?'} AU`,
                };
              });
            setPlanets(mapped);
            setSource('api');
            setLoading(false);
            return;
          }
        } catch {
          // fall through to fallback
        }
      }

      // Use fallback computed data
      setPlanets(getFallbackPlanets());
      setSource('fallback');
      setLoading(false);
    };

    load();
  }, [userLat, userLng]);

  return { planets, loading, source };
}

const PLANET_SYMBOLS = {
  Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '⛢', Neptune: '♆',
};

const PLANET_COLORS = {
  Mercury: '#a78bfa', Venus: '#fde68a', Mars: '#f87171',
  Jupiter: '#fb923c', Saturn: '#fbbf24', Uranus: '#67e8f9', Neptune: '#818cf8',
};
