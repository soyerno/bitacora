import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Los 34 HTML autocontenidos (decks/rfcs/rd/...) viven en `public/` tras la
  // Fase 3 y Vercel los sirve directo en su misma ruta (/decks/x.html). No
  // necesitan rewrites mientras estén bajo public/.
  async redirects() {
    return [];
  },
};

export default nextConfig;
