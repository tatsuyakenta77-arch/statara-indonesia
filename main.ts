// Statara — the hand-in program for the national statistics site bounty.
//
// The site is plain static files in app/ (index.html plus ES modules and one
// stylesheet, no build step, no network request). This program copies app/
// and screenshots/ next to this file into the output directory and writes
// dossier.json there with the vendored make.fun library, so the sealed scorer
// can check the site and the judge can read its outline.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Inside the grader the output directory is /output. The program is
// deterministic: the same repository always writes the same bytes.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Keep the output directory itself (the grader may have mounted it) and
// replace only the three entries this program owns.
mkdirSync(outputDir, { recursive: true });
for (const name of readdirSync(outputDir)) {
  if (name === 'app' || name === 'screenshots' || name === 'dossier.json') {
    rmSync(join(outputDir, name), { recursive: true, force: true });
  }
}

cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's own: at most 4 screenshots of 256 KiB, at most
// 993 entries and 16 MiB under app/. Only text_max_bytes changes the bytes
// written; the rest refuse an entry the scorer would refuse anyway.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
