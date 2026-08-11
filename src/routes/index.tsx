import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Monitor, Video, Sparkles, Radio, Camera, Share2, Linkedin, Github, Instagram, Facebook, Mail } from "lucide-react";
import { LogoIntro } from "@/components/LogoIntro";
import { Reveal, Section } from "@/components/Section";
import { profile, services, skills, contact } from "@/data/site";
import portrait from "@/assets/opeyemi-portrait.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DOJ MEDIA | Creative Digital Solutions" },
      { name: "description", content: "Professional graphic design, web design, video editing, motion design, live streaming and digital creative solutions by DOJ MEDIA." },
      { property: "og:title", content: "DOJ MEDIA | Creative Digital Solutions" },
      { property: "og:description", content: "Professional graphic design, web design, video editing, motion design, live streaming and digital creative solutions by DOJ MEDIA." },

      { property: "og:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
    ],
  }),
  component: HomePage,
});

const icons = { palette: Palette, monitor: Monitor, video: Video, sparkles: Sparkles, radio: Radio, camera: Camera, share: Share2 };

const socials = [
  { label: "LinkedIn", href: contact.linkedin, Icon: Linkedin },
  { label: "GitHub", href: contact.github, Icon: Github },
  { label: "Instagram", href: contact.instagram, Icon: Instagram },
  { label: "Facebook", href: contact.facebook, Icon: Facebook },
  { label: "Email", href: `mailto:${contact.email}`, Icon: Mail },
].filter((s) => s.href && !s.href.includes("["));

function HomePage() {

  return (
    <>
      <LogoIntro />

      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="pointer-events-none absolute -left-40 top-32 h-96 w-96 rounded-full bg-wine/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-wine-glow/15 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:gap-14 md:grid-cols-2 lg:px-10">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-wine/30 bg-wine/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-wine"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-wine" />
              </span>
              {profile.tagline}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 0.8 }}
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 0.7 }}
              className="mt-4 font-display text-xl italic text-wine sm:text-2xl"
            >
              {profile.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.05, duration: 0.7 }}
              className="mt-6 max-w-xl font-display text-2xl font-semibold leading-snug text-foreground sm:text-3xl"
            >
              I turn ideas into <span className="italic text-wine">design, film and live experiences</span> people remember.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.1, duration: 0.7 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {profile.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.25, duration: 0.7 }}
              className="mt-7 flex flex-wrap gap-2"
            >
              {skills.slice(0, 6).map((s) => (
                <span key={s.name} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/80">
                  {s.name}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4, duration: 0.7 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-wine/25 transition hover:shadow-2xl hover:shadow-wine/50"
              >
                View My Work
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-wine hover:text-wine"
              >
                Contact Me
              </Link>
            </motion.div>

            {socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5, duration: 0.7 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground/70 transition hover:-translate-y-0.5 hover:border-wine hover:bg-wine hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.9, duration: 0.9 }}
            className="relative order-1 mx-auto md:order-2 w-full max-w-sm md:max-w-none"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-wine/25 to-wine-glow/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-4 -top-4 hidden h-28 w-28 rounded-full border-2 border-wine/30 sm:block" />
            <div className="pointer-events-none absolute -bottom-5 -left-5 hidden h-32 w-32 rounded-[2rem] bg-wine/10 sm:block" />
            <div className="relative rounded-[2.25rem] border border-wine/20 bg-card p-2 shadow-2xl shadow-wine/20 ring-1 ring-wine/10">
              <img
                src={portrait}
                alt="Opeyemi John Daramola, DOJ MEDIA creative digital media and production specialist"
                width={884}
                height={1200}
                className="aspect-[4/5] w-full rounded-[1.85rem] object-cover object-top"
              />
            </div>
          </motion.div>
        </div>

      </section>

      <Section
        eyebrow="What I Do"
        title={<>Creative services, <span className="italic text-wine">end to end</span>.</>}
        subtitle="From first concept to final broadcast — a complete creative toolkit under one brand."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.07}>
                <Link
                  to="/services"
                  className="group block h-full rounded-3xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:border-wine/50 hover:shadow-xl hover:shadow-wine/5"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine transition group-hover:scale-110 group-hover:bg-wine group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-wine hover:underline">
            See all services <ArrowRight size={14} />
          </Link>
        </div>
      </Section>

      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-wine via-wine-deep to-wine p-12 text-center text-white shadow-2xl shadow-wine/30 sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <h2 className="relative font-display text-3xl font-bold leading-tight sm:text-5xl">
              Let's create something<br /><span className="italic">worth watching.</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-white/80">
              Tell me about your project — design, video, motion, or a live production.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-wine shadow-xl transition hover:-translate-y-0.5">
                Contact Me
              </Link>
              <Link to="/portfolio" className="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                View My Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
