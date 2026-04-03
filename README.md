# CricketOS - Indoor Cricket Match Tracker

A mobile-first PWA for tracking indoor cricket matches with your crew.

## Features

- **Match Logging** - Record matches with teams, scores, and summaries
- **Player Management** - Track your cricket crew with stats
- **Head-to-Head Stats** - Player vs player win records
- **Venues** - Track match history per location
- **Team Presets** - Save common team combinations
- **Dark/Light Theme** - Customizable appearance
- **Data Backup** - Export/Import JSON backups
- **PWA Support** - Install on mobile home screen

## Quick Start

```bash
cd cricket-os
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

The built files will be in the `dist/` folder.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

### GitHub Pages

1. Push to GitHub
2. Enable GitHub Pages in repo settings
3. Use `npm run preview` or CI/CD pipeline

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Router
- Lucide Icons
- Vite PWA Plugin

## License

MIT
