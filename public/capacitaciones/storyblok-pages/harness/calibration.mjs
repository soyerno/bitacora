#!/usr/bin/env node
/**
 * calibration.mjs — tracking de calibración del eval del entregable (Lección 10).
 *
 * Por qué existe: el Workflow (page-builder.workflow.js, fase Eval) corre en un
 * runtime SIN filesystem, así que no puede persistir nada. La calibración —comparar
 * el score del LLM-judge contra tu veredicto humano a lo largo del tiempo— vive acá,
 * en un helper standalone que el orquestador (o vos) corre DESPUÉS del Workflow.
 *
 * El dataset es append-only (calibration.jsonl). Cada corrida = una línea JSON.
 * "Cuando el judge y el humano divergen, ahí está el aprendizaje." (Lección 10)
 *
 * Uso:
 *   # registrar una corrida (judge = salida del eval; self = auto-score del agente; human = tu 1-5)
 *   node calibration.mjs add --slug "promos/black-friday" \
 *     --judge '{"brand-voice":4,"ux-clarity":5,"content-seo-quality":4,"simplicity-scope":3}' \
 *     --self 4 --human 3 --note "copy un poco genérico en el hero"
 *
 *   # ver la calibración acumulada
 *   node calibration.mjs stats
 *
 * El dataset NO se auto-carga a ningún contexto; es para medir drift vía este script.
 */
import { appendFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATASET = join(HERE, "calibration.jsonl");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[(i += 1)] : "true";
      out[key] = val;
    }
  }
  return out;
}

function readRecords() {
  if (!existsSync(DATASET)) return [];
  return readFileSync(DATASET, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function avg(nums) {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
}

function add(args) {
  if (!args.slug || !args.judge) {
    console.error("uso: add --slug <slug> --judge '<json dim:score>' [--self N] [--human N] [--note ...]");
    process.exit(1);
  }
  const judge = JSON.parse(args.judge);
  const judgeVals = Object.values(judge);
  const record = {
    ts: new Date().toISOString(),
    slug: args.slug,
    judge,
    judgeAvg: Number(avg(judgeVals).toFixed(2)),
    self: args.self ? Number(args.self) : null,
    human: args.human ? Number(args.human) : null,
    note: args.note || "",
  };
  appendFileSync(DATASET, `${JSON.stringify(record)}\n`);
  console.log(`✓ registrado: ${record.slug} — judgeAvg ${record.judgeAvg}${record.human != null ? ` vs human ${record.human}` : ""}`);
}

function stats() {
  const recs = readRecords();
  if (!recs.length) {
    console.log("Sin registros todavía. Corré `add` después de cada eval + tu veredicto.");
    return;
  }
  const withHuman = recs.filter((r) => r.human != null);
  const judgeErr = withHuman.map((r) => Math.abs(r.judgeAvg - r.human));
  const selfErr = withHuman.filter((r) => r.self != null).map((r) => Math.abs(r.self - r.human));

  console.log(`Registros: ${recs.length} (con veredicto humano: ${withHuman.length})`);
  console.log(`Judge avg global: ${avg(recs.map((r) => r.judgeAvg)).toFixed(2)}/5`);
  if (withHuman.length) {
    console.log(`Calibración judge↔human (error abs medio): ${avg(judgeErr).toFixed(2)} ${avg(judgeErr) <= 0.5 ? "✓ calibrado" : "⚠ divergente (>0.5)"}`);
  }
  if (selfErr.length) {
    console.log(`Calibración self↔human (error abs medio): ${avg(selfErr).toFixed(2)} ${avg(selfErr) <= 0.5 ? "✓" : "⚠"}`);
  }
  const divergent = withHuman
    .filter((r) => Math.abs(r.judgeAvg - r.human) >= 1)
    .map((r) => `  · ${r.slug}: judge ${r.judgeAvg} vs human ${r.human}${r.note ? ` — ${r.note}` : ""}`);
  if (divergent.length) {
    console.log(`Divergencias ≥1 (ahí está el aprendizaje):\n${divergent.join("\n")}`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const parsed = parseArgs(rest);
if (cmd === "add") add(parsed);
else if (cmd === "stats") stats();
else {
  console.error("comandos: add | stats");
  process.exit(1);
}
