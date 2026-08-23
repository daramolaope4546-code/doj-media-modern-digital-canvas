import { useEffect, useRef, useState } from "react";
import studioImage from "@/assets/hero-studio.jpg";

/**
 * DOJ MEDIA cinematic studio background.
 *
 * A full-viewport backdrop with:
 *  - Video background (autoplay, muted, loop) with graceful fallback to a still
 *  - Slow Ken Burns drift on the still (and as poster behind video)
 *  - Dark cinematic scrims for copy readability
 *  - Soft wine light wash
 *  - Slow light sweep
 *  - Film grain overlay
 *  - Soft vignette
 *
 * To use a video, place it at /assets/studio-cinematic.mp4 (or update the src).
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

    // Attempt to play (muted autoplay may require user gesture on some browsers)
    el.play().catch(() => {
      /* silently ignore — poster/still remains visible */
    });

    return () => el.removeEventListener("error", onError);
  }, []);

  const showVideo = !videoFailed;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_70%,rgba(0,0,0,0.92)_80%,rgba(0,0,0,0.5)_91%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_70%,rgba(0,0,0,0.92)_80%,rgba(0,0,0,0.5)_91%,transparent_100%)] ${className}`}
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

      {/* ── Studio still — slow cinematic drift (always visible as fallback / poster) */}
      <img
        src={studioImage}
        alt=""
        fetchPriority="high"
        className={`absolute inset-0 h-full w-full object-cover object-[center_30%] motion-reduce:animate-none animate-kenburns ${showVideo ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}
      />

      {/* ── Dark cinematic scrims ───────────────────────────── */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,9,0.82)_0%,rgba(9,7,9,0.35)_35%,rgba(9,7,9,0.55)_68%,rgba(9,7,9,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,7,9,0.85)_0%,rgba(9,7,9,0.30)_45%,rgba(9,7,9,0.15)_100%)]" />

      {/* ── Soft wine light wash ────────────────────────────── */}
      <div className="absolute -right-1/4 -top-1/3 h-[85%] w-[75%] rounded-full bg-[radial-gradient(circle,rgba(160,30,60,0.18),transparent_60%)] blur-3xl motion-reduce:animate-none animate-float-slow" />

      {/* ── Light reflection sweep ──────────────────────────── */}
      <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent motion-reduce:animate-none animate-sweep" />

      {/* ── Vignette ───────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

      {/* ── Film grain ─────────────────────────────────────── */}
      <div className="absolute inset-0 motion-reduce:animate-none animate-grain-shift bg-grain opacity-[0.04]" />
    </div>
  );
}
