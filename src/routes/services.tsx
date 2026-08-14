import { createFileRoute, Link } from "@tanstack/react-router";
import { Palette, Monitor, Video, Sparkles, Radio, Camera, Share2, ArrowRight, Check } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/Section";
import { services } from "@/data/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | DOJ MEDIA" },
      { name: "description", content: "Graphics design, web design, video editing, motion design, live streaming, live streaming setup and digital media services." },
      { property: "og:title", content: "Services | DOJ MEDIA" },
      { property: "og:description", content: "Creative services: design, web, video, motion, live streaming and digital media." },
      { property: "og:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
    ],
  }),
  component: ServicesPage,
});

const icons = { palette: Palette, monitor: Monitor, video: Video, sparkles: Sparkles, radio: Radio, camera: Camera, share: Share2 };

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>What I can <span className="italic text-wine">create</span> for you.</>}
        subtitle="Seven focused services covering design, digital, and live production."
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.07}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:border-wine/50 hover:shadow-xl hover:shadow-wine/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-wine/0 via-wine/0 to-wine/10 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex flex-1 flex-col">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine transition group-hover:scale-110 group-hover:bg-wine group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-foreground">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                    <ul className="mt-5 flex-1 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check size={13} className="shrink-0 text-wine" />{p}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/contact"
                      className="mt-7 inline-flex items-center gap-2 self-start rounded-full border border-wine/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-wine transition hover:bg-wine hover:text-white"
                    >
                      Request Service <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}
