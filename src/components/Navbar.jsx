// src/components/Navbar.jsx
import { Globe, Satellite, Moon, MapPin } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userCity }) {
  return (
    <nav
      className="glass flex items-center justify-between px-5 py-3 flex-shrink-0"
      style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 36, height: 36 }}
        >
          {/* Orbit ring */}
          <svg width="36" height="36" className="absolute orbit-ring" style={{ animationDuration: '6s' }}>
            <ellipse cx="18" cy="18" rx="14" ry="6" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.6" transform="rotate(-20 18 18)" />
          </svg>
          <Globe size={18} style={{ color: '#06b6d4' }} />
        </div>
        <div>
          <h1 className="font-bold text-base gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
            AstraWatch
          </h1>
          <p className="text-xs" style={{ color: '#475569', marginTop: -2 }}>Real-time space tracker</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 glass p-1" style={{ borderRadius: 10 }}>
        {[
          { id: 'globe', label: 'Globe', Icon: Globe },
          { id: 'sky',   label: 'Sky View', Icon: Moon },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
            style={{
              background: activeTab === id ? 'rgba(59,130,246,0.25)' : 'transparent',
              color:      activeTab === id ? '#3b82f6' : '#64748b',
              border:     activeTab === id ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
              fontFamily: 'Space Grotesk, sans-serif',
              cursor: 'pointer',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
        <MapPin size={12} style={{ color: '#06b6d4' }} />
        <span>{userCity || 'Detecting location...'}</span>
      </div>
    </nav>
  );
}
