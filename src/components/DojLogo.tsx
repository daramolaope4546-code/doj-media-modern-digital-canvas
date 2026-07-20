interface Props {
  size?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export function DojLogo({ size = 44, className = "", showText = false, textColor = "currentColor" }: Props) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative overflow-hidden rounded-xl" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" width={size} height={size} className="relative z-10">
          <defs>
            <linearGradient id="dojGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--wine-glow)" />
              <stop offset="100%" stopColor="var(--wine-deep)" />
            </linearGradient>
          </defs>
          {/* Broadcast waves */}
          <path
            d="M 52 20 Q 60 32 52 44"
            stroke="url(#dojGrad)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M 56 14 Q 68 32 56 50"
            stroke="url(#dojGrad)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* D shape */}
          <path
            d="M 12 10 L 12 54 L 30 54 Q 50 54 50 32 Q 50 10 30 10 Z"
            fill="url(#dojGrad)"
          />
          {/* Inner cutout to form D */}
          <path
            d="M 20 18 L 20 46 L 28 46 Q 42 46 42 32 Q 42 18 28 18 Z"
            fill="white"
          />
          {/* Play triangle */}
          <path d="M 27 25 L 27 39 L 38 32 Z" fill="url(#dojGrad)" className="animate-glow-pulse" />
        </svg>
        {/* Sweep */}
        <div className="pointer-events-none absolute inset-0 animate-wave-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display text-lg font-bold tracking-tight"
            style={{ color: textColor }}
          >
            DOJ <span style={{ color: "var(--wine)" }}>MEDIA</span>
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Create · Connect · Impact
          </span>
        </div>
      )}
    </div>
  );
}
