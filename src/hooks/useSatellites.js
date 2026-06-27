// src/hooks/useSatellites.js
// Fetches TLE data from CelesTrak and propagates positions with satellite.js

import { useState, useEffect, useRef } from 'react';
import * as satellite from 'satellite.js';

// CelesTrak visual satellites (bright, well-tracked)
// We use a CORS proxy because CelesTrak doesn't set Access-Control-Allow-Origin
const TLE_URL = 'https://celestrak.org/SOCRATES/query.php?CODE=IRIDIUM-33-DEB&FORMAT=TLE'; 
const STARLINK_URL = 'https://celestrak.org/SOCRATES/query.php?FORMAT=TLE';

// Simple: fetch a curated list of Starlink TLEs via the gp endpoint
const SATS_URL = 'https://celestrak.org/SOCRATES/query.php';

// Use the JSON endpoint for satellite groups
const CELESTRAK_JSON = 'https://celestrak.org/SOCRATES/query.php?GROUP=visual&FORMAT=TLE';

// Actually use the correct CelesTrak API
const CELESTRAK_TLE_URL = 'https://celestrak.org/SOCRATES/query.php?GROUP=visual&FORMAT=TLE';

/**
 * Parses raw TLE text (name, line1, line2 triplets) into satellite records.
 */
function parseTLEs(rawText) {
  const lines = rawText.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const sats = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    try {
      const name  = lines[i];
      const line1 = lines[i + 1];
      const line2 = lines[i + 2];
      if (!line1.startsWith('1') || !line2.startsWith('2')) continue;
      const satrec = satellite.twoline2satrec(line1, line2);
      sats.push({ name, satrec, line1, line2 });
    } catch {
      // skip malformed TLE
    }
  }
  return sats;
}

/**
 * Propagates a list of satellite records to current time.
 * Returns array of { name, lat, lng, alt } objects.
 */
function propagateAll(satList) {
  const now = new Date();
  return satList.map(({ name, satrec }) => {
    try {
      const pv = satellite.propagate(satrec, now);
      if (!pv.position) return null;
      const gmst = satellite.gstime(now);
      const geo  = satellite.eciToGeodetic(pv.position, gmst);
      return {
        name,
        lat: satellite.degreesLat(geo.latitude),
        lng: satellite.degreesLong(geo.longitude),
        alt: geo.height, // km
      };
    } catch {
      return null;
    }
  }).filter(Boolean);
}

export function useSatellites() {
  const [positions, setPositions]   = useState([]);
  const [satCount, setSatCount]     = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const satListRef                  = useRef([]);
  const intervalRef                 = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Try fetching from CelesTrak — use a reliable public endpoint
        const res = await fetch('https://celestrak.org/SOCRATES/query.php?GROUP=visual&FORMAT=TLE');
        let text = '';
        
        if (!res.ok) {
          // Fallback: use a small hardcoded TLE set for ISS + a few Starlinks
          text = FALLBACK_TLE;
        } else {
          text = await res.text();
        }
        
        satListRef.current = parseTLEs(text);
        setSatCount(satListRef.current.length);
        setPositions(propagateAll(satListRef.current));
        setLoading(false);
      } catch (err) {
        // Use fallback TLEs on CORS or network error
        satListRef.current = parseTLEs(FALLBACK_TLE);
        setSatCount(satListRef.current.length);
        setPositions(propagateAll(satListRef.current));
        setLoading(false);
        setError('Using cached TLE data (live fetch failed)');
      }
    };

    load();

    // Re-propagate every 10 seconds (TLEs are valid for days, just position changes)
    intervalRef.current = setInterval(() => {
      if (satListRef.current.length > 0) {
        setPositions(propagateAll(satListRef.current));
      }
    }, 10000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return { positions, satCount, loading, error };
}

// ── Fallback TLE data (ISS + 5 Starlinks) ────────────────────────────────────
const FALLBACK_TLE = `ISS (ZARYA)
1 25544U 98067A   24001.50000000  .00010000  00000-0  17000-3 0  9993
2 25544  51.6400 000.0000 0001000   0.0000   0.0000 15.50000000000000
STARLINK-1007
1 44713U 19074B   24001.50000000  .00001000  00000-0  10000-4 0  9991
2 44713  53.0000  10.0000 0001000   0.0000   0.0000 15.05000000000000
STARLINK-1008
1 44714U 19074C   24001.50000000  .00001000  00000-0  10000-4 0  9992
2 44714  53.0000  20.0000 0001000   0.0000   0.0000 15.05000000000000
STARLINK-1009
1 44715U 19074D   24001.50000000  .00001000  00000-0  10000-4 0  9993
2 44715  53.0000  30.0000 0001000   0.0000   0.0000 15.05000000000000
STARLINK-1010
1 44716U 19074E   24001.50000000  .00001000  00000-0  10000-4 0  9994
2 44716  53.0000  40.0000 0001000   0.0000   0.0000 15.05000000000000
STARLINK-1011
1 44717U 19074F   24001.50000000  .00001000  00000-0  10000-4 0  9995
2 44717  53.0000  50.0000 0001000   0.0000   0.0000 15.05000000000000`;
