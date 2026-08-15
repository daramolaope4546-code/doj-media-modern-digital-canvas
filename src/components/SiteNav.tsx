import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { DojLogo } from "@/components/DojLogo";
import { NAV } from "@/data/site";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Over the dark cinematic hero (home, not scrolled) the nav needs light
  // styling; everywhere else it keeps the site's default look.
  const onDark = pathname === "/" && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border/60 bg-background/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link to="/" className="flex min-w-0 shrink items-center">
          <DojLogo size={40} showText textColor={onDark ? "#ffffff" : "currentColor"} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-8">

          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className={`group relative text-sm font-medium transition data-[status=active]:text-wine ${
                onDark
                  ? "text-white/80 hover:text-white data-[status=active]:text-white"
                  : "text-foreground/75 hover:text-foreground"
              }`}
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 rounded-full bg-wine transition-all duration-300 group-hover:w-full group-data-[status=active]:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
            className={`rounded-full border p-2 transition hover:border-wine ${
              onDark
                ? "border-white/30 text-white/80 hover:text-white"
                : "border-border text-foreground/70 hover:text-wine"
            }`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/contact"
            className="hidden rounded-full bg-wine px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-wine/20 transition hover:shadow-xl hover:shadow-wine/40 sm:inline-block"
          >
            Let's Talk
          </Link>
          <button
            className={`rounded-full border p-2 lg:hidden ${onDark ? "border-white/30 text-white" : "border-border"}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
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
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-wine data-[status=active]:bg-wine/10 data-[status=active]:text-wine"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
