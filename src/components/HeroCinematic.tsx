import studioImage from "@/assets/hero-studio.jpg";

/**
 * DOJ MEDIA cinematic studio background.
 *
 * A slow, elegant full-viewport backdrop built entirely from the in-project
 * DOJ MEDIA studio still: a gentle Ken Burns drift, dark gradient scrims that
 * keep the hero copy readable, a soft wine light wash, a slow light sweep,
 * film grain and a soft vignette. Everything is layered with CSS over a local
 * asset, so there are no external URLs to break in production.
 *
 * Respects prefers-reduced-motion (the drift / grain / sweep are disabled).
 */

export function HeroCinematic({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_70%,rgba(0,0,0,0.92)_80%,rgba(0,0,0,0.5)_91%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_70%,rgba(0,0,0,0.92)_80%,rgba(0,0,0,0.5)_91%,transparent_100%)] ${className}`}
    >
      {/* Studio still — slow cinematic drift */}
      <img
        src={studioImage}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%] motion-reduce:animate-none animate-kenburns"
      />

      {/* Dark cinematic scrims keep the copy readable */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,9,0.78)_0%,rgba(9,7,9,0.4)_38%,rgba(9,7,9,0.58)_70%,rgba(9,7,9,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,7,9,0.8)_0%,rgba(9,7,9,0.34)_46%,rgba(9,7,9,0.2)_100%)]" />

      {/* Soft wine light wash (subtle) */}
      <div className="absolute -right-1/4 -top-1/3 h-[85%] w-[75%] rounded-full bg-[radial-gradient(circle,rgba(160,30,60,0.16),transparent_60%)] blur-3xl motion-reduce:animate-none animate-float-slow" />

      {/* Light reflection sweep */}
      <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent motion-reduce:animate-none animate-sweep" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_44%,rgba(0,0,0,0.55)_100%)]" />

      {/* Film grain */}
      <div className="absolute inset-0 motion-reduce:animate-none animate-grain-shift bg-grain opacity-[0.05]" />
    </div>
  );
}
