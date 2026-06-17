// page-builder.workflow.js — orquestador de gates para crear una página Storyblok en modo-landing.
//
// Lo dispara el skill/agent `modo-landing-page-builder` (o vos con la tool Workflow).
// Patrón: scaffold + TDD ya corrieron (fases interactivas del curso); este Workflow
// corre los 3 grupos de gates EN PARALELO, hace barrier, y solo entonces propone deploy alpha.
//
// args (JSON): {
//   repoPath: "/ruta/a/modo-landing",
//   slug: "promos/black-friday",
//   blok: "SectionPromoBanner",          // null si solo autorás story con bloks existentes
//   alphaUrl: "https://<alpha-host>/<slug>",  // null si todavía no hay alpha
//   prNumber: 1490                        // null si todavía no hay PR
// }
//
// Cada gate retorna un veredicto estructurado. El deploy NO se sugiere si algún gate falla.

export const meta = {
  name: 'modo-landing-page-builder',
  description: 'Corre los 4 gates de una página Storyblok modo-landing en paralelo (code-review+SDD · perf+CSP · a11y+SEO), un eval LLM-judge del entregable (rúbrica MODO 1-5), con doble barrier antes del deploy alpha',
  phases: [
    { title: 'TDD', detail: 'verificar tests red→green del blok' },
    { title: 'Gates', detail: 'code-review+SDD · perf+CSP · a11y+SEO en paralelo' },
    { title: 'Barrier', detail: 'consolidar veredictos — bloquear si alguno falla' },
    { title: 'Eval', detail: 'LLM-judge: puntúa el entregable 1-5 por dimensión (rúbrica MODO)' },
    { title: 'Deploy', detail: 'proponer deploy alpha solo si gates pasan y el eval supera el umbral' },
  ],
};

const ctx = args || {};
const repo = ctx.repoPath || '.';
const slug = ctx.slug || '<slug>';
const blok = ctx.blok || null;

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['gate', 'passed', 'findings', 'evidence'],
  properties: {
    gate: { type: 'string' },
    passed: { type: 'boolean' },
    findings: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'string', description: 'comando corrido + salida/links que prueban el veredicto' },
  },
};

// Eval del entregable (LLM-judge): score cualitativo 1-5 por dimensión, complementa
// los gates pass/fail. Captura calidad que el binario no ve (voz de marca, claridad UX,
// simplicidad/scope). Barrier propio: umbral por dimensión + promedio.
const EVAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['dimension', 'score', 'reasons', 'blocking'],
  properties: {
    dimension: { type: 'string' },
    score: { type: 'integer', minimum: 1, maximum: 5 },
    reasons: { type: 'array', items: { type: 'string' } },
    blocking: { type: 'boolean', description: 'true si score < 3 o hay un fallo que bloquea el deploy' },
  },
};

// ── Fase TDD ────────────────────────────────────────────────────────────────
phase('TDD');
const tdd = await agent(
  `En el repo modo-landing (${repo}), verificá el gate TDD del blok ${blok || '(ninguno — solo story)'} para la página ${slug}.
Corré los tests (pnpm test o npx jest del path del blok). Criterio: test RTL semántico, SIN snapshots, cada scenario de la spec con su it(), suite verde.
Si no hay blok nuevo, verificá que la story usa solo bloks ya testeados y marcá passed:true con esa evidencia.
NO declares passed sin la salida real de jest. Si los tests fallan o no existen, passed:false con los findings.`,
  { label: 'gate:tdd', phase: 'TDD', schema: VERDICT_SCHEMA }
);

