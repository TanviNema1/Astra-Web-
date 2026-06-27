# 🛰️ AstraWatch — Live Space Tracker

> **Real-time ISS tracking, satellite visualization, and night sky exploration — all in one immersive web app.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://astra-web-git-main-tanvi-nemas-projects.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

### 🌍 Interactive 3D Globe
- Photorealistic Earth rendered with **Globe.GL** + Three.js
- **Live ISS marker** updates every 5 seconds with a trailing arc showing the last 30 positions
- **Satellite dot cloud** — up to 200 real satellites plotted in real-time from live TLE data
- Smooth auto-rotation, momentum damping, and click-to-fly camera controls
- Hover tooltips on ISS and satellite markers

### 🛸 ISS Live Telemetry Panel
- **Latitude & Longitude** — precise 4-decimal position
- **Altitude** — current orbital height in km
- **Velocity** — speed in km/h
- **Visibility** — whether the ISS is in sunlight (☀ Day) or shadow (🌙 Night)
- **Last update timestamp** — auto-refreshes every 5 seconds
- Live connection indicator with animated pulse dot

### 🌌 Night Sky View
- Animated **canvas star field** with 200 twinkling stars
- **Planet positions** for all 7 planets (Mercury → Neptune)
  - Altitude & azimuth for your current location
  - Apparent magnitude, constellation, and distance from Earth
  - Visual altitude bar for quick at-a-glance sky position
  - Visible / Below horizon badge
- Supports live data via **Astronomy API** (optional) with automatic fallback to computed Meeus approximations

### 📍 Geolocation Aware
- Detects your location via the browser **Geolocation API**
- Reverse-geocodes coordinates via **Nominatim (OpenStreetMap)** — no API key needed
- Defaults to New Delhi if location is denied

---

## 🏗️ Project Structure

