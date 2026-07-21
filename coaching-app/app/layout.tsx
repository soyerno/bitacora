import type { Metadata } from "next";
import { Quicksand, Red_Hat_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const desc =
  "Programa interactivo estilo Duolingo para aprender coaching ontológico: el observador, actos lingüísticos, juicios, promesas, emociones, valores, creencias, escucha y quiebres — con ejercicios, reflexiones y cuaderno de notas.";

// Anti-FOUC: aplica el tema guardado antes del primer paint.
const themeScript = `(function(){try{var t=localStorage.getItem('coaching-theme');if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

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
  title: {
    default: "Coaching Ontológico — programa interactivo",
    template: "%s · Coaching Ontológico",
  },
  description: desc,
  openGraph: {
    type: "website",
    siteName: "Coaching Ontológico",
    title: "Coaching Ontológico — programa interactivo",
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
      </body>
    </html>
  );
}
