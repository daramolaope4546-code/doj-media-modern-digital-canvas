import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <Star
      aria-hidden="true"
      className={cn(
        "h-5 w-5 transition-colors",
        filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-border",
        className,
      )}
    />
  );
}

/** Read-only star display, e.g. ★★★★★ on a review card. */
export function StarRating({ value, className = "" }: { value: number; className?: string }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < value);
  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {stars.map((filled, i) => (
        <StarIcon key={i} filled={filled} />
      ))}
    </div>
  );
}

/** Interactive 1–5 star selector for the review form. */
export function StarRatingInput({
  value,
  onChange,
  id,
  invalid = false,
}: {
  value: number;
  onChange: (value: number) => void;
  id: string;
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-label="Rating"
      className={cn("flex items-center gap-1", invalid && "rounded-lg ring-2 ring-destructive/50")}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        const selected = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="group rounded-md p-0.5 outline-none transition focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2"
          >
            <StarIcon
              filled={selected}
              className="h-7 w-7 transition-transform group-hover:scale-110"
            />
          </button>
        );
      })}
      <span aria-live="polite" className="sr-only">
        {value > 0 ? `Selected ${value} out of 5 stars` : "No rating selected"}
      </span>
    </div>
  );
}
