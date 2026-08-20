import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Inbox, Loader2, ShieldAlert, ShieldCheck, Trash2, X } from "lucide-react";
import { AdminLayout, type AdminTab } from "@/components/admin/AdminLayout";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectList } from "@/components/admin/ProjectList";
import { PageHero, Section, Reveal } from "@/components/Section";
import { StarRating } from "@/components/StarRating";
import type { Review, ReviewStatus } from "@/data/reviews";
import { deleteReview, getAllReviews, updateReviewStatus } from "@/lib/reviews-store";
import { getAllProjects, type Project } from "@/lib/projects-store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin | DOJ MEDIA" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

const FILTERS: { key: ReviewStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const statusStyles: Record<ReviewStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

/* ── Main page ──────────────────────────────────────────────── */

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <PageHero
          eyebrow="Private"
          title={
            <>
              Review <span className="italic text-wine">moderation</span>.
            </>
          }
        />
        <Section>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-wine" aria-hidden="true" />
          </div>
        </Section>
      </>
    );
  }

  if (!isSupabaseConfigured()) {
    return <SupabaseNotConfigured />;
  }

  if (!session) {
    return <LoginForm onLogin={setSession} />;
  }

  return <Dashboard onLogout={() => setSession(null)} />;
}

/* ── Supabase not configured ────────────────────────────────── */

function SupabaseNotConfigured() {
  return (
    <>
      <PageHero
        eyebrow="Private"
        title={
          <>
            Review <span className="italic text-wine">moderation</span>.
          </>
        }
      />
      <Section>
        <Reveal>
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 mx-auto">
              <ShieldAlert size={20} className="text-amber-600" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">
              Supabase not configured
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Set <code className="rounded bg-card px-1 py-0.5 text-xs">VITE_SUPABASE_URL</code> and{" "}
              <code className="rounded bg-card px-1 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code> in
              your <code className="rounded bg-card px-1 py-0.5 text-xs">.env</code> file, then
              restart the dev server.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              See <code className="rounded bg-card px-1 py-0.5">.env.example</code> for
              instructions.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

/* ── Login form ─────────────────────────────────────────────── */

function LoginForm({ onLogin }: { onLogin: (s: unknown) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabase();
    if (!sb) return;
    setSubmitting(true);
    try {
      const { data, error: authError } = await sb.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(
          authError.message.includes("Invalid login")
            ? "Incorrect email or password."
            : authError.message,
        );
        return;
      }
      onLogin(data.session);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Private"
        title={
          <>
            Admin <span className="italic text-wine">dashboard</span>.
          </>
        }
      />
      <Section>
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine">
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">Admin login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with your admin credentials to manage your portfolio.
            </p>

            <label htmlFor="admin-email" className="sr-only">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              required
              className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
            />

            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <div className="relative mt-3">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-16 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition hover:text-wine"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !email.trim() || !password.trim()}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-wine px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-wine/25 transition hover:bg-[#961e3c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : null}
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </Reveal>
      </Section>
    </>
  );
}

/* ── Dashboard (authenticated) ──────────────────────────────── */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [projectView, setProjectView] = useState<"list" | "form">("list");

  const handleLogout = async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    onLogout();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectView("form");
  };

  const handleAddProject = () => {
    setEditingProject(undefined);
    setProjectView("form");
  };

  const handleProjectSaved = () => {
    setEditingProject(undefined);
    setProjectView("list");
    setTab("projects");
  };

  const handleProjectBack = () => {
    setEditingProject(undefined);
    setProjectView("list");
  };

  return (
    <AdminLayout tab={tab} onTabChange={setTab} onLogout={handleLogout}>
      {tab === "dashboard" && <Overview />}
      {tab === "projects" && projectView === "list" && (
        <ProjectList onEdit={handleEditProject} onAdd={handleAddProject} />
      )}
      {tab === "projects" && projectView === "form" && (
        <ProjectForm
          project={editingProject}
          onBack={handleProjectBack}
          onSaved={handleProjectSaved}
        />
      )}
      {tab === "reviews" && <ReviewsPanel />}
    </AdminLayout>
  );
}

/* ── Overview tab ───────────────────────────────────────────── */

function Overview() {
  const [projectCount, setProjectCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [projects, reviews] = await Promise.all([
        getAllProjects(),
        getAllReviews(),
      ]);
      setProjectCount(projects.length);
      setReviewCount(reviews.length);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-wine" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground">Dashboard</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back. Here is an overview of your content.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Projects" value={projectCount} />
        <StatCard label="Total Reviews" value={reviewCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

/* ── Reviews tab ────────────────────────────────────────────── */

function ReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const all = await getAllReviews();
    setReviews(all);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id: string, status: ReviewStatus) => {
    const ok = await updateReviewStatus(id, status);
    if (ok) {
      toast.success(`Review ${status === "approved" ? "approved" : "rejected"}.`);
      await load();
    } else {
      toast.error("Failed to update review. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteReview(deleteId);
    setDeleteId(null);
    if (ok) {
      toast.success("Review deleted.");
      await load();
    } else {
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const counts = FILTERS.reduce<Record<string, number>>(
    (acc, f) => {
      acc[f.key] =
        f.key === "all" ? reviews.length : reviews.filter((r) => r.status === f.key).length;
      return acc;
    },
    { all: 0, pending: 0, approved: 0, rejected: 0 },
  );
  const visible = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground">Reviews</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve, reject or delete reviews submitted through the site.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
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
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wine" aria-hidden="true" />
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {filter === "pending"
              ? "No pending reviews. New submissions will appear here."
              : "No reviews in this category."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visible.map((review) => (
            <article
              key={review.id}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6"
            >
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
                  <a
                    href={`mailto:${review.email}`}
                    className="hover:text-wine hover:underline"
                  >
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
                    onClick={() => handleStatus(review.id, "approved")}
                    className="border-wine/40 bg-wine/10 text-wine hover:bg-wine hover:text-white"
                  >
                    <Check size={14} aria-hidden="true" /> Approve
                  </AdminButton>
                )}
                {review.status !== "rejected" && (
                  <AdminButton
                    label="Reject"
                    onClick={() => handleStatus(review.id, "rejected")}
                    className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                  >
                    <X size={14} aria-hidden="true" /> Reject
                  </AdminButton>
                )}
                <AdminButton
                  label="Delete"
                  onClick={() => setDeleteId(review.id)}
                  className="border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                >
                  <Trash2 size={14} aria-hidden="true" /> Delete
                </AdminButton>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold text-foreground">Delete review?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone. The review will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-full border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-destructive/50 bg-destructive px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Public page:{" "}
        <Link to="/" className="font-semibold text-wine hover:underline">
          back to the site
        </Link>
      </p>
    </div>
  );
}

/* ── Shared button ──────────────────────────────────────────── */

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
