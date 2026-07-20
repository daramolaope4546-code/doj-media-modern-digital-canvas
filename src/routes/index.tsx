import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Palette, Monitor, Video, Sparkles, Radio, Camera, Layers, Share2,
  PenTool, Lightbulb, Wand2, Play, ArrowRight, ArrowUp, Menu, X,
  Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube, MessageCircle,
  Check, Star, Moon, Sun, Send,
} from "lucide-react";
import { DojLogo } from "@/components/DojLogo";
import { LogoIntro } from "@/components/LogoIntro";

export const Route = createFileRoute("/")({
  component: DojMediaSite,
});

// ---------- NAV ----------
const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "skills", label: "Skills" },
  { id: "process", label: "Process" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

function Nav({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#home" className="flex items-center">
          <DojLogo size={40} showText />
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="group relative text-sm font-medium text-foreground/80 transition hover:text-foreground"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-wine transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
            className="rounded-full border border-border p-2 text-foreground/70 transition hover:border-wine hover:text-wine"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href="#contact"
            className="hidden rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-wine/20 transition hover:shadow-xl hover:shadow-wine/40 sm:inline-block"
          >
            Let's Talk
          </a>
          <button
            className="rounded-full border border-border p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-wine"
                >
                  {n.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---------- HERO ----------
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      {/* Decorative waves */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-wine/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-wine-glow/15 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      <svg className="pointer-events-none absolute bottom-0 left-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0,100 C240,180 480,20 720,80 C960,140 1200,60 1440,120 L1440,200 L0,200 Z"
          fill="var(--wine)"
          opacity="0.06"
        />
      </svg>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-6xl px-6 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-wine/30 bg-wine/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-wine"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-wine" />
          </span>
          Premium Creative Studio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.9 }}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-8xl"
        >
          Creative Designs.<br />
          Powerful Visuals.<br />
          <span className="italic text-wine">Professional</span> Live Productions.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8 }}
          className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          We help businesses, creators, churches, brands, and organizations stand out with
          exceptional graphic design, responsive websites, engaging videos, motion graphics,
          and professional live streaming solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            className="group inline-flex items-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-wine/25 transition hover:shadow-2xl hover:shadow-wine/50"
          >
            View Portfolio
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:border-wine hover:text-wine"
          >
            Get in Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 1 }}
          className="mt-20 flex items-center justify-center gap-8 text-xs uppercase tracking-widest text-muted-foreground"
        >
          <span>Design</span>
          <span className="h-px w-8 bg-border" />
          <span>Video</span>
          <span className="h-px w-8 bg-border" />
          <span>Motion</span>
          <span className="h-px w-8 bg-border" />
          <span>Streaming</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------- Section wrapper ----------
