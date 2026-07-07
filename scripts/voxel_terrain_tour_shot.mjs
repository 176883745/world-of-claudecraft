// Verification tour for the full-world voxel-terrain swap (renderer.ts now
// builds terrain from buildVoxelTerrain instead of the production heightfield
// mesh). Teleports across 10 spread-out locations covering all three zones
// (vale/marsh/peaks), hubs, and the world rim, and screenshots each with no
// cinematic waits beyond a short settle. Needs `npm run dev` running.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { BROWSER_PATH as EDGE } from './browser_path.mjs';
import { enterOfflineGame } from './enter_offline_game.mjs';

const URL = process.env.GAME_URL ?? 'http://localhost:5173';
const OUT = 'docs/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--window-size=1600,900', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
page.on('console', (msg) => {
  const t = msg.text();
  if (t.includes('voxel_terrain')) console.log('BROWSER:', t);
});

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await enterOfflineGame(page, { charClass: 'warrior', charName: 'Tour', settleMs: 4000 });

// 10 spread locations: vale hub/lake area, marsh, peaks, rim, ridge pass.
const LOCATIONS = [
  { name: '01_vale_spawn', x: 0, z: 0 },
  { name: '02_vale_hub', x: 20, z: 40 },
  { name: '03_vale_west_hill', x: -120, z: 100 },
  { name: '04_vale_ridge_pass', x: 0, z: 170 },
  { name: '05_marsh_north', x: 0, z: 250 },
  { name: '06_marsh_east', x: 130, z: 400 },
  { name: '07_marsh_ridge_pass', x: 0, z: 535 },
  { name: '08_peaks_south', x: -100, z: 600 },
  { name: '09_peaks_center', x: 0, z: 750 },
  { name: '10_peaks_north_rim', x: 0, z: 890 },
];

for (const loc of LOCATIONS) {
  await page.evaluate((p) => {
    const g = window.__game;
    const player = g.sim.player;
    player.pos.x = p.x;
    player.pos.z = p.z;
    player.facing = 0;
    g.input.camYaw = 0.6;
    g.input.camPitch = -0.35;
  }, loc);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/voxel_tour_${loc.name}.png` });
  console.log('captured', loc.name);
}

await browser.close();
console.log('wrote screenshots to', OUT);