```
astra-web/
├── index.html                  # Entry HTML, SEO meta tags
├── vite.config.js              # Vite 5 + React + Tailwind CSS v4 config
├── package.json
├── public/
│   └── satellite.svg           # Favicon
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root component — layout, routing, geolocation
    ├── index.css               # Design system, tokens, animations
    ├── App.css
    ├── components/
    │   ├── Navbar.jsx          # Top navigation with animated logo, tabs, location
    │   ├── GlobeView.jsx       # 3D globe with ISS + satellite markers and trail arcs
    │   ├── ISSPanel.jsx        # Left sidebar — ISS telemetry stats
    │   └── SkyPanel.jsx        # Night sky tab — star canvas + planet cards
    └── hooks/
        ├── useISS.js           # Polls ISS position every 5s, maintains trail history
        ├── useSatellites.js    # Fetches CelesTrak TLEs, propagates with satellite.js
        └── usePlanets.js       # Planet positions via Astronomy API or Meeus fallback
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 5 (Rollup bundler) |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| 3D Globe | Globe.GL (Three.js wrapper) |
| Orbital Math | satellite.js v4 (SGP4/SDP4 propagation) |
| Icons | Lucide React |
| HTTP | Axios + native `fetch` |
| Fonts | Inter, Space Grotesk, JetBrains Mono (Google Fonts) |

---

## 📡 Data Sources

| Data | Source | Auth Required |
|------|--------|--------------|
| ISS Position | [WhereTheISS.at API](https://wheretheiss.at/w/developer) | ❌ None |
| Satellite TLEs | [CelesTrak](https://celestrak.org) (visual group) | ❌ None |
| Reverse Geocoding | [Nominatim / OpenStreetMap](https://nominatim.org) | ❌ None |
| Planet Positions (live) | [Astronomy API](https://astronomyapi.com) | ✅ Optional |
| Planet Positions (fallback) | Meeus algorithm approximation (built-in) | ❌ None |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or later
- **npm** v9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/TanviNema1/Astra-Web-.git
cd Astra-Web-

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run OxLint static analysis |

---

## ⚙️ Environment Variables (Optional)

To enable live planet data from the Astronomy API, create a `.env` file in the root:

```env
VITE_ASTRO_APP_ID=your_app_id_here
VITE_ASTRO_APP_SECRET=your_app_secret_here
```

Get your free credentials at [astronomyapi.com](https://astronomyapi.com).

> **Without these keys**, the app works perfectly — planet positions fall back to computed Meeus approximations.

---

## 🌐 Deployment

The project is deployed on **Vercel** with automatic deployments on every push to `main`.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TanviNema1/Astra-Web-)

**Manual Vercel deployment:**
```bash
npm install -g vercel
vercel --prod
```

### Important: Dependency Configuration

All build-time packages (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `tailwindcss`) are placed in **`dependencies`** (not `devDependencies`). This is required because Vercel's production build environment skips `devDependencies` by default.

---

## 🎨 Design System

The app uses a custom dark space-themed design system defined in `src/index.css`:

```css
--space-black: #050a14   /* Page background */
--deep-navy:   #070f1f   /* Panel backgrounds */
--nebula-blue: #0d1f3c   /* Subtle accents */
--star-white:  #e8f4ff   /* Primary text */
--cosmic-blue: #3b82f6   /* Primary accent / ISS trail */
--orbit-cyan:  #06b6d4   /* ISS marker / live indicators */
--solar-gold:  #f59e0b   /* Warning states */
--mars-red:    #ef4444   /* Error states */
--aurora-green:#10b981   /* Live / visible badges */
```

**Reusable utility classes:**
- `.glass` — glassmorphism card (backdrop blur + translucent border)
- `.glass-hover` — hover lift + glow effect
- `.glow-blue / .glow-cyan / .glow-gold` — box shadow glow variants
- `.gradient-text` — blue → cyan → purple gradient text
- `.pulse-dot` — animated live indicator dot
- `.orbit-ring` — continuously rotating SVG orbit animation
- `.loader` — spinning ring loading indicator
- `.fade-in` — slide-up entrance animation

---

## 🧩 Component Overview

### `GlobeView.jsx`
Initializes a Globe.GL instance on mount. Maintains two data layers:
1. **Points layer** — ISS marker (size 1.5) + satellite dots (size 0.3)
2. **Arcs layer** — ISS trail rendered as sequential arc segments with opacity fade

Automatically pans the camera to follow the ISS with a smooth 1-second transition on each update.

### `ISSPanel.jsx`
Stateless display component — receives `issData`, `loading`, and `error` props from the `useISS` hook in `App.jsx`. Renders a 2-column stat grid using the reusable `<Stat>` subcomponent.

### `SkyPanel.jsx`
Combines a `<StarCanvas>` (canvas-based animated star field running at 60fps) with a scrollable list of `<PlanetCard>` components. Each planet card shows an altitude progress bar that animates on data change.

### `Navbar.jsx`
Fixed top bar with an animated SVG orbit ring logo, tab switcher (Globe / Sky View), and the detected city name.

---

## 🪝 Custom Hooks

### `useISS()`
```js
const { issData, loading, error, trail } = useISS();
```
Polls `https://api.wheretheiss.at/v1/satellites/25544` every **5 seconds**. Maintains a circular buffer of the last **30 positions** for trail rendering.

### `useSatellites()`
```js
const { positions, satCount, loading, error } = useSatellites();
```
Fetches TLE data for the CelesTrak "visual" satellite group. Uses **satellite.js SGP4 propagation** to compute current lat/lng/altitude. Re-propagates every **10 seconds**. Falls back to a hardcoded TLE set (ISS + 5 Starlinks) on network failure.

### `usePlanets(lat, lng)`
```js
const { planets, loading, source } = usePlanets(userLat, userLng);
```
Attempts the Astronomy API if `VITE_ASTRO_APP_ID` is set; otherwise computes positions using sinusoidal Meeus approximations. Returns `source: 'api' | 'fallback'` so the UI can indicate data quality.

---

## 📋 Known Limitations

- **Satellite TLE data** from CelesTrak may be blocked by CORS in some environments — the fallback TLE set activates automatically.
- **Chunk size** — the production bundle is ~2.1 MB (gzipped: ~600 KB) due to Three.js and Globe.GL. Consider lazy-loading for performance-critical use cases.
- Planet positions in fallback mode are **approximations** for demo/hackathon purposes and are not astronomically precise.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ for space enthusiasts · Powered by open-source astronomy data
</p>
