#!/usr/bin/env node
/**
 * Gate de arquitectura — ningún archivo de UI nace god-component.
 *
 * Falla si un `.tsx` bajo app/ o components/ supera BUDGET líneas, salvo que
 * esté en GRANDFATHERED. La allow-list solo puede ACHICAR: migrar un archivo
 * fuera de ella es boy-scout (lo dejás mejor que como lo encontraste); agregar
 * uno nuevo está prohibido —ese es el punto del gate—.
 *
 * En origin/main no hay god-components (el mayor es ~130 líneas), así que la
 * allow-list arranca vacía. Ese es el estado ideal: el gate es puramente
 * preventivo.
 *
 * Uso: node scripts/check-arch.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const BUDGET = 250;
const ROOTS = ["app", "components"];

/** path relativo → cap de líneas tolerado (deuda grandfathered, solo achica) */
const GRANDFATHERED = {
  // vacío a propósito: origin/main no tiene god-components
};

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && extname(p) === ".tsx") acc.push(p);
  }
  return acc;
}

const files = ROOTS.flatMap((r) => walk(r));
const offenders = [];

for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n").length;
  const cap = GRANDFATHERED[f];
  if (cap != null) {
    if (lines > cap) {
      offenders.push(`${f}: ${lines} líneas (grandfathered ≤${cap} — creció, partilo)`);
    }
  } else if (lines > BUDGET) {
    offenders.push(`${f}: ${lines} líneas (presupuesto ${BUDGET})`);
  }
}

if (offenders.length) {
  console.error(`✗ check:arch — ${offenders.length} god-component(s):`);
  for (const o of offenders) console.error("  " + o);
  console.error(
    `\nPartí el componente, o si es deuda legítima agregá su path a GRANDFATHERED en scripts/check-arch.mjs.`,
  );
  process.exit(1);
}

console.log(`✓ check:arch OK — ${files.length} .tsx ≤ ${BUDGET} líneas (0 god-components)`);