// ── Fase Gates (paralelo) ─────────────────────────────────────────────────────
phase('Gates');
const gateSpecs = [
  {
    key: 'code-review+sdd',
    prompt: `Gate Code review + SDD para la página ${slug} en modo-landing (${repo})${ctx.prNumber ? `, PR #${ctx.prNumber}` : ''}.
Corré /guardia o pr-quality-review + consultá SonarCloud (project key del repo). Criterio: 0 new smells, 0 hotspots, ≤3% duplicación, sin console.*, sin hex hardcodeado, tipos en props. Además sdd-verify: implementación matchea spec + tasks tildadas.
Evidencia obligatoria: link/salida del Quality Gate. No passed sin eso. Sonar corre en olas — esperá el scan final.`,
  },
  {
    key: 'perf+csp',
    prompt: `Gate Performance + CSP para la página ${slug} en modo-landing (${repo}).
${ctx.alphaUrl ? `Corré lighthouse_audit contra ${ctx.alphaUrl} (LCP/CLS dentro de umbral) y validá CSP/security headers (frontend-security-checklist Layer 3) contra ese host.` : 'No hay alpha desplegado todavía — evaluá perf/CSP de forma estática: revisá si el blok es el LCP (los bloks rinden con dynamic ssr:false), si carga assets de dominios nuevos no declarados en la CSP de next.config.js, e imágenes sin AVIF/quality. passed:false si hay riesgo claro; si todo ok estáticamente, passed:true con la salvedad de re-verificar contra el alpha.'}
No passed sin evidencia concreta (reporte lighthouse / salida del validador CSP / grep de next.config.js).`,
  },
  {
    key: 'a11y+seo',
    prompt: `Gate a11y + SEO/GEO para la página ${slug} en modo-landing (${repo}).
Corré /modo-seo-geo-audit + revisión WCAG del blok. Criterio: alt descriptivo (nunca alt=""), roles correctos, foco navegable, contraste con tokens; content.seo[0] seteado; JSON-LD válido (Rich Results); URL-as-state para filtros si la página los tiene.
No passed sin evidencia (reporte del audit + validación Rich Results).`,
  },
];

const verdicts = await parallel(
  gateSpecs.map((g) => () =>
    agent(g.prompt, { label: `gate:${g.key}`, phase: 'Gates', schema: VERDICT_SCHEMA })
  )
);

// ── Barrier ───────────────────────────────────────────────────────────────────
phase('Barrier');
const all = [tdd, ...verdicts].filter(Boolean);
const failed = all.filter((v) => !v.passed);
log(`Gates: ${all.length - failed.length}/${all.length} passed${failed.length ? ` — BLOQUEADO por: ${failed.map((f) => f.gate).join(', ')}` : ''}`);

if (failed.length > 0) {
  return {
    status: 'blocked',
    reason: 'Uno o más gates no pasaron. Fix + re-correr antes de deploy alpha.',
    failed: failed.map((f) => ({ gate: f.gate, findings: f.findings, evidence: f.evidence })),
    passed: all.filter((v) => v.passed).map((v) => v.gate),
  };
}

// ── Fase Eval (LLM-judge sobre el entregable) ──────────────────────────────────
// Los gates dijeron pass/fail. El eval puntúa CUÁN BIEN quedó el entregable en las
// dimensiones que el binario no captura. Barrier propio: cada dimensión ≥ MIN y
// promedio ≥ AVG. Capa 6.5 del stack (entre gates y deploy). Ver Lección 10 (deliver-eval).
phase('Eval');
const EVAL_THRESHOLD = { min: 3, avg: 4 };
const EVAL_DIMENSIONS = [
  {
    key: 'brand-voice',
    prompt: `Evaluá (1-5) la FIDELIDAD DE MARCA del entregable de la página ${slug} en modo-landing (${repo}).
Mirá: copy en voz MODO (voseo rioplatense, claro, humano — nunca robótico ni telegráfico), uso de tokens del design system (sin hex hardcodeado), fidelidad a @playsistemico/modo-ui-lib-web. 5 = indistinguible de una página MODO de producción; 1 = se va de marca. blocking:true si hay hex hardcodeado o copy fuera de voz. Justificá con ejemplos concretos (líneas/archivos).`,
  },
  {
    key: 'ux-clarity',
    prompt: `Evaluá (1-5) la CLARIDAD UX del entregable de la página ${slug} en modo-landing (${repo}).
Mirá: jerarquía visual, flujo, carga cognitiva, mobile-first (no rompe en 375px), que el usuario entienda qué hacer sin esfuerzo. 5 = obvio y limpio; 1 = confuso/abrumador. blocking:true si hay una barrera de uso real. Justificá concreto.`,
  },
  {
    key: 'content-seo-quality',
    prompt: `Evaluá (1-5) la CALIDAD DE CONTENIDO + SEO/GEO del entregable de la página ${slug} (más allá del pass/fail del gate).
Mirá: calidad/utilidad del contenido editorial, completitud y corrección del JSON-LD, metadata (seo[0]), URL-as-state para filtros, descubribilidad por crawlers/IA. 5 = completo y de alta calidad; 1 = mínimo/pobre. blocking:true si falta JSON-LD o metadata core. Justificá concreto.`,
  },
  {
    key: 'simplicity-scope',
    prompt: `Evaluá (1-5) la SIMPLICIDAD Y EL SCOPE del entregable de la página ${slug} en modo-landing (${repo}) — Principio 2 del método.
Mirá: ¿es el mínimo que resuelve el pedido? ¿hay features no pedidas, abstracciones de un solo uso, manejo de errores/config especulativo? ¿el diff es quirúrgico? 5 = mínimo y quirúrgico; 1 = sobre-construido. blocking:true si un senior lo llamaría sobre-complicado. Justificá con el diff.`,
  },
];

const evalScores = (await parallel(
  EVAL_DIMENSIONS.map((d) => () =>
    agent(d.prompt, { label: `eval:${d.key}`, phase: 'Eval', schema: EVAL_SCHEMA })
  )
)).filter(Boolean);

const evalAvg = evalScores.length
  ? evalScores.reduce((s, e) => s + e.score, 0) / evalScores.length
  : 0;
const evalBlockers = evalScores.filter((e) => e.blocking || e.score < EVAL_THRESHOLD.min);
log(`Eval: avg ${evalAvg.toFixed(1)}/5 · ${evalScores.map((e) => `${e.dimension}:${e.score}`).join(' ')}${evalBlockers.length ? ` — BLOQUEADO por: ${evalBlockers.map((b) => b.dimension).join(', ')}` : ''}`);

if (evalBlockers.length > 0 || evalAvg < EVAL_THRESHOLD.avg) {
  return {
    status: 'blocked',
    reason: `Eval del entregable por debajo del umbral (cada dimensión ≥ ${EVAL_THRESHOLD.min}, promedio ≥ ${EVAL_THRESHOLD.avg}). Gates pasaron, pero la calidad no llega — fix + re-correr.`,
    gates: all.map((v) => ({ gate: v.gate, passed: v.passed })),
    eval: { avg: Number(evalAvg.toFixed(2)), scores: evalScores },
    blockers: evalBlockers.map((b) => ({ dimension: b.dimension, score: b.score, reasons: b.reasons })),
  };
}

// ── Deploy alpha (solo si gates pasan Y el eval supera el umbral) ────────────────
phase('Deploy');
const deploy = await agent(
  `Todos los gates pasaron y el eval del entregable superó el umbral (avg ${evalAvg.toFixed(1)}/5) para ${slug}. Preparás (NO disparás sin confirmación del humano) el deploy alpha de modo-landing:
comando: gh workflow run ci-alpha.yaml -f environment=develop --ref <rama>.
Devolvé el comando exacto con la rama real, el smoke esperado (curl 200 a /${slug}) y el recordatorio de cerrar perf+CSP contra el alpha. Prod queda FUERA (gate GRC + decisión de equipo).`,
  { label: 'deploy:alpha-prep', phase: 'Deploy' }
);

return {
  status: 'ready-for-alpha',
  gates: all.map((v) => ({ gate: v.gate, passed: v.passed, evidence: v.evidence })),
  eval: { avg: Number(evalAvg.toFixed(2)), scores: evalScores.map((e) => ({ dimension: e.dimension, score: e.score })) },
  deployPlan: deploy,
  note: 'Deploy alpha preparado, NO disparado. Gates + eval OK. Prod fuera de scope.',
};
