// src/components/SkyPanel.jsx
// Interactive sky view with planet list and a canvas-based star field

import { useEffect, useRef } from 'react';
import { usePlanets } from '../hooks/usePlanets';

function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    // Generate stars
    const stars = Array.from({ length: 200 }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + 0.3,
      a:    Math.random(),
      da:   (Math.random() - 0.5) * 0.008,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a = Math.max(0.1, Math.min(1, s.a + s.da));
        if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-xl"
      style={{ pointerEvents: 'none' }}
    />
  );
}

function PlanetCard({ planet }) {
  const altColor = planet.altitude > 0 ? '#10b981' : '#ef4444';
  const barWidth = Math.max(0, Math.min(100, (planet.altitude / 90) * 100));

  return (
    <div
      className="glass glass-hover p-3 flex flex-col gap-2"
      style={{ borderColor: `${planet.color}30` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{planet.symbol}</span>
          <div>
            <div className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: planet.color }}>
              {planet.name}
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>{planet.constellation}</div>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: planet.visible ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: planet.visible ? '#10b981' : '#ef4444',
              border: `1px solid ${planet.visible ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}
          >
            {planet.visible ? 'Visible' : 'Below horizon'}
          </div>
        </div>
      </div>

      <div className="flex gap-3 text-xs" style={{ color: '#94a3b8' }}>
        <span>Alt: <span style={{ color: altColor }}>{planet.altitude.toFixed(1)}°</span></span>
        <span>Az: <span style={{ color: '#06b6d4' }}>{planet.azimuth.toFixed(0)}°</span></span>
        <span>Mag: <span style={{ color: '#fbbf24' }}>{typeof planet.magnitude === 'number' ? planet.magnitude.toFixed(1) : planet.magnitude}</span></span>
        <span style={{ marginLeft: 'auto' }}>{planet.distance}</span>
      </div>

      {/* Altitude bar */}
      <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-1 rounded-full transition-all duration-700"
          style={{ width: `${barWidth}%`, background: `linear-gradient(90deg, ${planet.color}80, ${planet.color})` }}
        />
      </div>
    </div>
  );
}

export default function SkyPanel({ userLat, userLng }) {
  const { planets, loading, source } = usePlanets(userLat, userLng);
  const visibleCount = planets.filter(p => p.visible).length;

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            🌌 Night Sky
          </h2>
          <p className="text-xs" style={{ color: '#64748b' }}>
            {source === 'api' ? 'Live Astronomy API' : 'Computed positions'}
          </p>
        </div>
        <div
          className="text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          {visibleCount} visible tonight
        </div>
      </div>

      {/* Star canvas preview */}
      <div className="relative rounded-xl flex-shrink-0" style={{ height: '100px', background: 'linear-gradient(180deg, #000510 0%, #050a14 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <StarCanvas />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Space Grotesk, sans-serif' }}>
            ✦ Live Star Field ✦
          </span>
        </div>
      </div>

      {/* Planet list */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="loader" />
          </div>
        ) : (
          planets.map(planet => (
            <PlanetCard key={planet.name} planet={planet} />
          ))
        )}
      </div>
    </div>
  );
}
