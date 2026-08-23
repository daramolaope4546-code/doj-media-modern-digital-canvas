import { useEffect, useRef, useState } from "react";
import studioImage from "@/assets/hero-studio.jpg";

/**
 * DOJ MEDIA cinematic studio background.
 *
 * A full-viewport backdrop with:
 *  - Video background (autoplay, muted, loop) with graceful fallback to a still
 *  - Slow Ken Burns drift on the still (and as poster behind video)
 *  - Light cinematic scrims for copy readability (studio remains visible)
 *  - Soft wine light wash
 *  - Slow light sweep
 *  - Film grain overlay
 *  - Soft vignette
 *
 * To use a video, place it at public/assets/studio-cinematic.mp4 (or update the src).
 * When no video is available, the component falls back to the still image seamlessly.
 *
 * Respects prefers-reduced-motion (drift / grain / sweep disabled).
 */

const VIDEO_SRC = "/assets/studio-cinematic.mp4";

export function HeroCinematic({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onError = () => setVideoFailed(true);
    el.addEventListener("error", onError);

    el.play().catch(() => {
      /* silently ignore — poster/still remains visible */
    });

    return () => el.removeEventListener("error", onError);
  }, []);

  const showVideo = !videoFailed;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* ── Video layer ─────────────────────────────────────── */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster=""
          className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:animate-none"
          style={{ filter: "brightness(0.85) contrast(1.05)" }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* ── Studio still — slow cinematic drift ──────────────── */}
      <img
        src={studioImage}
        alt=""
        fetchPriority="high"
        className={`absolute inset-0 h-full w-full object-cover object-[center_30%] motion-reduce:animate-none animate-kenburns ${
          showVideo ? "opacity-0" : "opacity-100"
        } transition-opacity duration-1000`}
      />

      {/* ── Light cinematic scrims — studio stays visible ──── */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,9,0.55)_0%,rgba(9,7,9,0.15)_30%,rgba(9,7,9,0.25)_65%,rgba(9,7,9,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,7,9,0.7)_0%,rgba(9,7,9,0.15)_50%,rgba(9,7,9,0.05)_100%)]" />

      {/* ── Soft wine light wash ────────────────────────────── */}
      <div className="absolute -right-1/4 -top-1/3 h-[85%] w-[75%] rounded-full bg-[radial-gradient(circle,rgba(160,30,60,0.15),transparent_60%)] blur-3xl motion-reduce:animate-none animate-float-slow" />

      {/* ── Light reflection sweep ──────────────────────────── */}
      <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent motion-reduce:animate-none animate-sweep" />

      {/* ── Vignette ───────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />

      {/* ── Film grain ─────────────────────────────────────── */}
      <div className="absolute inset-0 motion-reduce:animate-none animate-grain-shift bg-grain opacity-[0.03]" />
    </div>
  );
}
