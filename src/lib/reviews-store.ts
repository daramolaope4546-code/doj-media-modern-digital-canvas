/**
 * Client-side review store used by the demo fallback.
 *
 * Reviews are persisted in the browser's localStorage so they survive a page
 * refresh, but they are only stored locally (single browser/device). They are
 * NOT shared across devices or visitors — a production deployment should back
 * this store with a real backend.
 */

import type { Review, ReviewStatus } from "@/data/reviews";

const STORAGE_KEY = "doj_reviews_v1";
const CHANGE_EVENT = "doj:reviews-changed";

export const REVIEW_MAX_LENGTH = 600;
export const NAME_MAX_LENGTH = 80;
export const EMAIL_MAX_LENGTH = 120;
export const SUBMIT_COOLDOWN_MS = 45_000;
const COOLDOWN_KEY = "doj_reviews_last_submit";

/**
 * Strip markup and collapse whitespace, then cap length. HTML is escaped by
 * React during rendering, so no entities are encoded here. Never render raw HTML.
 */
export function sanitizeText(input: string, max: number): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

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

export function loadStoredReviews(): Review[] {
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
    /* storage unavailable (private mode / quota) — ignore */
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Merge featured reviews with locally approved ones, newest first, de-duplicated by id. */
export function getPublicReviews(featured: Review[]): Review[] {
  const stored = loadStoredReviews();
  const approved = stored.filter((r) => r.status === "approved");
  const merged = [...featured, ...approved];
  const seen = new Set<string>();
  const unique = merged.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
  return unique.sort((a, b) => {
    const ta = Date.parse(a.createdAt) || 0;
    const tb = Date.parse(b.createdAt) || 0;
    return tb - ta;
  });
}

export interface SubmittedReviewInput {
  name: string;
  email?: string;
  service?: string;
  rating: number;
  review: string;
}

/** Persist a visitor's submission as `pending`. Returns the created review or null. */
export function submitReview(input: SubmittedReviewInput): Review | null {
  const review: Review = {
    id: makeId(),
    name: sanitizeText(input.name, NAME_MAX_LENGTH),
    email: input.email ? sanitizeText(input.email, EMAIL_MAX_LENGTH) : undefined,
    service: input.service ? sanitizeText(input.service, 60) : undefined,
    rating: input.rating,
    review: sanitizeText(input.review, REVIEW_MAX_LENGTH),
    status: "pending",
    createdAt: new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
  if (!review.name || !review.review) return null;
  saveStoredReviews([review, ...loadStoredReviews()]);
  return review;
}

/** All locally stored reviews (admin panel). */
export function getAllReviews(): Review[] {
  return loadStoredReviews().sort((a, b) => {
    const ta = Date.parse(a.createdAt) || 0;
    const tb = Date.parse(b.createdAt) || 0;
    return tb - ta;
  });
}

export function updateReviewStatus(id: string, status: ReviewStatus): void {
  const reviews = loadStoredReviews().map((r) => (r.id === id ? { ...r, status } : r));
  saveStoredReviews(reviews);
}

export function deleteReview(id: string): void {
  saveStoredReviews(loadStoredReviews().filter((r) => r.id !== id));
}

export function subscribeReviews(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

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
