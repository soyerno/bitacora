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
  description: 'Corre los 4 gates de una página Storyblok modo-landing en paralelo (code-review+SDD · perf+CSP · a11y+SEO) con barrier antes del deploy alpha',
  phases: [
    { title: 'TDD', detail: 'verificar tests red→green del blok' },
    { title: 'Gates', detail: 'code-review+SDD · perf+CSP · a11y+SEO en paralelo' },
    { title: 'Barrier', detail: 'consolidar veredictos — bloquear si alguno falla' },
    { title: 'Deploy', detail: 'proponer deploy alpha solo si todos pasan' },
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

// ── Deploy alpha (solo si todos pasan) ─────────────────────────────────────────
phase('Deploy');
const deploy = await agent(
  `Todos los gates pasaron para ${slug}. Preparás (NO disparás sin confirmación del humano) el deploy alpha de modo-landing:
comando: gh workflow run ci-alpha.yaml -f environment=develop --ref <rama>.
Devolvé el comando exacto con la rama real, el smoke esperado (curl 200 a /${slug}) y el recordatorio de cerrar perf+CSP contra el alpha. Prod queda FUERA (gate GRC + decisión de equipo).`,
  { label: 'deploy:alpha-prep', phase: 'Deploy' }
);

return {
  status: 'ready-for-alpha',
  gates: all.map((v) => ({ gate: v.gate, passed: v.passed, evidence: v.evidence })),
  deployPlan: deploy,
  note: 'Deploy alpha preparado, NO disparado. Prod fuera de scope.',
};
