import type { Metadata } from "next";
import { Quicksand, Red_Hat_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const desc =
  "App educativa interactiva: fundamentos de inversión, quiz de perfil de riesgo, simulador de cartera diversificada y checklist para elegir broker.";

// Anti-FOUC: aplica el tema guardado antes del primer paint.
// `auto` deja que el CSS resuelva por prefers-color-scheme.
const themeScript = `(function(){try{var t=localStorage.getItem('aprende-invertir-theme');if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-red-hat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aprende a Invertir",
  description: desc,
  openGraph: {
    type: "website",
    siteName: "Aprende a Invertir",
    title: "Aprende a Invertir",
    description: desc,
    locale: "es_AR",
  },
};

export const viewport = { themeColor: "#008859" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${quicksand.variable} ${redHat.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="sticky top-0 z-10 border-b border-border bg-bg/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
            <span className="flex items-center gap-2 font-display font-bold text-ink">
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-white"
              >
                $
              </span>
              Aprende a <span className="text-accent">Invertir</span>
            </span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-muted">
            Material educativo — no es asesoramiento financiero. Código en{" "}
            <a
              href="https://github.com/soyerno/bitacora/tree/main/apps/aprende-a-invertir"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-accent"
            >
              GitHub
            </a>
            .
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
