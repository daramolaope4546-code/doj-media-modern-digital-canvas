import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/Section";
import { experience } from "@/data/site";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience | DOJ MEDIA" },
      { name: "description", content: "Work experience, freelance projects, internships, volunteer work, education, training and certifications." },
      { property: "og:title", content: "Experience | DOJ MEDIA" },
      { property: "og:description", content: "A timeline of professional, freelance, volunteer and educational experience." },
      { property: "og:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
    ],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title={<>A record of <span className="italic text-wine">practice</span>.</>}
        subtitle="Work, freelance, volunteer and learning experiences that shaped how I create."
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-14">
          {experience.map((group) => (
            <div key={group.group}>
              <h2 className="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-wine/10 text-wine"><Briefcase size={16} /></span>
                {group.group}
              </h2>
              <div className="relative border-l border-border pl-6 sm:pl-8">
                {group.items.map((item, i) => (
                  <Reveal key={item.role + i} delay={i * 0.06}>
                    <div className="relative mb-5">
                      <span className="absolute -left-[1.9rem] top-7 h-3 w-3 rounded-full border-2 border-background bg-wine sm:-left-[2.4rem]" />
                      <div className="rounded-2xl border border-border bg-card p-6 transition hover:border-wine/40 hover:shadow-lg hover:shadow-wine/5">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <h3 className="min-w-0 font-display text-lg font-semibold text-foreground">{item.role}</h3>
                          <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.period}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-wine">{item.org}</p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