function Section({
  id, eyebrow, title, subtitle, children,
}: { id: string; eyebrow: string; title: React.ReactNode; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-wine">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">{subtitle}</p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

// ---------- ABOUT ----------
function About() {
  const whys = [
    { icon: Sparkles, title: "Creative Excellence", desc: "Original ideas, distinctive execution." },
    { icon: Check, title: "Professional Quality", desc: "Studio-grade output every time." },
    { icon: ArrowRight, title: "Fast Delivery", desc: "Reliable timelines you can plan around." },
    { icon: Wand2, title: "Modern Technology", desc: "Best-in-class tools and workflows." },
    { icon: Star, title: "Affordable Solutions", desc: "Premium value at fair pricing." },
    { icon: MessageCircle, title: "Reliable Support", desc: "Responsive partnership beyond delivery." },
  ];
  return (
    <Section
      id="about"
      eyebrow="Why DOJ Media"
      title={<>Where <span className="italic text-wine">craft</span> meets broadcast.</>}
      subtitle="A creative studio built for brands that want to look — and feel — extraordinary across every screen."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whys.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="group rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-wine/40 hover:shadow-xl hover:shadow-wine/5"
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-wine/10 text-wine transition group-hover:bg-wine group-hover:text-white">
              <w.icon size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{w.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- SERVICES ----------
const SERVICES = [
  { icon: Palette, title: "Graphic Design", desc: "Posters, flyers, decks & brand collateral." },
  { icon: Monitor, title: "Web Design", desc: "Fast, responsive, conversion-ready sites." },
  { icon: Video, title: "Video Editing", desc: "Cinematic edits, color & sound design." },
  { icon: Sparkles, title: "Motion Graphics", desc: "Kinetic type, logo stings, explainers." },
  { icon: Layers, title: "Motion Design", desc: "UI motion & broadcast-quality animation." },
  { icon: Radio, title: "Live Streaming", desc: "Multi-cam, multi-platform live production." },
  { icon: Camera, title: "Live Streaming Setup", desc: "Studio, gear & workflow installations." },
  { icon: PenTool, title: "Branding & Identity", desc: "Logos, systems, and brand guidelines." },
  { icon: Share2, title: "Social Media Design", desc: "Feeds, reels & campaign creative." },
  { icon: Wand2, title: "Digital Content", desc: "Content strategy & always-on production." },
  { icon: Lightbulb, title: "Creative Consulting", desc: "Direction for your next big launch." },
  { icon: Play, title: "Other Media Services", desc: "Bespoke creative solutions on request." },
];

function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title={<>Everything you need, <span className="italic text-wine">under one roof</span>.</>}
      subtitle="From identity systems to live broadcasts — we design, produce, and deliver end-to-end."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition hover:border-wine/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-wine/0 via-wine/0 to-wine/10 opacity-0 transition group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine transition group-hover:scale-110 group-hover:bg-wine group-hover:text-white">
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-wine opacity-0 transition group-hover:opacity-100">
                Learn more <ArrowRight size={12} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- PORTFOLIO ----------
const PORTFOLIO_CATS = [
  "All", "Graphic Design", "Branding", "Web Design", "Motion Graphics",
  "Video Editing", "Live Streaming", "Social Media",
];
const PROJECTS = [
  { title: "Sunday Service Live", cat: "Live Streaming", hue: 15 },
  { title: "Aura Cosmetics Brand", cat: "Branding", hue: 340 },
  { title: "Nova Startup Site", cat: "Web Design", hue: 220 },
  { title: "Rhythm Motion Reel", cat: "Motion Graphics", hue: 280 },
  { title: "Editor's Cut Short", cat: "Video Editing", hue: 200 },
  { title: "Summit Poster Series", cat: "Graphic Design", hue: 30 },
  { title: "Feed Refresh Campaign", cat: "Social Media", hue: 340 },
  { title: "Conference Broadcast", cat: "Live Streaming", hue: 15 },
  { title: "Studio Rebrand", cat: "Branding", hue: 15 },
];

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<null | typeof PROJECTS[number]>(null);
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);

  return (
    <Section
      id="portfolio"
      eyebrow="Portfolio"
      title={<>Selected <span className="italic text-wine">work</span>.</>}
      subtitle="A glimpse into recent projects across design, motion, and live production."
    >
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {PORTFOLIO_CATS.map((c) => (
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
            <motion.button
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightbox(p)}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl text-left"
            >
              <div
                className="absolute inset-0 transition duration-700 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, hsl(${p.hue} 45% 25%), hsl(${p.hue} 60% 45%))`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                  {p.cat}
                </span>
                <h3 className="mt-1 font-display text-xl font-semibold text-white">
                  {p.title}
                </h3>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/80 opacity-0 transition group-hover:opacity-100">
                  View project <ArrowRight size={12} />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-card"
            >
              <div
                className="aspect-video"
                style={{ background: `linear-gradient(135deg, hsl(${lightbox.hue} 45% 25%), hsl(${lightbox.hue} 60% 45%))` }}
              />
              <div className="p-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-wine">{lightbox.cat}</span>
                <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{lightbox.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A signature DOJ Media project — crafted for maximum impact with a premium finish.
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

// ---------- SKILLS ----------
const SKILLS = [
  { name: "Adobe Photoshop", level: 96 },
  { name: "Adobe Illustrator", level: 92 },
  { name: "Adobe Premiere Pro", level: 94 },
  { name: "Adobe After Effects", level: 90 },
  { name: "Figma", level: 95 },
  { name: "HTML", level: 96 },
  { name: "CSS", level: 94 },
  { name: "JavaScript", level: 88 },
  { name: "WordPress", level: 90 },
  { name: "OBS Studio", level: 95 },
  { name: "vMix", level: 88 },
  { name: "Wirecast", level: 85 },
];

function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title={<>The <span className="italic text-wine">toolkit</span>.</>}
      subtitle="Deep fluency across the tools that power modern creative and broadcast work."
    >
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.5 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{s.name}</span>
              <span className="text-xs font-semibold text-wine">{s.level}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.03 }}
                className="h-full rounded-full bg-gradient-to-r from-wine to-wine-glow"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ---------- PROCESS ----------
const STEPS = [
  { n: "01", title: "Discovery", desc: "We listen deeply to your vision, audience, and goals." },
  { n: "02", title: "Strategy", desc: "Define the story, structure, and measurable outcomes." },
  { n: "03", title: "Design", desc: "Craft the visual system and creative direction." },
  { n: "04", title: "Production", desc: "Build, film, edit, animate — with obsessive quality." },
  { n: "05", title: "Review", desc: "Refine together until it feels undeniable." },
  { n: "06", title: "Delivery", desc: "Ship polished assets ready for every channel." },
  { n: "07", title: "Support", desc: "Ongoing partnership as your brand evolves." },
];

function Process() {
  return (
    <Section
      id="process"
      eyebrow="Process"
      title={<>How we <span className="italic text-wine">create together</span>.</>}
      subtitle="A calm, collaborative workflow designed to protect creativity and hit every deadline."
    >
      <div className="relative">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-wine/40 to-transparent lg:block" />
        <div className="space-y-6 lg:space-y-16">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col gap-6 lg:flex-row lg:items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-5/12">
                <div className={`rounded-3xl border border-border bg-card p-8 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                  <span className="font-display text-5xl font-bold text-wine/20">{s.n}</span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
              <div className="hidden lg:flex lg:w-2/12 lg:justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-wine/40 bg-background text-xs font-bold text-wine">
                  {s.n}
                </div>
              </div>
              <div className="hidden lg:block lg:w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------- STATS ----------
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const dur = 1600;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.floor(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Stats() {
  const stats = [
    { v: 350, s: "+", label: "Projects Completed" },
    { v: 180, s: "+", label: "Happy Clients" },
    { v: 8, s: "+", label: "Years of Experience" },
    { v: 220, s: "+", label: "Live Events Produced" },
    { v: 99, s: "%", label: "Client Satisfaction" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-wine via-wine-deep to-wine text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-20 lg:grid-cols-5 lg:px-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              <AnimatedNumber value={s.v} suffix={s.s} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-white/70">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- TESTIMONIALS ----------
const TESTIMONIALS = [
  { name: "Sarah Okonkwo", role: "Marketing Director, Aura", quote: "DOJ Media reinvented our brand overnight. The visuals, the motion, the streams — every touchpoint feels premium." },
  { name: "Pastor Daniel", role: "Grace Chapel", quote: "Our Sunday broadcasts have never looked more cinematic. The team is professional, punctual, and pure quality." },
  { name: "James Rivera", role: "Founder, Nova", quote: "From identity to launch website, the craft was flawless. We closed our first enterprise deal within a week of going live." },
  { name: "Amara Bello", role: "Creator, 400K followers", quote: "The motion graphics DOJ produced doubled my engagement. It's a genuine creative partnership." },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title={<>Loved by the <span className="italic text-wine">people we serve</span>.</>}
    >
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-card p-10 text-center shadow-xl shadow-wine/5 sm:p-14"
          >
            <div className="mb-6 flex justify-center gap-1 text-wine">
              {[...Array(5)].map((_, k) => <Star key={k} size={16} fill="currentColor" />)}
            </div>
            <p className="font-display text-2xl italic leading-relaxed text-foreground sm:text-3xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-white"
                style={{ background: `linear-gradient(135deg, var(--wine), var(--wine-glow))` }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-wine" : "w-1.5 bg-border"}`}
              aria-label={`Show testimonial ${k + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ---------- CTA ----------
function CTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-wine via-wine-deep to-wine p-12 text-center text-white shadow-2xl shadow-wine/30 sm:p-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
              Let's build something<br />
              <span className="italic">amazing together.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-white/80">
              Whether it's a launch, a rebrand, or a live production — we're ready when you are.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#contact" className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-wine shadow-xl transition hover:-translate-y-0.5">
                Hire DOJ Media
              </a>
              <a href="#contact" className="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                Start Your Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- CONTACT ----------
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", budget: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", type: "", budget: "", message: "" });
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={<>Start a <span className="italic text-wine">conversation</span>.</>}
      subtitle="Tell us about your project. We usually respond within one business day."
    >
      <div className="grid gap-10 lg:grid-cols-5">
        <form onSubmit={submit} className="lg:col-span-3 space-y-4 rounded-3xl border border-border bg-card p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <SelectField label="Project Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })}
              options={["Graphic Design", "Web Design", "Video Editing", "Motion Graphics", "Live Streaming", "Branding", "Other"]} />
            <div className="sm:col-span-2">
              <SelectField label="Budget" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })}
                options={["< $1k", "$1k – $5k", "$5k – $15k", "$15k – $50k", "$50k+"]} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea
              required rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
              placeholder="Tell us about your project…"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-wine/25 transition hover:shadow-xl hover:shadow-wine/40"
          >
            {sent ? <>Message sent <Check size={16} /></> : <>Send Message <Send size={14} /></>}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@dojmedia.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 010-2200" },
            { icon: MessageCircle, label: "WhatsApp", value: "+1 (555) 010-2200" },
            { icon: MapPin, label: "Location", value: "Available worldwide" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-wine/10 text-wine">
                <c.icon size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="text-sm font-semibold text-foreground">{c.value}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-wine hover:bg-wine hover:text-white">
                <Icon size={16} />
              </a>
            ))}
          </div>
          <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
            <div className="relative h-full w-full bg-gradient-to-br from-muted to-background">
              <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                <MapPin size={14} className="mr-2 text-wine" /> Google Maps placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}{required && <span className="text-wine"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ---------- FAQ ----------
const FAQS = [
  { q: "What kinds of clients do you work with?", a: "Businesses, creators, churches, brands, and organizations of every size — from startups to global teams." },
  { q: "How long does a typical project take?", a: "Most design engagements take 2–4 weeks; live productions can be booked with as little as 72 hours notice." },
  { q: "Do you work internationally?", a: "Yes. We deliver design and post-production globally, and can travel or set up remote live productions worldwide." },
  { q: "Can you handle end-to-end live streaming?", a: "Absolutely — from gear, multi-cam directing, graphics, and audio to multi-platform simulcast." },
];
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title={<>Common <span className="italic text-wine">questions</span>.</>}>
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold text-foreground">{f.q}</span>
              <span className={`text-wine transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- FOOTER ----------
function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <DojLogo size={44} showText />
            <p className="mt-6 max-w-sm text-sm text-muted-foreground">
              A premium creative studio for design, video, motion, and professional live production.
            </p>
            <form className="mt-6 flex max-w-sm gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-wine"
              />
              <button className="rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-white">
                Join
              </button>
            </form>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {NAV.slice(0, 5).map((n) => (
                <li key={n.id}><a href={`#${n.id}`} className="hover:text-wine">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.title}><a href="#services" className="hover:text-wine">{s.title}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} DOJ Media. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-wine">Privacy Policy</a>
            <a href="#" className="hover:text-wine">Terms</a>
          </div>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground hover:text-wine">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- Floating buttons ----------
function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <a
        href="https://wa.me/15550102200"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 transition hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle size={22} />
      </a>
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-wine text-white shadow-xl shadow-wine/30"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- ROOT ----------
function DojMediaSite() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LogoIntro />
      <Nav dark={dark} setDark={setDark} />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Skills />
        <Process />
        <Stats />
        <Testimonials />
        <CTA />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
