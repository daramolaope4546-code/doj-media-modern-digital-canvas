import { Quote } from "lucide-react";
import type { Review } from "@/data/reviews";
import { StarRating } from "@/components/StarRating";

/**
 * Review text is rendered by React (text interpolation only) — never via
 * dangerouslySetInnerHTML — so any submitted markup is shown as plain text.
 */
export function ReviewCard({ review }: { review: Review }) {
  const initials = review.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <figure className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-wine/40 hover:shadow-xl hover:shadow-wine/5">
      <div className="flex items-center justify-between gap-3">
        <StarRating value={review.rating} />
        <Quote aria-hidden="true" className="h-5 w-5 text-wine/40" />
      </div>

      <blockquote className="mt-5 flex-1">
        <p className="line-clamp-6 break-words whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          “{review.review}”
        </p>
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wine/10 font-display text-sm font-semibold text-wine">
          {initials || "★"}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">{review.name}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            {review.service && <span className="text-wine">{review.service}</span>}
            <span className="text-muted-foreground/60">•</span>
            <time dateTime={review.createdAt}>{review.createdAt}</time>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
