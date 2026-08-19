import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Inbox, Lock, ShieldAlert, Trash2, X } from "lucide-react";
import { PageHero, Section, Reveal } from "@/components/Section";
import { StarRating } from "@/components/StarRating";
import type { Review, ReviewStatus } from "@/data/reviews";
import {
  deleteReview,
  getAllReviews,
  subscribeReviews,
  updateReviewStatus,
} from "@/lib/reviews-store";
import { cn } from "@/lib/utils";

const ADMIN_HASH = import.meta.env.VITE_REVIEWS_ADMIN_HASH as string | undefined;
const AUTH_KEY = "doj_reviews_admin_authed";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Review Moderation | DOJ MEDIA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReviewsAdminPage,
});

const FILTERS: { key: ReviewStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const statusStyles: Record<ReviewStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

function ReviewsAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | "all">("all");

  useEffect(() => {
    try {
      setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    setReviews(getAllReviews());
    const unsubscribe = subscribeReviews(() => setReviews(getAllReviews()));
    return unsubscribe;
  }, [authed]);

  if (!authed) {
    return <PasscodeGate onAuthed={() => setAuthed(true)} />;
  }

  const counts = FILTERS.reduce<Record<string, number>>(
    (acc, f) => {
      acc[f.key] = f.key === "all" ? reviews.length : reviews.filter((r) => r.status === f.key).length;
      return acc;
    },
    { all: 0, pending: 0, approved: 0, rejected: 0 },
  );
  const visible = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <>
      <PageHero
        eyebrow="Private"
        title={<>Review <span className="italic text-wine">moderation</span>.</>}
        subtitle="Approve, reject or delete reviews submitted through the site."
      />

      <Section>
        <Reveal>
          <div className="rounded-2xl border border-wine/30 bg-wine/5 p-5 text-sm leading-relaxed text-foreground/80">
            <p className="flex items-start gap-2 font-semibold text-foreground">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-wine" aria-hidden="true" />
              Demo fallback storage
            </p>
            <p className="mt-2">
              Reviews are stored in this browser only (localStorage) and are not shared across devices.
              Submitted reviews stay <strong>pending</strong> until you approve them here. The featured
              reviews shown on the public site are managed in{" "}
              <code className="rounded bg-card px-1 py-0.5 text-xs">src/data/reviews.ts</code>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
                    filter === f.key
                      ? "border-wine bg-wine text-white"
                      : "border-border bg-card text-muted-foreground hover:border-wine/50 hover:text-wine",
                  )}
                >
                  {f.label}
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{counts[f.key]}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem(AUTH_KEY);
                setAuthed(false);
              }}
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground underline-offset-4 transition hover:text-wine hover:underline"
            >
              Lock panel
            </button>
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {filter === "pending"
                  ? "No pending reviews. New submissions will appear here."
                  : "No reviews in this category."}
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {visible.map((review, i) => (
              <Reveal key={review.id} delay={(i % 2) * 0.05}>
                <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{review.name}</span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                          statusStyles[review.status],
                        )}
                      >
                        {review.status}
                      </span>
                    </div>
                    <time dateTime={review.createdAt} className="text-xs text-muted-foreground">
                      {review.createdAt}
                    </time>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <StarRating value={review.rating} />
                    {review.service && (
                      <span className="text-xs font-semibold text-wine">{review.service}</span>
                    )}
                  </div>

                  {review.email && (
                    <p className="mt-3 truncate text-xs text-muted-foreground">
                      <span className="font-semibold uppercase tracking-widest">Email:</span>{" "}
                      <a href={`mailto:${review.email}`} className="hover:text-wine hover:underline">
                        {review.email}
                      </a>
                    </p>
                  )}

                  <p className="mt-3 flex-1 break-words whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.review}&rdquo;
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border/70 pt-4">
                    {review.status !== "approved" && (
                      <AdminButton
                        label="Approve"
                        onClick={() => updateReviewStatus(review.id, "approved")}
                        className="border-wine/40 bg-wine/10 text-wine hover:bg-wine hover:text-white"
                      >
                        <Check size={14} aria-hidden="true" /> Approve
                      </AdminButton>
                    )}
                    {review.status !== "rejected" && (
                      <AdminButton
                        label="Reject"
                        onClick={() => updateReviewStatus(review.id, "rejected")}
                        className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                      >
                        <X size={14} aria-hidden="true" /> Reject
                      </AdminButton>
                    )}
                    <AdminButton
                      label="Delete"
                      onClick={() => deleteReview(review.id)}
                      className="border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 size={14} aria-hidden="true" /> Delete
                    </AdminButton>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Public page:{" "}
          <Link to="/" className="font-semibold text-wine hover:underline">
            back to the site
          </Link>
        </p>
      </Section>
    </>
  );
}

function AdminButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition",
        className,
      )}
    >
      {children}
    </button>
  );
}

function PasscodeGate({ onAuthed }: { onAuthed: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!ADMIN_HASH) {
      setError("Admin access is not configured. Set VITE_REVIEWS_ADMIN_HASH to the SHA-256 of your passcode.");
      return;
    }
    setChecking(true);
    try {
      const hash = await sha256Hex(code.trim());
      if (hash === ADMIN_HASH.toLowerCase()) {
        window.sessionStorage.setItem(AUTH_KEY, "1");
        onAuthed();
      } else {
        setError("Incorrect passcode.");
      }
    } catch {
      setError("This browser doesn't support secure hashing. Please try a modern browser.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Private" title={<>Review <span className="italic text-wine">moderation</span>.</>} />
      <Section>
        <Reveal>
          <form
            onSubmit={submit}
            className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine">
              <Lock size={20} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">Enter passcode</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This panel is private. Enter the passcode configured for the site.
            </p>
            <label htmlFor="admin-code" className="sr-only">
              Passcode
            </label>
            <input
              id="admin-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="current-password"
              aria-invalid={Boolean(error)}
              className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
            />
            {error && (
              <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={checking || !code.trim()}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-wine px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-wine/25 transition hover:bg-[#961e3c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {checking ? "Checking\u2026" : "Unlock"}
            </button>
          </form>
        </Reveal>
      </Section>
    </>
  );
}
