"use client";

import { useEffect, useRef } from "react";

/**
 * Hero animado de la sección Capacitaciones: agentes (skills MODO) orbitando
 * el nodo central "curso" — cuenta visualmente que el harness son los agentes.
 * Canvas, respeta prefers-reduced-motion (cae a estático).
 */
const AGENTS = ["SDD", "TDD", "SEO", "CSP", "a11y", "UI", "SB", "k8s"];
const GREEN = (a: number) => `rgba(0,136,89,${a})`;

export default function CapacitacionesHero() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const size = () => {
      cv.width = cv.clientWidth * DPR;
      cv.height = cv.clientHeight * DPR;
    };
    size();
    window.addEventListener("resize", size);

    const surface = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#fff";

    const frame = (t: number) => {
      const w = cv.width,
        h = cv.height,
        cx = w / 2,
        cy = h / 2,
        R = Math.min(w, h) * 0.34;
      ctx.clearRect(0, 0, w, h);
      const rot = reduced ? 0 : t * 0.00018;
      ctx.lineWidth = DPR;
      ctx.strokeStyle = GREEN(0.12);
      [R * 0.62, R].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      const pts = AGENTS.map((lab, i) => {
        const ang = rot + (i / AGENTS.length) * Math.PI * 2;
        const r = R * (i % 2 ? 0.62 : 1);
        return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, lab };
      });
      pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = GREEN(0.16 + 0.12 * Math.sin(t * 0.002 + i));
        ctx.lineWidth = 1.2 * DPR;
        ctx.stroke();
      });
      pts.forEach((p, i) => {
        const pulse = reduced ? 6 : 6 + 1.6 * Math.sin(t * 0.004 + i);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse * DPR, 0, Math.PI * 2);
        ctx.fillStyle = GREEN(0.9);
        ctx.fill();
        ctx.fillStyle = surface();
        ctx.font = `700 ${10 * DPR}px Quicksand, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.lab, p.x, p.y);
      });
      const cr = R * 0.26;
      const g = ctx.createLinearGradient(cx - cr, cy - cr, cx + cr, cy + cr);
      g.addColorStop(0, "#00a86b");
      g.addColorStop(1, "#00663f");
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `700 ${20 * DPR}px Quicksand, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("curso", cx, cy);
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    if (reduced) frame(0);
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="mx-auto block aspect-square w-full max-w-[360px]"
      role="img"
      aria-label="Diagrama animado: agentes MODO orbitando un curso"
    />
  );
}
