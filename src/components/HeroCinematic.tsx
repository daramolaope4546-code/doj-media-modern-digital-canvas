import { useEffect, useRef, useState } from "react";

/**
 * Code-generated cinematic "studio showreel" background.
 * A 10s seamless loop drawn on canvas: dark studio, wine light sweeps,
 * floating UI/editing panels, timeline + waveform, glowing particles.
 * Falls back to a lightweight animated gradient on mobile / reduced motion.
 */

const LOOP = 10; // seconds

type P = { x: number; y: number; z: number; r: number; s: number };

export function HeroCinematic({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lite, setLite] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    const weak = (navigator as any).hardwareConcurrency
      ? (navigator as any).hardwareConcurrency <= 4
      : false;
    setLite(reduced || small || weak);
  }, []);

  useEffect(() => {
    if (lite) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const rnd = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    };
    const r = rnd(20260812);

    const particles: P[] = Array.from({ length: 90 }, () => ({
      x: r(),
      y: r(),
      z: 0.2 + r() * 0.8,
      r: 0.6 + r() * 1.8,
      s: 0.15 + r() * 0.55,
    }));

    // Abstract "screens" floating in the studio (design / edit / stream)
    const panels = Array.from({ length: 7 }, (_, i) => ({
      x: 0.06 + r() * 0.88,
      y: 0.12 + r() * 0.72,
      w: 0.09 + r() * 0.13,
      h: 0.06 + r() * 0.1,
      z: 0.25 + r() * 0.75,
      kind: i % 3,
      phase: r(),
    }));

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = ((now - start) / 1000) % LOOP;
      const p = t / LOOP; // 0..1 loop position
      const tau = p * Math.PI * 2;

      // subtle camera drift (loops perfectly)
      const camX = Math.sin(tau) * 18;
      const camY = Math.cos(tau) * 10;
      const zoom = 1 + Math.sin(tau) * 0.012;

      ctx.clearRect(0, 0, w, h);

      // base studio gradient
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0b0709");
      g.addColorStop(0.55, "#140a10");
      g.addColorStop(1, "#080506");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2 + camX, -h / 2 + camY);

      // wine key light
      const lx = w * (0.28 + Math.sin(tau) * 0.08);
      const ly = h * (0.35 + Math.cos(tau * 2) * 0.06);
      const key = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.65);
      key.addColorStop(0, "rgba(160,20,55,0.42)");
      key.addColorStop(0.45, "rgba(128,0,32,0.14)");
      key.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = key;
      ctx.fillRect(0, 0, w, h);

      const rx = w * (0.82 - Math.sin(tau) * 0.05);
      const ry = h * (0.7 + Math.sin(tau * 1.5) * 0.05);
      const rim = ctx.createRadialGradient(rx, ry, 0, rx, ry, Math.max(w, h) * 0.5);
      rim.addColorStop(0, "rgba(255,255,255,0.10)");
      rim.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, w, h);

      // perspective floor grid
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = "rgba(190,120,140,0.35)";
      ctx.lineWidth = 1;
      const horizon = h * 0.62;
      for (let i = 0; i <= 16; i++) {
        const k = i / 16;
        const x = (k - 0.5) * w * 2.4 + w / 2;
        ctx.beginPath();
        ctx.moveTo(w / 2 + (x - w / 2) * 0.12, horizon);
        ctx.lineTo(x, h * 1.15);
        ctx.stroke();
      }
      for (let i = 1; i <= 12; i++) {
        const k = ((i / 12 + p * (1 / 12)) % 1) ** 2.4;
        const y = horizon + k * (h * 0.55);
        ctx.globalAlpha = 0.22 * (1 - k) + 0.03;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // floating abstract screens
      panels.forEach((pl) => {
        const ph = (p + pl.phase) % 1;
        const fade =
          Math.min(1, ph / 0.18) * Math.min(1, (1 - ph) / 0.18) * (0.35 + pl.z * 0.5);
        const drift = Math.sin((p + pl.phase) * Math.PI * 2) * 14 * pl.z;
        const px = pl.x * w + drift;
        const py = pl.y * h - Math.cos((p + pl.phase) * Math.PI * 2) * 10 * pl.z;
        const pw = pl.w * w;
        const phh = pl.h * h;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(px, py);
        // glass panel
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.strokeStyle = "rgba(230,190,200,0.28)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(0, 0, pw, phh, 8);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(200,40,80,0.55)";
        if (pl.kind === 0) {
          // design canvas: shapes
          ctx.beginPath();
          ctx.arc(pw * 0.28, phh * 0.5, Math.min(pw, phh) * 0.18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeRect(pw * 0.52, phh * 0.3, pw * 0.3, phh * 0.4);
        } else if (pl.kind === 1) {
          // editing timeline
          for (let i = 0; i < 3; i++) {
            const y = phh * (0.28 + i * 0.22);
            ctx.globalAlpha = fade * (0.5 + i * 0.2);
            ctx.fillStyle = i === 1 ? "rgba(200,40,80,0.7)" : "rgba(255,255,255,0.35)";
            ctx.fillRect(pw * 0.1, y, pw * (0.35 + 0.45 * ((p * 1.3 + i * 0.3) % 1)), 3);
          }
        } else {
          // live stream: waveform + rec dot
          ctx.globalAlpha = fade;
          ctx.beginPath();
          for (let i = 0; i <= 24; i++) {
            const x = pw * 0.1 + (i / 24) * pw * 0.8;
            const y =
              phh / 2 +
              Math.sin(i * 0.7 + p * Math.PI * 2 * 2 + pl.phase * 6) *
                phh *
                0.22 *
                Math.sin((i / 24) * Math.PI);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.fillStyle = "rgba(220,50,80,0.9)";
          ctx.beginPath();
          ctx.arc(pw - 10, 10, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // glowing particles (dust in the light)
      particles.forEach((pt) => {
        const y = (pt.y + p * pt.s * 0.6) % 1;
        const x = (pt.x + Math.sin((p + pt.x) * Math.PI * 2) * 0.01 + 1) % 1;
        const a = 0.12 + pt.z * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,225,235,${a})`;
        ctx.arc(x * w, (1 - y) * h, pt.r * pt.z, 0, Math.PI * 2);
        ctx.fill();
      });

      // light sweep (anamorphic streak)
      const sweep = ((p * 2) % 1);
      const sx = -0.2 * w + sweep * w * 1.4;
      const sg = ctx.createLinearGradient(sx - w * 0.18, 0, sx + w * 0.18, 0);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, `rgba(255,220,230,${0.06 + 0.05 * Math.sin(sweep * Math.PI)})`);
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // vignette + scanline texture
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.78);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [lite]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* lightweight animated fallback (mobile / reduced motion / weak devices) */}
      <div className="absolute inset-0 bg-[#0b0709]">
        <div className="absolute -left-1/4 top-0 h-[70%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(160,20,55,0.45),transparent_65%)] blur-3xl animate-float-slow" />
        <div
          className="absolute -right-1/4 bottom-0 h-[70%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(128,0,32,0.35),transparent_65%)] blur-3xl animate-float-slow"
          style={{ animationDelay: "3s" }}
        />
      </div>
      {!lite && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full animate-fade-in" />}
      {/* readability scrim */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,4,5,0.88)_0%,rgba(6,4,5,0.62)_45%,rgba(6,4,5,0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
