import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { projectCategories, projects } from "@/data/site";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — DOJ MEDIA" },
      { name: "description", content: "Selected creative projects across graphics design, web design, video editing, motion design and live streaming." },
      { property: "og:title", content: "Portfolio — DOJ MEDIA" },
      { property: "og:description", content: "A gallery of design, video, motion and live production projects." },
      { property: "og:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
    ],
  }),
  component: PortfolioPage,
});

type Project = (typeof projects)[number];

function PortfolioPage() {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<Project | null>(null);
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={<>Selected <span className="italic text-wine">work</span>.</>}
        subtitle="A growing gallery of projects across design, digital and live production."
      />

      <Section>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {projectCategories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                filter === c
                  ? "bg-wine text-white shadow-lg shadow-wine/25"
                  : "border border-border text-foreground/70 hover:border-wine hover:text-wine"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {p.image ? (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl opacity-40"
                        style={{ backgroundImage: `url(${p.image})` }}
                      />
                      <img src={p.image} alt={p.title} loading="lazy" className="relative h-full w-full object-contain transition duration-700 group-hover:scale-105" />
                    </>
                  ) : (
                    <div
                      className="h-full w-full transition duration-700 group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, hsl(${p.hue} 45% 25%), hsl(${p.hue} 60% 45%))` }}
                    />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="font-display text-lg font-semibold text-foreground">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  <button
                    onClick={() => setActive(p)}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-wine transition hover:gap-3"
                  >
                    View Project <ArrowRight size={12} />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-card"
            >
              {active.image ? (
                <img src={active.image} alt={active.title} className="max-h-[60vh] w-full bg-muted object-contain" />

              ) : (
                <div className="aspect-video" style={{ background: `linear-gradient(135deg, hsl(${active.hue} 45% 25%), hsl(${active.hue} 60% 45%))` }} />
              )}
              <div className="p-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-wine">{active.category}</span>
                <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{active.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
                {active.link && (
                  <a href={active.link} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white">
                    Open Project <ArrowRight size={12} />
                  </a>
                )}
              </div>
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
