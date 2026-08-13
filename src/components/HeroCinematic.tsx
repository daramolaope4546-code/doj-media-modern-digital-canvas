import { useEffect, useRef, useState } from "react";

/**
 * Code-generated cinematic "studio showreel" background.
 * A seamless loop drawn on canvas: a dark virtual studio containing abstract
 * monitor walls, layered design compositions, editing timelines, motion-graphic
 * rigs, camera / streaming equipment silhouettes, mood boards, light streaks and
 * drifting particles.
 *
 * Everything is a pure function of the normalised loop position `p` (0..1), using
 * sin/cos of `p * 2PI` or wrapped values that fade in/out at the seam, so the last
 * frame matches the first exactly. Motion is intentionally slow so hero text stays
 * readable.
 *
 * Falls back to a lightweight animated gradient on mobile / reduced motion.
 */

const LOOP = 28; // seconds — slow, cinematic

type P = { x: number; y: number; z: number; r: number; s: number; tw: number };

const WINE = "200,40,80";
const WINE_DEEP = "128,0,32";

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
    // triangle-ish fade so wrapped elements never pop at the seam
    const seamFade = (k: number, edge = 0.16) =>
      Math.min(1, k / edge) * Math.min(1, (1 - k) / edge);

    const particles: P[] = Array.from({ length: 110 }, () => ({
      x: r(),
      y: r(),
      z: 0.2 + r() * 0.8,
      r: 0.5 + r() * 1.6,
      s: 1 + Math.floor(r() * 2), // integer laps per loop => seamless
      tw: r(),
    }));

    // Monitor wall: an abstract bank of screens in the mid-ground
    const monitors = Array.from({ length: 9 }, (_, i) => ({
      x: 0.07 + (i % 5) * 0.2 + (r() - 0.5) * 0.03,
      y: (i < 5 ? 0.26 : 0.46) + (r() - 0.5) * 0.04,
      w: 0.11 + r() * 0.05,
      h: 0.075 + r() * 0.035,
      z: 0.35 + r() * 0.6,
      kind: i % 5, // 0 design, 1 web ui, 2 timeline, 3 motion, 4 waveform/live
      phase: r(),
    }));

    // Floating foreground cards (design boards / swatches)
    const boards = Array.from({ length: 5 }, (_, i) => ({
      x: 0.1 + r() * 0.8,
      y: 0.15 + r() * 0.65,
      s: 0.055 + r() * 0.05,
      z: 0.5 + r() * 0.5,
      phase: (i / 5 + r() * 0.1) % 1,
    }));

    let raf = 0;
    const start = performance.now();

    /* ------------------------ screen content painters ----------------------- */

    const paintDesign = (pw: number, ph: number, p: number, ph0: number) => {
      // layered "composition": shapes + layer stack rails
      const a = 0.55 + 0.25 * Math.sin((p + ph0) * TAU);
      ctx.strokeStyle = `rgba(${WINE},${a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pw * 0.3, ph * 0.5, Math.min(pw, ph) * 0.2, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.15 * Math.cos((p + ph0) * TAU)})`;
      ctx.strokeRect(pw * 0.46, ph * 0.26, pw * 0.3, ph * 0.42);
      // layer rails
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.1 + 0.06 * i})`;
        ctx.fillRect(pw * 0.08, ph * (0.74 + i * 0.07), pw * 0.5, 1.5);
      }
      // marching selection dash
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -((p + ph0) % 1) * 8;
      ctx.strokeStyle = `rgba(255,255,255,0.35)`;
      ctx.strokeRect(pw * 0.44, ph * 0.24, pw * 0.34, ph * 0.46);
      ctx.restore();
    };

    const paintWebUI = (pw: number, ph: number, p: number, ph0: number) => {
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(pw * 0.08, ph * 0.14, pw * 0.84, ph * 0.1); // nav
      ctx.fillStyle = `rgba(${WINE},0.6)`;
      ctx.fillRect(pw * 0.74, ph * 0.16, pw * 0.16, ph * 0.06); // cta
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(pw * 0.08, ph * 0.32, pw * 0.44, ph * 0.34); // hero block
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(255,255,255,0.09)";
        ctx.fillRect(pw * (0.58 + i * 0.12), ph * 0.32, pw * 0.1, ph * 0.34);
      }
      // slow scroll indicator (wraps with fade at seam)
      const k = (p + ph0) % 1;
      ctx.globalAlpha *= seamFade(k, 0.2);
      ctx.fillStyle = `rgba(${WINE},0.8)`;
      ctx.fillRect(pw * 0.93, ph * (0.18 + k * 0.6), 2, ph * 0.14);
    };

    const paintTimeline = (pw: number, ph: number, p: number, ph0: number) => {
      for (let i = 0; i < 4; i++) {
        const y = ph * (0.22 + i * 0.18);
        ctx.fillStyle =
          i === 1 ? `rgba(${WINE},0.75)` : `rgba(255,255,255,${0.18 + i * 0.05})`;
        const len = 0.3 + 0.25 * (0.5 + 0.5 * Math.sin((p + ph0 + i * 0.13) * TAU));
        ctx.fillRect(pw * 0.08, y, pw * len, 3);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(pw * (0.08 + len), y, pw * (0.84 - len), 3);
      }
      // playhead sweeps once per loop, fading at seam
      const k = (p + ph0) % 1;
      ctx.save();
      ctx.globalAlpha *= seamFade(k, 0.12);
      ctx.strokeStyle = `rgba(255,235,240,0.85)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pw * (0.08 + k * 0.84), ph * 0.12);
      ctx.lineTo(pw * (0.08 + k * 0.84), ph * 0.9);
      ctx.stroke();
      ctx.restore();
    };

    const paintMotion = (pw: number, ph: number, p: number, ph0: number) => {
      // bezier easing curve + keyframe diamonds
      const t = (p + ph0) * TAU;
      ctx.strokeStyle = `rgba(${WINE},0.7)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pw * 0.1, ph * 0.78);
      ctx.bezierCurveTo(
        pw * (0.35 + 0.06 * Math.sin(t)),
        ph * (0.72 + 0.14 * Math.cos(t)),
        pw * (0.6 + 0.06 * Math.cos(t)),
        ph * (0.3 - 0.12 * Math.sin(t)),
        pw * 0.9,
        ph * 0.22,
      );
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      [0.1, 0.5, 0.9].forEach((kx, i) => {
        const ky = 0.78 - i * 0.28 + 0.03 * Math.sin(t + i);
        ctx.save();
        ctx.translate(pw * kx, ph * ky);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-2.5, -2.5, 5, 5);
        ctx.restore();
      });
      // orbiting element
      ctx.beginPath();
      ctx.fillStyle = `rgba(${WINE},0.9)`;
      ctx.arc(
        pw * (0.5 + 0.28 * Math.cos(t)),
        ph * (0.5 + 0.22 * Math.sin(t)),
        2.6,
        0,
        TAU,
      );
      ctx.fill();
    };

    const paintLive = (pw: number, ph: number, p: number, ph0: number) => {
      ctx.strokeStyle = `rgba(255,255,255,0.45)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const x = pw * 0.08 + (i / 40) * pw * 0.84;
        const y =
          ph / 2 +
          Math.sin(i * 0.55 + (p + ph0) * TAU * 2) *
            ph *
            0.22 *
            Math.sin((i / 40) * Math.PI);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // REC dot pulses (integer cycles => seamless)
      const pulse = 0.45 + 0.45 * (0.5 + 0.5 * Math.sin((p + ph0) * TAU * 3));
      ctx.fillStyle = `rgba(230,60,90,${pulse})`;
      ctx.beginPath();
      ctx.arc(pw - 9, 9, 3, 0, TAU);
      ctx.fill();
    };

    const paintScreen = (kind: number, pw: number, ph: number, p: number, ph0: number) => {
      if (kind === 0) paintDesign(pw, ph, p, ph0);
      else if (kind === 1) paintWebUI(pw, ph, p, ph0);
      else if (kind === 2) paintTimeline(pw, ph, p, ph0);
      else if (kind === 3) paintMotion(pw, ph, p, ph0);
      else paintLive(pw, ph, p, ph0);
    };

    /* ------------------------------ equipment ------------------------------- */

    const drawCameraRig = (x: number, y: number, s: number, p: number, flip: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      if (flip) ctx.scale(-1, 1);
      ctx.scale(s, s);
      // slow pan
      const pan = Math.sin(p * TAU) * 0.1;
      ctx.strokeStyle = "rgba(235,215,222,0.5)";
      ctx.lineWidth = 2;
      // tripod
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, 46);
      ctx.moveTo(0, 0);
      ctx.lineTo(18, 46);
      ctx.moveTo(0, 0);
      ctx.lineTo(3, 48);
      ctx.stroke();
      // head + body
      ctx.save();
      ctx.rotate(pan);
      ctx.beginPath();
      ctx.roundRect(-16, -26, 34, 20, 4);
      ctx.stroke();
      // lens
      ctx.beginPath();
      ctx.moveTo(18, -22);
      ctx.lineTo(30, -25);
      ctx.lineTo(30, -7);
      ctx.lineTo(18, -10);
      ctx.closePath();
      ctx.stroke();
      // tally light
      ctx.fillStyle = `rgba(${WINE},${0.5 + 0.4 * (0.5 + 0.5 * Math.sin(p * TAU * 3))})`;
      ctx.beginPath();
      ctx.arc(-11, -21, 2.4, 0, TAU);
      ctx.fill();
      // lens glow cone
      const cone = ctx.createLinearGradient(30, -16, 96, -16);
      cone.addColorStop(0, `rgba(255,235,240,0.10)`);
      cone.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.moveTo(30, -25);
      ctx.lineTo(100, -46);
      ctx.lineTo(100, 14);
      ctx.lineTo(30, -7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.restore();
    };

    const drawSoftbox = (x: number, y: number, s: number, p: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.strokeStyle = "rgba(235,215,222,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 52);
      ctx.moveTo(-12, 52);
      ctx.lineTo(12, 52);
      ctx.stroke();
      ctx.save();
      ctx.rotate(Math.sin(p * TAU) * 0.06);
      ctx.beginPath();
      ctx.roundRect(-22, -30, 44, 30, 3);
      ctx.stroke();
      const glow = ctx.createRadialGradient(0, -15, 0, 0, -15, 70);
      glow.addColorStop(0, `rgba(255,225,235,${0.16 + 0.05 * Math.sin(p * TAU)})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-70, -85, 140, 140);
      ctx.restore();
      ctx.restore();
    };

    const drawBoomMic = (x: number, y: number, s: number, p: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.rotate(-0.5 + Math.sin(p * TAU) * 0.04);
      ctx.strokeStyle = "rgba(235,215,222,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(70, 24);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-14, -5, 18, 10, 5);
      ctx.stroke();
      ctx.restore();
    };

    /* -------------------------------- frame --------------------------------- */

    const draw = (now: number) => {
      const p = (((now - start) / 1000) % LOOP) / LOOP;
      const tau = p * TAU;

      // seamless camera drift
      const camX = Math.sin(tau) * 16;
      const camY = Math.cos(tau) * 9;
      const zoom = 1 + Math.sin(tau) * 0.014;

      ctx.clearRect(0, 0, w, h);

      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0b0709");
      g.addColorStop(0.55, "#150a11");
      g.addColorStop(1, "#070405");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2 + camX, -h / 2 + camY);

      // wine key light
      const lx = w * (0.3 + Math.sin(tau) * 0.07);
      const ly = h * (0.34 + Math.cos(tau * 2) * 0.05);
      const key = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.7);
      key.addColorStop(0, `rgba(160,20,55,0.40)`);
      key.addColorStop(0.45, `rgba(${WINE_DEEP},0.13)`);
      key.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = key;
      ctx.fillRect(0, 0, w, h);

      const rx = w * (0.84 - Math.sin(tau) * 0.04);
      const ry = h * (0.68 + Math.sin(tau * 2) * 0.04);
      const rim = ctx.createRadialGradient(rx, ry, 0, rx, ry, Math.max(w, h) * 0.5);
      rim.addColorStop(0, "rgba(255,255,255,0.09)");
      rim.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, w, h);

      // ---- studio floor grid (perspective, wraps with fade) ----
      ctx.save();
      ctx.strokeStyle = "rgba(190,120,140,0.32)";
      ctx.lineWidth = 1;
      const horizon = h * 0.64;
      for (let i = 0; i <= 18; i++) {
        const k = i / 18;
        const x = (k - 0.5) * w * 2.4 + w / 2;
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.moveTo(w / 2 + (x - w / 2) * 0.1, horizon);
        ctx.lineTo(x, h * 1.15);
        ctx.stroke();
      }
      for (let i = 0; i < 14; i++) {
        const k = ((i / 14 + p) % 1) ** 2.6;
        const y = horizon + k * (h * 0.5);
        ctx.globalAlpha = 0.2 * (1 - k) * seamFade((i / 14 + p) % 1, 0.1);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // ---- monitor wall ----
      monitors.forEach((m) => {
        const breathe = Math.sin((p + m.phase) * TAU);
        const px = m.x * w + breathe * 8 * m.z;
        const py = m.y * h - Math.cos((p + m.phase) * TAU) * 6 * m.z;
        const pw = m.w * w;
        const ph = m.h * h;
        const alpha = (0.28 + m.z * 0.45) * (0.85 + 0.15 * breathe);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(px, py);

        // screen glow behind
        const sg = ctx.createRadialGradient(pw / 2, ph / 2, 0, pw / 2, ph / 2, pw * 0.9);
        sg.addColorStop(0, `rgba(${WINE},0.18)`);
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(-pw * 0.4, -ph * 0.5, pw * 1.8, ph * 2);

        // bezel
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.strokeStyle = "rgba(235,200,212,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(0, 0, pw, ph, 6);
        ctx.fill();
        ctx.stroke();

        // stand
        ctx.strokeStyle = "rgba(235,200,212,0.16)";
        ctx.beginPath();
        ctx.moveTo(pw / 2, ph);
        ctx.lineTo(pw / 2, ph + ph * 0.16);
        ctx.moveTo(pw * 0.38, ph + ph * 0.16);
        ctx.lineTo(pw * 0.62, ph + ph * 0.16);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, pw, ph, 6);
        ctx.clip();
        paintScreen(m.kind, pw, ph, p, m.phase);
        ctx.restore();

        ctx.restore();
      });

      // ---- floating design boards / swatch cards ----
      boards.forEach((b) => {
        const k = (p + b.phase) % 1;
        const fade = seamFade(k, 0.22) * (0.3 + b.z * 0.5);
        const bx = b.x * w + Math.sin((p + b.phase) * TAU) * 18 * b.z;
        const by = b.y * h - k * 26 * b.z;
        const s = b.s * Math.min(w, h) * 1.4;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(bx, by);
        ctx.rotate(Math.sin((p + b.phase) * TAU) * 0.05);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.strokeStyle = "rgba(240,205,215,0.28)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(0, 0, s, s * 0.7, 6);
        ctx.fill();
        ctx.stroke();
        // swatches
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle =
            i === 1
              ? `rgba(${WINE},0.75)`
              : i === 2
                ? `rgba(${WINE_DEEP},0.75)`
                : "rgba(255,255,255,0.22)";
          ctx.fillRect(s * (0.08 + i * 0.22), s * 0.5, s * 0.16, s * 0.12);
        }
        // type lines
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(s * 0.08, s * 0.16, s * 0.6, 3);
        ctx.fillRect(s * 0.08, s * 0.28, s * 0.4, 2);
        ctx.restore();
      });

      // ---- equipment silhouettes ----
      const eqScale = Math.min(w, h) / 700;
      ctx.save();
      ctx.globalAlpha = 0.85;
      drawCameraRig(w * 0.14, h * 0.74, eqScale * 1.25, p, false);
      drawCameraRig(w * 0.9, h * 0.8, eqScale * 1.0, (p + 0.5) % 1, true);
      drawSoftbox(w * 0.68, h * 0.7, eqScale * 1.1, p);
      drawBoomMic(w * 0.34, h * 0.2, eqScale * 1.2, p);
      ctx.restore();

      // ---- particles ----
      particles.forEach((pt) => {
        const y = (pt.y + p * pt.s) % 1;
        const x = (pt.x + Math.sin((p + pt.x) * TAU) * 0.012 + 1) % 1;
        const tw = 0.55 + 0.45 * Math.sin((p + pt.tw) * TAU * 2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,225,235,${(0.08 + pt.z * 0.32) * tw})`;
        ctx.arc(x * w, (1 - y) * h, pt.r * pt.z, 0, TAU);
        ctx.fill();
      });

      // ---- anamorphic light streaks (2 laps per loop => seamless) ----
      for (let s = 0; s < 2; s++) {
        const k = (p * (s + 1) + s * 0.4) % 1;
        const sx = -0.25 * w + k * w * 1.5;
        const sg = ctx.createLinearGradient(sx - w * 0.2, 0, sx + w * 0.2, 0);
        const a = (0.05 + 0.04 * Math.sin(k * Math.PI)) * seamFade(k, 0.18);
        sg.addColorStop(0, "rgba(255,255,255,0)");
        sg.addColorStop(0.5, `rgba(255,220,230,${a})`);
        sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();

      // ---- vignette ----
      const vg = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.25,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.78,
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.78)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      // ---- DOJ MEDIA watermark, breathing (seamless) ----
      ctx.save();
      ctx.globalAlpha = 0.05 + 0.03 * (0.5 + 0.5 * Math.sin(tau));
      ctx.fillStyle = "rgb(255,240,245)";
      ctx.font = `700 ${Math.max(28, Math.min(w, h) * 0.075)}px "Playfair Display", serif`;
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,4,5,0.9)_0%,rgba(6,4,5,0.68)_45%,rgba(6,4,5,0.4)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
