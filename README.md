# Math Market Maldives

A local, bilingual shopkeeping math game for Key Stages 1 and 2. The game supports English and Spanish; the language choice and player progress are saved in the browser. It uses local, bundled fonts, icons, and illustrations.

## Run locally

```powershell
npm install
npm run build
npm run serve
```

Open <http://127.0.0.1:4180/>. For live editing, use `npm run dev` and open <http://127.0.0.1:4181/>.

## Files

- `src/App.jsx`: game screens, state, and interactions
- `src/HomeSetup.jsx`: illustrated home screen and choice dialogs
- `src/data.js`: shops, products, themes, avatars, and decorations
- `src/missions.js`: 18 mission types with English and Spanish prompts
- `src/i18n.js`: UI, product, stall, and curriculum translations
- `src/audio.js`: short sound effects
- `src/styles.css`: responsive styling and generated Tailwind input
- `public/market-island.svg`: original vector illustration
- `server.cjs`: local production server for `dist/`

`npm test` checks generated bilingual prompts across every track, level, and stall. `npm run build` creates the deployable `dist/` directory. No browser-side JSX transformation or CDN scripts are used.

Progress is stored in this browser's localStorage. Changing language keeps the active choices and progress.
