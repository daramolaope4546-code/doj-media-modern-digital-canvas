import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Palette, Monitor, Video, Sparkles, Radio, Camera, Share2, Linkedin, Github, Instagram, Facebook, Mail } from "lucide-react";
import { LogoIntro } from "@/components/LogoIntro";
import { HeroCinematic } from "@/components/HeroCinematic";
import { DojLogo } from "@/components/DojLogo";
import { Reveal, Section } from "@/components/Section";
import { profile, services, skills, contact } from "@/data/site";
import portrait from "@/assets/opeyemi-portrait.png";


// Live Update Test
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DOJ MEDIA | Creative Digital Solutions" },
      { name: "description", content: "Professional graphic design, web design, video editing, motion design, live streaming and digital creative solutions by DOJ MEDIA." },
      { property: "og:title", content: "DOJ MEDIA | Creative Digital Solutions" },
      { property: "og:description", content: "Professional graphic design, web design, video editing, motion design, live streaming and digital creative solutions by DOJ MEDIA." },

      { property: "og:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.vercel.app/og-image.jpg" },
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

function introAlreadyPlayed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem("doj_intro_played") === "1";
  } catch {
    return false;
  }
}

function HomePage() {
  const reduce = useReducedMotion();
  // On the very first visit the brand intro overlay plays first, so the hero
  // reveal starts as it lifts. On later visits to "/" we reveal right away.
  const firstLoad = !introAlreadyPlayed();

  return (
    <>
      <LogoIntro />

      <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-24 sm:pt-32 sm:pb-28 md:justify-center">
        <HeroCinematic />

        {/* Soft white atmospheric fade that consumes the dark edge into the page.
            Uses --background so it stays white in light mode and seamless in dark mode. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[32%] bg-gradient-to-t from-background via-background/30 to-transparent"
        />

        {/* DOJ MEDIA branding + large profile image — one image element, always
            visible at every breakpoint, never hidden by a media query or opacity. */}
        <div className="relative z-[4] mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center lg:px-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: firstLoad ? 1.35 : 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur"
          >
            <DojLogo size={22} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
              {profile.brand}
              <span className="mx-2 text-white/40">—</span>
              Creative Digital Media Studio
            </span>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: firstLoad ? 1.6 : 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="relative w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[24rem]">
              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(160,30,60,0.16),transparent_65%)] blur-2xl" />
              <div className="relative rounded-[2.25rem] border border-white/15 bg-white/5 p-2 shadow-2xl shadow-black/60 ring-1 ring-white/10 backdrop-blur">
                <img
                  src={portrait}
                  alt="Opeyemi John Daramola, DOJ MEDIA creative digital media and production specialist"
                  width={884}
                  height={1200}
                  loading="eager"
                  className="aspect-[4/5] w-full rounded-[1.85rem] object-cover object-top"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-5 -right-5 hidden h-24 w-24 rounded-full border border-white/15 sm:block" />
            </div>
            <p className="mt-6 font-display text-xl font-semibold leading-snug text-white sm:text-2xl">{profile.name}</p>
          </motion.div>
        </div>

        {/* Dedicated scrolling typography line — its own row between the profile
            and the headline, so it never overlaps the photo, name, heading or CTAs.
            The words stay separated by generous responsive gaps and remain solid
            (no opacity). Clipped inside this container so no horizontal scroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-[4] mt-14 w-full select-none overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div className="animate-marquee motion-reduce:animate-none flex w-max items-center whitespace-nowrap font-display font-bold uppercase leading-none text-white">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex items-center gap-[1.25em] pr-[1.25em] text-[clamp(3.5rem,14vw,16rem)] tracking-[0.02em] sm:gap-[1.75em] sm:pr-[1.75em] md:gap-[2.5em] md:pr-[2.5em]">
                <span>CREATE</span>
                <span>DESIGN</span>
                <span>STREAM</span>
                <span>INSPIRE</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hero headline + messaging */}
        <div className="relative z-[4] mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center lg:px-10">
          <div>
            <h1 className="mt-12 font-display text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[1.05] tracking-tight text-white [text-wrap:balance]">
              {"CREATE. DESIGN. STREAM. INSPIRE.".split(" ").map((word, i) => (
                <motion.span
                  key={word}
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: firstLoad ? 1.7 + i * 0.12 : 0.2 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={i === 3 ? "italic text-[#f2c6cd]" : "mr-[0.28em] inline-block"}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: firstLoad ? 1.8 : 0.4, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl"
            >
              Creative media solutions crafted through design, technology, motion and storytelling.
            </motion.p>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: firstLoad ? 1.95 : 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-white/55 sm:text-sm"
            >
              Graphics • Web • Video • Motion • Live Streaming
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: firstLoad ? 2.1 : 0.6, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2.5 rounded-full bg-wine px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-2xl shadow-black/40 transition duration-300 hover:-translate-y-0.5 hover:bg-[#961e3c] hover:shadow-[0_14px_44px_-12px_rgba(160,30,60,0.75)]"
              >
                Explore My Work
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 hover:text-white"
              >
                Let's Work Together
              </Link>
            </motion.div>

            {socials.length > 0 && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: firstLoad ? 2.25 : 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-wrap items-center justify-center gap-3"
              >
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: firstLoad ? 2.4 : 0.85, duration: 0.7 }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-foreground/60">
            Scroll to explore
          </span>
          <span className="relative block h-12 w-px overflow-hidden bg-foreground/20">
            <span className="absolute inset-0 block bg-foreground/80 motion-reduce:animate-none animate-scroll-line" />
          </span>
        </motion.div>
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
