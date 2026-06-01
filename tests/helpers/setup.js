/* Vitest global setup
 *
 * Node 25 exposes its own experimental localStorage backed by SQLite that
 * requires --localstorage-file to work. happy-dom / jsdom defer to that global
 * before initializing their own Storage, so localStorage.setItem/clear end up
 * undefined in tests. We replace it with a synchronous in-memory Storage that
 * matches the WHATWG Storage interface used by assets/common.js.
 */

class MemoryStorage {
  constructor() { this._map = new Map(); }
  get length() { return this._map.size; }
  key(i) { return Array.from(this._map.keys())[i] ?? null; }
  getItem(k) { return this._map.has(k) ? this._map.get(k) : null; }
  setItem(k, v) { this._map.set(String(k), String(v)); }
  removeItem(k) { this._map.delete(k); }
  clear() { this._map.clear(); }
}

// Replace any env-provided Storage class with our working one so that
// `vi.spyOn(Storage.prototype, 'setItem')` works as the tests expect.
globalThis.Storage = MemoryStorage;
if (typeof window !== 'undefined') window.Storage = MemoryStorage;

function install(target) {
  if (!target) return;
  Object.defineProperty(target, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true
  });
  Object.defineProperty(target, 'sessionStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true
  });
}

install(globalThis);
if (typeof window !== 'undefined' && window !== globalThis) install(window);
