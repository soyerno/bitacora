/**
 * Perfil de la bitácora — lo único que cambia entre developers.
 * Instanciar el template = forkear y editar este archivo + publicar contenido.
 * El código (app/, components/, lib/) es idéntico entre instancias.
 */

export type Visibility = "public" | "org" | "private";

export interface SectionConfig {
  type: string;
  label: string;
  feed: string; // ruta del feed JSON bajo public/
  key: string; // key del array dentro del feed (ojo: rd usa "items")
  href: string; // ruta de la página de listado
  visibility: Visibility;
  /** Mini-label arriba del título en la home (ej. "Colección 1", "Stack"). */
  eyebrow?: string;
  /** Texto corto explicando qué hay adentro de la sección. */
  description?: string;
  /** Sufijo del count en la home ("decks", "días", "tools"). */
  countSuffix?: string;
}

/**
 * Bloque de consent del manifest — HINT/declaración local del dev. La autoridad
 * real vive Govern-side (consent_records, SPEC-111: append-only, revocable,
 * RTBF <30d). Si `ingestion=false` Govern no debe ingestar; el adapter respeta
 * el flag pero el consent vinculante sigue siendo el de Govern.
 */
export interface ConsentConfig {
  ingestion: boolean;
  /** Casos de uso autorizados, ej. ["org-clone"], ["org-clone","cross-org-search"]. */
  scope: string[];
  /** Fecha (YYYY-MM-DD) en que el dev confirmó este consent localmente. */
  granted_at: string | null;
}

export interface BitacoraConfig {
  /** Título de marca del sitio (chrome + metadata). */
  siteTitle: string;
  developer: {
    id: string;
    name: string;
    role: string;
    github: string;
  };
  /** Dominio público de ESTA bitácora. Override por env en deploy. */
  baseUrl: string;
  /** Default si una sección no declara visibilidad. Conservador: org, no public. */
  defaultVisibility: Visibility;
  /** Consent declarativo (hint). Autoridad real: Govern (SPEC-111). */
  consent: ConsentConfig;
  sections: SectionConfig[];
}

export const config: BitacoraConfig = {
  siteTitle: "Erno × MODO",
  developer: {
    id: "hernan-desouza",
    name: "Hernán De Souza",
    role: "Sr AI Engineer",
    github: "SoyErnoModo",
  },
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://soyernomodo.github.io/erno-modo",
  defaultVisibility: "org",
  consent: {
    ingestion: true,
    scope: ["org-clone"],
    granted_at: "2026-05-28",
  },
  sections: [
    {
      type: "bitacora",
      label: "Bitácora diaria",
      feed: "/bitacora/bitacora.json",
      key: "items",
      href: "/bitacora",
      visibility: "org",
      eyebrow: "Colección 1",
      description:
        "Digest diario de aprendizajes: una historia por feature o lección del día. TLDR + historias navegables, voz rioplatense con claridad pedagógica. La idea es no re-aprender lo aprendido.",
      countSuffix: "días",
    },
    {
      type: "decks",
      label: "Decks",
      feed: "/decks/decks.json",
      key: "decks",
      href: "/decks",
      visibility: "public",
      eyebrow: "Colección 2",
      description:
        "Presentaciones HTML versionadas en este repo. Búsqueda + filtros por tema y status, sort por recencia.",
      countSuffix: "decks",
    },
    {
      type: "rfcs",
      label: "RFCs",
      feed: "/rfcs/rfcs.json",
      key: "rfcs",
      href: "/rfcs",
      visibility: "org",
      eyebrow: "Colección 3",
      description:
        "Catálogo curado de documentos vivos en Drive y GitHub. Tabs por status (Draft/RFC/Completo/Archivado), chips por área.",
      countSuffix: "RFCs",
    },
    {
      type: "rd",
      label: "R&D",
      feed: "/rd/rd.json",
      key: "items",
      href: "/rd",
      visibility: "public",
      eyebrow: "Colección 4",
      description:
        "Investigaciones técnicas previas a un RFC formal. Mapeos de API, análisis de plataforma, genealogía de proyectos. Long-form HTML con diagramas inline y gráficos.",
      countSuffix: "research",
    },
    {
      type: "postmans",
      label: "Postmans",
      feed: "/postmans/postmans.json",
      key: "postmans",
      href: "/postmans",
      visibility: "org",
      eyebrow: "Colección 5",
      description:
        "Configuraciones de URLs de prueba que abren pantallas con query strings. QA de deep links, validación de branding por banco y reproducción de bugs reportados.",
      countSuffix: "postmans",
    },
    {
      type: "proyectos",
      label: "Proyectos",
      feed: "/proyectos/proyectos.json",
      key: "categories",
      href: "/proyectos",
      visibility: "org",
      eyebrow: "Colección 6",
      description:
        "Repos del ecosistema MODO (@playsistemico) donde aporté PRs. Agrupados por capa: web, design system, SDK, BFFs, backoffices, infra. Con conteo de PRs por repo.",
      countSuffix: "categorías",
    },
    {
      type: "herramientas",
      label: "Herramientas",
      feed: "/herramientas/herramientas.json",
      key: "categories",
      href: "/herramientas",
      visibility: "public",
      eyebrow: "Stack",
      description:
        "Skills, MCPs y plugins que uso día a día en Claude Code. Agrupadas por uso real en 8 categorías.",
      countSuffix: "tools",
    },
    {
      type: "skills",
      label: "Skills MODO",
      feed: "/skills/skills.json",
      key: "skills",
      href: "/skills",
      visibility: "public",
      eyebrow: "Bundles",
      description:
        "Skills MODO empaquetadas como ZIP descargable — instalar en ~/.claude/skills/ y disponibles en Claude Code.",
      countSuffix: "skills",
    },
    {
      type: "capacitaciones",
      label: "Capacitaciones",
      feed: "/capacitaciones/capacitaciones.json",
      key: "capacitaciones",
      href: "/capacitaciones",
      visibility: "public",
      eyebrow: "Cursos",
      description:
        "Cursos interactivos Claude-Code con los agentes MODO como harness: Storyblok, deploy a playsistemico, Next 16, SEO/GEO, Tailwind y tickets JSM. Sidebar con progreso y checklists que se guardan solos.",
      countSuffix: "cursos",
    },
  ],
};
