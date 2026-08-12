import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Monitor, Video, Sparkles, Radio, Camera, Share2, Linkedin, Github, Instagram, Facebook, Mail } from "lucide-react";
import { LogoIntro } from "@/components/LogoIntro";
import { HeroCinematic } from "@/components/HeroCinematic";
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

      <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20 sm:pt-36">
        <HeroCinematic />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 sm:gap-14 md:grid-cols-2 lg:px-10">
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/90 backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine-glow opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-wine-glow" />
              </span>
              {profile.tagline}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 0.8 }}
              className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
            >
              DOJ MEDIA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 0.7 }}
              className="mt-3 font-display text-xl italic text-white/85 sm:text-2xl"
            >
              Creative Digital Media Studio
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.05, duration: 0.7 }}
              className="mt-5 max-w-xl text-sm tracking-wide text-white/70 sm:text-base"
            >
              Graphic Design • Web Design • Video Editing • Motion Design • Live Streaming
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.15, duration: 0.7 }}
              className="mt-7 max-w-xl text-xs font-semibold uppercase tracking-[0.4em] text-wine-glow"
            >
              {"CREATE. DESIGN. STREAM. INSPIRE.".split(" ").map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.3 + i * 0.16, duration: 0.5 }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2, duration: 0.7 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70"
            >
              {profile.name} — {profile.title}. {profile.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4, duration: 0.7 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-wine/40 transition hover:shadow-2xl hover:shadow-wine/60"
              >
                View My Work
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Let's Work Together
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
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 backdrop-blur transition hover:-translate-y-0.5 hover:border-wine-glow hover:bg-wine hover:text-white"
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
            <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-wine/40 to-wine-glow/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-4 -top-4 hidden h-28 w-28 rounded-full border-2 border-white/25 sm:block" />
            <div className="pointer-events-none absolute -bottom-5 -left-5 hidden h-32 w-32 rounded-[2rem] bg-wine/25 sm:block" />
            <div className="relative rounded-[2.25rem] border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/50 ring-1 ring-wine/30 backdrop-blur">
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
        subtitle="From first concept to final broadcast: a complete creative toolkit under one brand."
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
              Tell me about your project: design, video, motion, or a live production.
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
