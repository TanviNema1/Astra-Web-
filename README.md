# AstraWatch 🛸

**Real-time ISS tracker + satellite visualizer + night sky explorer**

> Built for hackathon submission — tracks the International Space Station live, shows 200+ satellites in orbit on a 3D globe, and lists tonight's visible planets.

## 🚀 Live Demo
Deploy to Vercel → hosted link here

## ✨ Features
- **Live ISS Tracking** — position updates every 5 seconds via [WhereTheISS.at](https://api.wheretheiss.at)
- **3D Interactive Globe** — powered by Globe.GL with ISS trail, satellite dot cloud, atmosphere glow
- **Satellite Propagation** — TLE data from CelesTrak, propagated client-side with satellite.js
- **Night Sky Panel** — 7 planets with altitude, azimuth, magnitude, constellation & visibility
- **Geolocation** — auto-detects your city, positions sky data for your coordinates
- **Fully responsive** — works on mobile and desktop

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| 3D Globe | Globe.GL + Three.js |
| ISS Data | WhereTheISS.at API |
| TLE Data | CelesTrak |
| Propagation | satellite.js |
| Planets | Astronomy API / computed fallback |
| Deployment | Vercel |

## Quick Start

```bash
git clone <repo-url>
cd astra-web
npm install
npm run dev
```

Open http://localhost:5173

### Optional: Astronomy API (real planet positions)
1. Sign up at https://astronomyapi.com (free)
2. Create `.env` file:
```
VITE_ASTRO_APP_ID=your_app_id
VITE_ASTRO_APP_SECRET=your_app_secret
```

## API Reference
| API | Endpoint | Auth |
|-----|----------|------|
| ISS Position | `https://api.wheretheiss.at/v1/satellites/25544` | None |
| TLE Data | `https://celestrak.org/SOCRATES/query.php?GROUP=visual&FORMAT=TLE` | None |
| Planet Positions | `https://api.astronomyapi.com/api/v2/bodies/positions` | Basic Auth |
| Reverse Geocode | `https://nominatim.openstreetmap.org/reverse` | None |

## Project Structure
```
src/
  hooks/
    useISS.js         # ISS polling (5s interval)
    useSatellites.js  # TLE fetch + satellite.js propagation
    usePlanets.js     # Planet positions (API or computed)
  components/
    GlobeView.jsx     # Globe.GL 3D globe
    ISSPanel.jsx      # Left sidebar telemetry
    SkyPanel.jsx      # Night sky + planet list
    Navbar.jsx        # Top navigation
  App.jsx             # Root layout + geolocation
  index.css           # Global styles + design tokens
```

## Deployment (Vercel)
1. Push to GitHub
2. Go to vercel.com, New Project, Import repo
3. Framework: Vite (auto-detected)
4. Add env vars if using Astronomy API
5. Deploy and get hosted link for submission

Built with love for the hackathon
