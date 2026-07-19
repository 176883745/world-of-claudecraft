// Build script for AI bot.

import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['aibot/main.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist-aibot/aibot.cjs',
  external: [
    // Node.js built-ins
    'ws',
    'fs',
    'path',
    'http',
    'https',
    'crypto',
    'stream',
    'url',
    'util',
    'events',
    'buffer',
  ],
  minify: false,
  sourcemap: true,
  target: 'node18',
});

console.log('Built dist-aibot/aibot.cjs');