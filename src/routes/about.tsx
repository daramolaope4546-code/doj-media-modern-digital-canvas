import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, MapPin, Target, Compass, Sparkles, ArrowRight } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/Section";
import { profile } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Me — DOJ MEDIA" },
      { name: "description", content: "Get to know the creative behind DOJ MEDIA: biography, education, location, career interests, goals, strengths and skills." },
      { property: "og:title", content: "About Me — DOJ MEDIA" },
      { property: "og:description", content: "Biography, education, interests, goals and strengths of the creative behind DOJ MEDIA." },
      { property: "og:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Me"
        title={<>The person behind <span className="italic text-wine">DOJ MEDIA</span>.</>}
        subtitle="A creative digital media professional focused on design, production and live broadcast."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl border border-border bg-card p-8 sm:p-10">
              <h2 className="font-display text-3xl font-bold text-foreground">{profile.name}</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-wine">{profile.title}</p>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {profile.bio.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={0.05}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine/10 text-wine"><GraduationCap size={18} /></div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Education</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{profile.education}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine/10 text-wine"><MapPin size={18} /></div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Location</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{profile.location}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Sparkles size={14} className="text-wine" /> Relevant Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Graphics Design", "Web Design", "Video Editing", "Motion Design", "Live Streaming", "Content Creation"].map((s) => (
                    <span key={s} className="rounded-full bg-wine/10 px-3 py-1 text-xs font-medium text-wine">{s}</span>
                  ))}
                </div>
                <Link to="/skills" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-wine hover:underline">
                  See all skills <ArrowRight size={12} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <ListCard icon={<Compass size={18} />} title="Career Interests" items={profile.interests} />
          </Reveal>
          <Reveal delay={0.07}>
            <ListCard icon={<Target size={18} />} title="Professional Goals" items={profile.goals} />
          </Reveal>
          <Reveal delay={0.14}>
            <ListCard icon={<Sparkles size={18} />} title="Personal Strengths" items={profile.strengths} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function ListCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="h-full rounded-3xl border border-border bg-card p-8">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-wine/10 text-wine">{icon}</div>
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wine" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
