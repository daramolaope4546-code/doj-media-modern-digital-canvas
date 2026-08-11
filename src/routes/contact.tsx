import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Linkedin, Github, Instagram, Facebook, Send, Check } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/Section";
import { contact } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DOJ MEDIA" },
      { name: "description", content: "Get in touch for graphics design, web design, video editing, motion design or live streaming projects." },
      { property: "og:title", content: "Contact — DOJ MEDIA" },
      { property: "og:description", content: "Send a message to start a design, video, motion or live streaming project." },
      { property: "og:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://dojmedia.lovable.app/og-image.jpg" },
    ],
  }),
  component: ContactPage,
});

const details = [
  { icon: Phone, label: "Phone", value: contact.phone },
  { icon: MessageCircle, label: "WhatsApp", value: contact.whatsapp },
  { icon: Mail, label: "Email", value: contact.email },
  { icon: MapPin, label: "Location", value: contact.location },
];

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: contact.linkedin },
  { icon: Github, label: "GitHub", href: contact.github },
  { icon: Instagram, label: "Instagram", href: contact.instagram },
  { icon: Facebook, label: "Facebook", href: contact.facebook },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let's start a <span className="italic text-wine">conversation</span>.</>}
        subtitle="Send a message with the details of your project and I'll get back to you."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border bg-card p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              </div>
              <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Message<span className="text-wine"> *</span>
                </label>
                <textarea
                  required rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project…"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-wine/25 transition hover:shadow-xl hover:shadow-wine/40"
              >
                {sent ? <>Message sent <Check size={16} /></> : <>Send Message <Send size={14} /></>}
              </button>
              {sent && (
                <p className="text-xs text-muted-foreground">Thanks — your message has been received.</p>
              )}
            </form>
          </Reveal>

          <div className="space-y-4 lg:col-span-2">
            {details.map((d, i) => (
              <Reveal key={d.label} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine/10 text-wine">
                    <d.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.label}</div>
                    <div className="truncate text-sm font-semibold text-foreground">{d.value}</div>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Social</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-foreground/80 transition hover:border-wine hover:text-wine"
                    >
                      <s.icon size={15} className="text-wine" />
                      <span className="truncate">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({
  label, value, onChange, type = "text", required = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
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
