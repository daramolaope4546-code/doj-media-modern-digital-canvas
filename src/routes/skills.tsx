import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero, Reveal, Section } from "@/components/Section";
import { skills } from "@/data/site";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills | DOJ MEDIA" },
      { name: "description", content: "Technical and creative skills: graphics design, web design, video editing, motion design, live streaming, content creation and digital media." },
      { property: "og:title", content: "Skills | DOJ MEDIA" },
      { property: "og:description", content: "Creative and technical skill set across design, video, motion and live production." },
      { property: "og:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <>
      <PageHero
        eyebrow="Skills"
        title={<>Creative and technical <span className="italic text-wine">toolkit</span>.</>}
        subtitle="An honest view of where my strengths sit across design, production and broadcast."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {skills.map((s, i) => (
            <Reveal key={s.name} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 transition hover:border-wine/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold text-foreground">{s.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-wine/10 px-3 py-1 text-xs font-semibold text-wine">{s.level}%</span>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-wine to-wine-glow"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
