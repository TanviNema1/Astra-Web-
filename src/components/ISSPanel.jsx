// src/components/ISSPanel.jsx
// Side panel showing live ISS telemetry data

import { Satellite, Wifi, WifiOff, MapPin, Gauge, Clock } from 'lucide-react';

function Stat({ label, value, unit, icon: Icon, color = '#06b6d4' }) {
  return (
    <div className="glass p-3 flex flex-col gap-1 glass-hover">
      <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div className="flex items-end gap-1">
        <span className="font-mono font-semibold text-lg" style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>
          {value ?? '—'}
        </span>
        {unit && <span className="text-xs mb-0.5" style={{ color: '#64748b' }}>{unit}</span>}
      </div>
    </div>
  );
}

export default function ISSPanel({ issData, loading, error }) {
  const isLive = !!issData && !error;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite size={18} style={{ color: '#06b6d4' }} />
          <span className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            ISS Live Tracker
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLive ? (
            <>
              <div className="pulse-dot" />
              <span className="text-xs" style={{ color: '#10b981' }}>LIVE</span>
            </>
          ) : (
            <span className="text-xs" style={{ color: '#ef4444' }}>
              {loading ? 'Connecting...' : 'Offline'}
            </span>
          )}
        </div>
      </div>

      {loading && !issData && (
        <div className="flex items-center justify-center py-8">
          <div className="loader" />
        </div>
      )}

      {issData && (
        <div className="grid grid-cols-2 gap-2">
          <Stat
            label="Latitude"
            value={issData.latitude?.toFixed(4)}
            unit="°"
            icon={MapPin}
            color="#06b6d4"
          />
          <Stat
            label="Longitude"
            value={issData.longitude?.toFixed(4)}
            unit="°"
            icon={MapPin}
            color="#06b6d4"
          />
          <Stat
            label="Altitude"
            value={issData.altitude?.toFixed(1)}
            unit="km"
            icon={Gauge}
            color="#3b82f6"
          />
          <Stat
            label="Velocity"
            value={issData.velocity?.toFixed(0)}
            unit="km/h"
            icon={Gauge}
            color="#a78bfa"
          />
          <Stat
            label="Visibility"
            value={issData.visibility === 'daylight' ? '☀ Day' : '🌙 Night'}
            color={issData.visibility === 'daylight' ? '#fbbf24' : '#818cf8'}
          />
          <Stat
            label="Last Update"
            value={new Date(issData.timestamp * 1000).toLocaleTimeString()}
            icon={Clock}
            color="#94a3b8"
          />
        </div>
      )}

      {error && (
        <div className="glass p-3 flex items-center gap-2" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <WifiOff size={14} style={{ color: '#ef4444' }} />
          <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {/* ISS fun fact */}
      <div className="glass p-3 mt-auto" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.2)' }}>
        <p className="text-xs" style={{ color: '#94a3b8', lineHeight: 1.6 }}>
          🛸 The ISS orbits Earth every <span style={{ color: '#06b6d4' }}>~92 minutes</span> at{' '}
          <span style={{ color: '#06b6d4' }}>~408 km</span> altitude, traveling at{' '}
          <span style={{ color: '#06b6d4' }}>7.66 km/s</span>.
        </p>
      </div>
    </div>
  );
}
