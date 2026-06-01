import type { Metadata } from "next";
import { Quicksand, Red_Hat_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { config } from "@/bitacora.config";
import "./globals.css";

const { developer, siteTitle, baseUrl } = config;
const desc = `${developer.name} · ${developer.role} @ MODO — decks, RFCs, R&D y herramientas.`;

// Anti-FOUC: aplica el tema guardado antes del primer paint (misma key que el
// sitio estático). `auto` deja que el CSS resuelva por prefers-color-scheme.
const themeScript = `(function(){try{var t=localStorage.getItem('modo-decks-theme');if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

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
  title: siteTitle,
  description: desc,
  authors: [{ name: developer.name }],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "profile",
    siteName: siteTitle,
    title: siteTitle,
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
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
