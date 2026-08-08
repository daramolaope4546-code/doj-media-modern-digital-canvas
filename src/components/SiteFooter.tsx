import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";
import { DojLogo } from "@/components/DojLogo";
import { NAV, contact, profile, services } from "@/data/site";

const socials = [
  { icon: Facebook, href: contact.facebook, label: "Facebook" },
  { icon: Instagram, href: contact.instagram, label: "Instagram" },
  { icon: Linkedin, href: contact.linkedin, label: "LinkedIn" },
  { icon: Github, href: contact.github, label: "GitHub" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <DojLogo size={44} showText />
            <p className="mt-5 text-sm font-semibold text-foreground">{profile.name}</p>
            <p className="text-xs uppercase tracking-widest text-wine">{profile.title}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Design, video, motion, and professional live production — crafted with a premium finish.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="transition hover:text-wine">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {services.map((s) => (
                <li key={s.title}>
                  <Link to="/services" className="transition hover:text-wine">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone size={14} className="text-wine" />{contact.phone}</li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-wine" />{contact.email}</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-wine" />{contact.location}</li>
            </ul>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-wine hover:bg-wine hover:text-white"
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.brand}. All rights reserved.</span>
          <span>Designed & built by {profile.name}</span>
        </div>
      </div>
    </footer>
  );
}
