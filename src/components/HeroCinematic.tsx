import { useEffect, useRef, useState } from "react";

/**
 * DOJ MEDIA light studio loop.
 *
 * A premium, minimal creative-agency animation drawn on canvas over a WHITE
 * background: soft gray shadows, thin flowing lines, elegant abstract panels that
 * hint at graphic design, web UI, video timelines, motion curves and live
 * streaming, plus a few light particles and a very subtle DOJ MEDIA wordmark.
 *
 * Everything is a pure function of the normalised loop position `p` (0..1) using
 * sin/cos of `p * 2PI` or wrapped values faded at the seam, so the last frame
 * matches the first exactly. Motion is slow and low-contrast so hero text and the
 * portrait stay perfectly readable.
 *
 * Falls back to a static soft-gradient wash on mobile / reduced motion.
 */

const LOOP = 32; // seconds — slow and calm

type P = { x: number; y: number; z: number; r: number; s: number; tw: number };

const WINE = "128,0,32";
const WINE_SOFT = "160,30,60";
const INK = "40,32,36";

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
    const r = rnd(20260813);
    const TAU = Math.PI * 2;
    const seamFade = (k: number, edge = 0.18) =>
      Math.min(1, k / edge) * Math.min(1, (1 - k) / edge);

    const particles: P[] = Array.from({ length: 42 }, () => ({
      x: r(),
      y: r(),
      z: 0.25 + r() * 0.75,
      r: 0.7 + r() * 1.5,
      s: 1 + Math.floor(r() * 2),
      tw: r(),
    }));

    // Abstract panels, biased to the right/upper areas so they never crowd the
    // left-hand hero copy; the portrait sits above them anyway.
    const panels = [
      { x: 0.5, y: 0.16, w: 0.15, h: 0.1, kind: 1, phase: 0.05, z: 0.7 },
      { x: 0.72, y: 0.1, w: 0.13, h: 0.09, kind: 2, phase: 0.3, z: 0.55 },
      { x: 0.86, y: 0.34, w: 0.12, h: 0.085, kind: 0, phase: 0.55, z: 0.8 },
      { x: 0.56, y: 0.62, w: 0.14, h: 0.09, kind: 3, phase: 0.72, z: 0.6 },
      { x: 0.8, y: 0.74, w: 0.13, h: 0.085, kind: 4, phase: 0.15, z: 0.75 },
      { x: 0.33, y: 0.78, w: 0.12, h: 0.08, kind: 2, phase: 0.88, z: 0.5 },
      { x: 0.14, y: 0.14, w: 0.11, h: 0.075, kind: 0, phase: 0.42, z: 0.45 },
    ];

    let raf = 0;
    const start = performance.now();

    /* --------------------------- panel content ---------------------------- */

    const paintDesign = (pw: number, ph: number, p: number, ph0: number) => {
      ctx.strokeStyle = `rgba(${WINE_SOFT},0.45)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pw * 0.32, ph * 0.48, Math.min(pw, ph) * 0.2, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${INK},0.22)`;
      ctx.strokeRect(pw * 0.48, ph * 0.26, pw * 0.3, ph * 0.4);
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.lineDashOffset = -((p + ph0) % 1) * 9;
      ctx.strokeStyle = `rgba(${INK},0.18)`;
      ctx.strokeRect(pw * 0.46, ph * 0.24, pw * 0.34, ph * 0.44);
      ctx.restore();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(${INK},${0.1 - i * 0.02})`;
        ctx.fillRect(pw * 0.1, ph * (0.76 + i * 0.07), pw * (0.5 - i * 0.12), 1.5);
      }
    };

    const paintWebUI = (pw: number, ph: number, p: number, ph0: number) => {
      ctx.fillStyle = `rgba(${INK},0.07)`;
      ctx.fillRect(pw * 0.08, ph * 0.14, pw * 0.84, ph * 0.1);
      ctx.fillStyle = `rgba(${WINE},0.35)`;
      ctx.fillRect(pw * 0.74, ph * 0.16, pw * 0.16, ph * 0.06);
      ctx.fillStyle = `rgba(${INK},0.09)`;
      ctx.fillRect(pw * 0.08, ph * 0.32, pw * 0.44, ph * 0.34);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(${INK},0.06)`;
        ctx.fillRect(pw * (0.58 + i * 0.12), ph * 0.32, pw * 0.1, ph * 0.34);
      }
      const k = (p + ph0) % 1;
      ctx.save();
      ctx.globalAlpha *= seamFade(k, 0.22);
      ctx.fillStyle = `rgba(${WINE},0.4)`;
      ctx.fillRect(pw * 0.93, ph * (0.18 + k * 0.58), 2, ph * 0.14);
      ctx.restore();
    };

    const paintTimeline = (pw: number, ph: number, p: number, ph0: number) => {
      for (let i = 0; i < 4; i++) {
        const y = ph * (0.22 + i * 0.18);
        const len = 0.3 + 0.25 * (0.5 + 0.5 * Math.sin((p + ph0 + i * 0.13) * TAU));
        ctx.fillStyle = i === 1 ? `rgba(${WINE},0.4)` : `rgba(${INK},0.12)`;
        ctx.fillRect(pw * 0.08, y, pw * len, 3);
        ctx.fillStyle = `rgba(${INK},0.05)`;
        ctx.fillRect(pw * (0.08 + len), y, pw * (0.84 - len), 3);
      }
      const k = (p + ph0) % 1;
      ctx.save();
      ctx.globalAlpha *= seamFade(k, 0.14);
      ctx.strokeStyle = `rgba(${WINE},0.45)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pw * (0.08 + k * 0.84), ph * 0.12);
      ctx.lineTo(pw * (0.08 + k * 0.84), ph * 0.9);
      ctx.stroke();
      ctx.restore();
    };

    const paintMotion = (pw: number, ph: number, p: number, ph0: number) => {
      const t = (p + ph0) * TAU;
      ctx.strokeStyle = `rgba(${WINE_SOFT},0.4)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pw * 0.1, ph * 0.78);
      ctx.bezierCurveTo(
        pw * (0.35 + 0.05 * Math.sin(t)),
        ph * (0.72 + 0.12 * Math.cos(t)),
        pw * (0.6 + 0.05 * Math.cos(t)),
        ph * (0.32 - 0.1 * Math.sin(t)),
        pw * 0.9,
        ph * 0.22,
      );
      ctx.stroke();
      ctx.fillStyle = `rgba(${INK},0.25)`;
      [0.1, 0.5, 0.9].forEach((kx, i) => {
        const ky = 0.78 - i * 0.28 + 0.03 * Math.sin(t + i);
        ctx.save();
        ctx.translate(pw * kx, ph * ky);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-2.5, -2.5, 5, 5);
        ctx.restore();
      });
      ctx.beginPath();
      ctx.fillStyle = `rgba(${WINE},0.5)`;
      ctx.arc(pw * (0.5 + 0.26 * Math.cos(t)), ph * (0.5 + 0.2 * Math.sin(t)), 2.4, 0, TAU);
      ctx.fill();
    };

    const paintLive = (pw: number, ph: number, p: number, ph0: number) => {
      ctx.strokeStyle = `rgba(${INK},0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const x = pw * 0.08 + (i / 40) * pw * 0.84;
        const y =
          ph / 2 +
          Math.sin(i * 0.55 + (p + ph0) * TAU * 2) * ph * 0.2 * Math.sin((i / 40) * Math.PI);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      const pulse = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin((p + ph0) * TAU * 3));
      ctx.fillStyle = `rgba(${WINE},${pulse})`;
      ctx.beginPath();
      ctx.arc(pw - 9, 9, 3, 0, TAU);
      ctx.fill();
    };

    const paintPanel = (kind: number, pw: number, ph: number, p: number, ph0: number) => {
      if (kind === 0) paintDesign(pw, ph, p, ph0);
      else if (kind === 1) paintWebUI(pw, ph, p, ph0);
      else if (kind === 2) paintTimeline(pw, ph, p, ph0);
      else if (kind === 3) paintMotion(pw, ph, p, ph0);
      else paintLive(pw, ph, p, ph0);
    };

    /* ------------------------- equipment (line art) ------------------------ */

    const drawCameraRig = (x: number, y: number, s: number, p: number, flip: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      if (flip) ctx.scale(-1, 1);
      ctx.scale(s, s);
      ctx.strokeStyle = `rgba(${INK},0.16)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, 46);
      ctx.moveTo(0, 0);
      ctx.lineTo(18, 46);
      ctx.moveTo(0, 0);
      ctx.lineTo(3, 48);
      ctx.stroke();
      ctx.save();
      ctx.rotate(Math.sin(p * TAU) * 0.07);
      ctx.beginPath();
      ctx.roundRect(-16, -26, 34, 20, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(18, -22);
      ctx.lineTo(30, -25);
      ctx.lineTo(30, -7);
      ctx.lineTo(18, -10);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = `rgba(${WINE},${0.25 + 0.2 * (0.5 + 0.5 * Math.sin(p * TAU * 3))})`;
      ctx.beginPath();
      ctx.arc(-11, -21, 2.2, 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.restore();
    };

    const drawSoftbox = (x: number, y: number, s: number, p: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.strokeStyle = `rgba(${INK},0.14)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 52);
      ctx.moveTo(-12, 52);
      ctx.lineTo(12, 52);
      ctx.stroke();
      ctx.save();
      ctx.rotate(Math.sin(p * TAU) * 0.05);
      ctx.beginPath();
      ctx.roundRect(-22, -30, 44, 30, 3);
      ctx.stroke();
      const glow = ctx.createRadialGradient(0, -15, 0, 0, -15, 90);
      glow.addColorStop(0, `rgba(${WINE_SOFT},${0.05 + 0.02 * Math.sin(p * TAU)})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-95, -110, 190, 190);
      ctx.restore();
      ctx.restore();
    };

    /* -------------------------------- frame -------------------------------- */

    const draw = (now: number) => {
      const p = (((now - start) / 1000) % LOOP) / LOOP;
      const tau = p * TAU;
      const camX = Math.sin(tau) * 10;
      const camY = Math.cos(tau) * 6;

      ctx.clearRect(0, 0, w, h);

      // soft light washes (kept extremely subtle on white)
      const lx = w * (0.66 + Math.sin(tau) * 0.06);
      const ly = h * (0.3 + Math.cos(tau * 2) * 0.05);
      const key = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.7);
      key.addColorStop(0, `rgba(${WINE_SOFT},0.07)`);
      key.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = key;
      ctx.fillRect(0, 0, w, h);

      const gx = w * (0.2 - Math.sin(tau) * 0.05);
      const gy = h * (0.75 + Math.sin(tau * 2) * 0.04);
      const gray = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.55);
      gray.addColorStop(0, `rgba(${INK},0.05)`);
      gray.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gray;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(camX, camY);

      // thin flowing lines
      ctx.save();
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const off = i / 5;
        ctx.strokeStyle =
          i % 2 === 0 ? `rgba(${INK},0.07)` : `rgba(${WINE_SOFT},0.09)`;
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 14) {
          const k = x / w;
          const y =
            h * (0.2 + off * 0.16) +
            Math.sin(k * 3 + tau + off * TAU) * h * 0.05 +
            Math.sin(k * 6 - tau * 2 + off * 4) * h * 0.018 +
            k * h * 0.25;
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // abstract studio panels
      panels.forEach((pl) => {
        const breathe = Math.sin((p + pl.phase) * TAU);
        const px = pl.x * w + breathe * 10 * pl.z;
        const py = pl.y * h - Math.cos((p + pl.phase) * TAU) * 8 * pl.z;
        const pw = pl.w * w;
        const ph = pl.h * h;

        ctx.save();
        ctx.globalAlpha = (0.45 + pl.z * 0.35) * (0.85 + 0.15 * breathe);
        ctx.translate(px, py);

        // soft gray shadow
        ctx.save();
        ctx.shadowColor = `rgba(${INK},0.10)`;
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.roundRect(0, 0, pw, ph, 8);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = `rgba(${INK},0.12)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(0, 0, pw, ph, 8);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, pw, ph, 8);
        ctx.clip();
        paintPanel(pl.kind, pw, ph, p, pl.phase);
        ctx.restore();
        ctx.restore();
      });

      // equipment line art (very light)
      const eq = Math.min(w, h) / 760;
      drawCameraRig(w * 0.18, h * 0.9, eq * 1.15, p, false);
      drawCameraRig(w * 0.95, h * 0.55, eq * 0.9, (p + 0.5) % 1, true);
      drawSoftbox(w * 0.44, h * 0.28, eq, p);

      // minimal particles
      particles.forEach((pt) => {
        const y = (pt.y + p * pt.s) % 1;
        const x = (pt.x + Math.sin((p + pt.x) * TAU) * 0.01 + 1) % 1;
        const tw = 0.5 + 0.5 * Math.sin((p + pt.tw) * TAU * 2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${WINE_SOFT},${(0.04 + pt.z * 0.1) * tw})`;
        ctx.arc(x * w, (1 - y) * h, pt.r * pt.z, 0, TAU);
        ctx.fill();
      });

      // gentle light reflection sweep
      const k = p % 1;
      const sx = -0.25 * w + k * w * 1.5;
      const sg = ctx.createLinearGradient(sx - w * 0.22, 0, sx + w * 0.22, 0);
      const a = 0.05 * seamFade(k, 0.25);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, `rgba(${WINE_SOFT},${a})`);
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // subtle DOJ MEDIA wordmark, bottom-right, breathing
      ctx.save();
      ctx.globalAlpha = 0.05 + 0.02 * (0.5 + 0.5 * Math.sin(tau));
      ctx.fillStyle = `rgb(${WINE})`;
      ctx.font = `700 ${Math.max(26, Math.min(w, h) * 0.07)}px "Playfair Display", serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("DOJ MEDIA", w - Math.min(w, h) * 0.05, h - Math.min(w, h) * 0.05);
      ctx.restore();

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
      {/* white base + soft wine/gray washes (also the mobile / reduced-motion look) */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute -right-1/4 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(160,30,60,0.10),transparent_65%)] blur-3xl animate-float-slow" />
        <div
          className="absolute -left-1/4 bottom-0 h-[60%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(40,32,36,0.06),transparent_65%)] blur-3xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />
      </div>
      {!lite && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full animate-fade-in" />}
      {/* readability scrim: keeps the left-hand copy crisp on white */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.72)_42%,rgba(255,255,255,0.35)_100%)]" />
    </div>
  );
}
