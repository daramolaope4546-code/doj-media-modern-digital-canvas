/**
 * Review store backed by Supabase when configured, falling back to localStorage
 * when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set.
 *
 * The public API is unchanged so existing components (ReviewsSection,
 * ReviewFormDialog, admin panel) keep working with minimal edits.
 */

import { getSupabase, type ReviewRow } from "@/lib/supabase";
import type { Review, ReviewStatus } from "@/data/reviews";

/* ── Constants ──────────────────────────────────────────────── */

export const REVIEW_MAX_LENGTH = 600;
export const NAME_MAX_LENGTH = 80;
export const EMAIL_MAX_LENGTH = 120;
export const SUBMIT_COOLDOWN_MS = 45_000;

const STORAGE_KEY = "doj_reviews_v1";
const COOLDOWN_KEY = "doj_reviews_last_submit";
const CHANGE_EVENT = "doj:reviews-changed";

/* ── Helpers ────────────────────────────────────────────────── */

export function sanitizeText(input: string, max: number): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/* ── LocalStorage fallback ──────────────────────────────────── */

function isValidReview(value: unknown): value is Review {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.review === "string" &&
    typeof r.rating === "number" &&
    r.rating >= 1 &&
    r.rating <= 5 &&
    (r.status === "pending" || r.status === "approved" || r.status === "rejected") &&
    typeof r.createdAt === "string"
  );
}

function loadStoredReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidReview).map((r) => ({
      id: r.id,
      name: sanitizeText(r.name, NAME_MAX_LENGTH),
      email: typeof r.email === "string" ? sanitizeText(r.email, EMAIL_MAX_LENGTH) : undefined,
      service: typeof r.service === "string" ? sanitizeText(r.service, 60) : undefined,
      rating: r.rating,
      review: sanitizeText(r.review, REVIEW_MAX_LENGTH),
      status: r.status,
      createdAt: sanitizeText(r.createdAt, 40),
    }));
  } catch {
    return [];
  }
}

function saveStoredReviews(reviews: Review[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: reviews }));
  } catch {
    /* storage unavailable */
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ── Supabase row → Review mapping ──────────────────────────── */

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    service: row.service ?? undefined,
    rating: row.rating,
    review: row.review,
    status: row.status,
    createdAt: row.created_at,
  };
}

/* ── Public API ─────────────────────────────────────────────── */

export async function getPublicReviews(featured: Review[]): Promise<Review[]> {
  const sb = getSupabase();
  if (!sb) return sortReviews(dedupe(featured));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("reviews") as any;
  try {
    const { data, error } = await qb
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error || !data) return sortReviews(dedupe(featured));
    const remote = (data as ReviewRow[]).map(rowToReview);
    return sortReviews(dedupe([...featured, ...remote]));
  } catch {
    return sortReviews(dedupe(featured));
  }
}

export async function submitReview(input: {
  name: string;
  email?: string;
  service?: string;
  rating: number;
  review: string;
}): Promise<Review | null> {
  const name = sanitizeText(input.name, NAME_MAX_LENGTH);
  const email = input.email ? sanitizeText(input.email, EMAIL_MAX_LENGTH) : undefined;
  const service = input.service ? sanitizeText(input.service, 60) : undefined;
  const review = sanitizeText(input.review, REVIEW_MAX_LENGTH);
  if (!name || !review || input.rating < 1) return null;

  const sb = getSupabase();
  if (!sb) {
    const local: Review = {
      id: makeId(),
      name,
      email,
      service,
      rating: input.rating,
      review,
      status: "pending",
      createdAt: new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    saveStoredReviews([local, ...loadStoredReviews()]);
    return local;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("reviews") as any;
  try {
    const { data, error } = await qb
      .insert({
        name,
        email: email ?? null,
        service: service ?? null,
        rating: input.rating,
        review,
      })
      .select()
      .single();
    if (error || !data) return null;
    return rowToReview(data as ReviewRow);
  } catch {
    return null;
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const sb = getSupabase();
  if (!sb) return sortReviews(loadStoredReviews());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("reviews") as any;
  try {
    const { data, error } = await qb.select("*").order("created_at", { ascending: false });
    if (error || !data) return sortReviews(loadStoredReviews());
    return (data as ReviewRow[]).map(rowToReview);
  } catch {
    return sortReviews(loadStoredReviews());
  }
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) {
    const reviews = loadStoredReviews().map((r) => (r.id === id ? { ...r, status } : r));
    saveStoredReviews(reviews);
    return true;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (sb.from("reviews") as any).update({ status }).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) {
    saveStoredReviews(loadStoredReviews().filter((r) => r.id !== id));
    return true;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (sb.from("reviews") as any).delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/* ── Event subscription (localStorage fallback only) ────────── */

export function subscribeReviews(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

/* ── Cooldown helpers ───────────────────────────────────────── */

export function lastSubmitAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(COOLDOWN_KEY);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function markSubmitted(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/* ── Internal utils ─────────────────────────────────────────── */

function dedupe(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  return reviews.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

function sortReviews(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => {
    const ta = Date.parse(a.createdAt) || 0;
    const tb = Date.parse(b.createdAt) || 0;
    return tb - ta;
  });
}
