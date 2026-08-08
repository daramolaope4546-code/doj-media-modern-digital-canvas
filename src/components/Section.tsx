import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow, title, subtitle,
}: { eyebrow: string; title: ReactNode; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-20">
      <div className="pointer-events-none absolute -left-40 -top-20 h-96 w-96 rounded-full bg-wine/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[26rem] w-[26rem] rounded-full bg-wine-glow/10 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-wine">{eyebrow}</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          {subtitle && <p className="mt-5 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}

export function Section({
  eyebrow, title, subtitle, children, className = "",
}: { eyebrow?: string; title?: ReactNode; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`relative py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {(eyebrow || title) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-wine">{eyebrow}</span>
            )}
            {title && (
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-5 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
