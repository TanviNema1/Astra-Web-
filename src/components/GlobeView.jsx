// src/components/GlobeView.jsx
// 3D interactive globe using Globe.GL with ISS position marker and satellite dots

import { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { useISS } from '../hooks/useISS';
import { useSatellites } from '../hooks/useSatellites';

export default function GlobeView({ onISSClick }) {
  const mountRef   = useRef(null);
  const globeRef   = useRef(null);
  const { issData, trail } = useISS();
  const { positions: satPositions } = useSatellites();
  const [initialized, setInitialized] = useState(false);

  // Initialize Globe
  useEffect(() => {
    if (!mountRef.current || globeRef.current) return;

    const globe = Globe()(mountRef.current);

    globe
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('#3b82f6')
      .atmosphereAltitude(0.18)
      .width(mountRef.current.clientWidth)
      .height(mountRef.current.clientHeight);

    // Auto-rotate slowly
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableDamping = true;

    globeRef.current = globe;
    setInitialized(true);

    // Resize handler
    const onResize = () => {
      if (mountRef.current) {
        globe.width(mountRef.current.clientWidth);
        globe.height(mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Update ISS marker + trail
  useEffect(() => {
    if (!globeRef.current || !issData) return;

    const issPoint = [{
      lat:   issData.latitude,
      lng:   issData.longitude,
      alt:   issData.altitude / 6371, // convert km to globe radius fraction
      name:  'ISS',
      color: '#06b6d4',
      size:  1.5,
    }];

    // Trail as arcs
    const arcs = trail.length > 1 ? trail.slice(0, -1).map((p, i) => ({
      startLat: p.lat,
      startLng: p.lng,
      endLat:   trail[i + 1].lat,
      endLng:   trail[i + 1].lng,
      color:    ['rgba(6,182,212,0.6)', 'rgba(6,182,212,0)'],
    })) : [];

    // Satellite dots
    const satDots = satPositions.slice(0, 200).map(s => ({
      lat:   s.lat,
      lng:   s.lng,
      alt:   Math.max(0.02, (s.alt || 500) / 6371),
      name:  s.name,
      color: 'rgba(167, 139, 250, 0.7)',
      size:  0.3,
    }));

    globeRef.current
      .pointsData([...issPoint, ...satDots])
      .pointColor(d => d.color)
      .pointAltitude(d => d.alt)
      .pointRadius(d => d.size)
      .pointLabel(d => `<div style="background:rgba(5,10,20,0.9);border:1px solid #3b82f6;border-radius:8px;padding:8px 12px;font-family:Inter,sans-serif;color:#e8f4ff;font-size:13px"><b>${d.name}</b></div>`)
      .onPointClick(d => d.name === 'ISS' && onISSClick && onISSClick())
      .arcsData(arcs)
      .arcColor('color')
      .arcAltitude(0.02)
      .arcStroke(0.5)
      .arcDashLength(0.3)
      .arcDashGap(0.1)
      .arcDashAnimateTime(1500);

    // Fly to ISS
    globeRef.current.pointOfView({ lat: issData.latitude, lng: issData.longitude, altitude: 2 }, 1000);
  }, [issData, trail, satPositions]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
      className="rounded-xl overflow-hidden"
    />
  );
}
