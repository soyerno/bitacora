/* Load a vanilla browser script (no exports) into the current JSDOM globalThis.
 *
 * The scripts under assets/ assume a global `window.MODO` namespace; this helper
 * reads the file as text and runs it as a function whose `this` is window, so
 * the script's side effects land on the same window/document that the test sees.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

// Post-Next-16 migration: static assets live under public/. Probe public/ first, fall back to root.
export function resolveAsset(relativePath) {
  const inPublic = resolve(repoRoot, 'public', relativePath);
  if (existsSync(inPublic)) return inPublic;
  return resolve(repoRoot, relativePath);
}

export function loadAsset(relativePath) {
  const src = readFileSync(resolveAsset(relativePath), 'utf8');
  const fn = new Function('window', 'document', 'localStorage', src);
  fn.call(globalThis, globalThis.window, globalThis.document, globalThis.localStorage);
}

export function resetMODO() {
  if (globalThis.window) delete globalThis.window.MODO;
  if (globalThis.MODO) delete globalThis.MODO;
}
