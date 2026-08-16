import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StarRatingInput } from "@/components/StarRating";
import { REVIEW_SERVICES } from "@/data/reviews";
import {
  submitReview,
  markSubmitted,
  lastSubmitAt,
  SUBMIT_COOLDOWN_MS,
  REVIEW_MAX_LENGTH,
} from "@/lib/reviews-store";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "rating" | "review" | "form", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ReviewFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<"form" | "success">("form");

  const reset = () => {
    setName("");
    setEmail("");
    setService("");
    setRating(0);
    setReview("");
    setHoneypot("");
    setErrors({});
    setPhase("form");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
      onOpenChange(false);
      return;
    }
    // Reset form state (but keep any cooldown) each time it reopens.
    reset();
    onOpenChange(true);
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (rating < 1) next.rating = "Please select a rating.";
    if (!review.trim()) next.review = "Please share a few words about your experience.";
    else if (review.trim().length < 10) next.review = "Your review should be at least 10 characters.";
    if (email.trim() && !EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    const last = lastSubmitAt();
    if (last && Date.now() - last < SUBMIT_COOLDOWN_MS) {
      next.form = "Thanks for sharing! Please wait a moment before submitting again.";
    }
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Honeypot: silently accept bots without storing anything.
    if (honeypot.trim()) {
      setPhase("success");
      return;
    }

    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const created = submitReview({ name, email, service, rating, review });
    markSubmitted();
    setPhase(created ? "success" : "form");
    if (!created) setErrors({ form: "Something went wrong. Please try again." });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
        {phase === "success" ? (
          <div className="flex flex-col items-center px-2 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wine/10">
              <CheckCircle2 className="h-8 w-8 text-wine" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Thank you for your review!</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your review has been submitted and will appear after approval.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-8 rounded-full bg-wine px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#961e3c]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold text-foreground">
                Leave a review
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Share your experience working with DOJ MEDIA. Reviews appear after approval.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} noValidate className="space-y-5">
              {/* Honeypot — hidden from humans and screen readers. */}
              <div className="sr-only absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="reviews-company">Company</label>
                <input
                  id="reviews-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="review-name" required error={errors.name}>
                  <input
                    id="review-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "review-name-error" : undefined}
                    className={inputClass(Boolean(errors.name))}
                  />
                </Field>

                <Field label="Email" htmlFor="review-email" optional error={errors.email}>
                  <input
                    id="review-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    maxLength={120}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "review-email-error" : undefined}
                    className={inputClass(Boolean(errors.email))}
                  />
                </Field>
              </div>

              <Field label="Service / Project" htmlFor="review-service" optional>
                <select
                  id="review-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={cn(inputClass(false), "appearance-none bg-background")}
                >
                  <option value="">Select a service…</option>
                  {REVIEW_SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <span id="review-rating-label" className={labelClass()}>
                  Rating <span className="text-wine"> *</span>
                </span>
                <div className="mt-2">
                  <StarRatingInput id="review-rating" value={rating} onChange={setRating} invalid={Boolean(errors.rating)} />
                </div>
                {errors.rating && (
                  <p id="review-rating-error" className="mt-1.5 text-xs font-medium text-destructive">
                    {errors.rating}
                  </p>
                )}
              </div>

              <Field label="Review" htmlFor="review-text" required error={errors.review}>
                <textarea
                  id="review-text"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell me about your experience working with DOJ MEDIA…"
                  rows={4}
                  maxLength={REVIEW_MAX_LENGTH}
                  aria-invalid={Boolean(errors.review)}
                  aria-describedby={errors.review ? "review-text-error" : "review-text-hint"}
                  className={cn(inputClass(Boolean(errors.review)), "resize-none")}
                />
                <span id="review-text-hint" className="mt-1.5 block text-right text-xs text-muted-foreground">
                  {review.length}/{REVIEW_MAX_LENGTH}
                </span>
              </Field>

              {errors.form && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-wine px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-wine/25 transition hover:bg-[#961e3c] hover:shadow-xl hover:shadow-wine/40 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                <Send size={14} aria-hidden="true" />
                Submit Review
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function labelClass(required = false) {
  return cn(
    "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
    required && "text-foreground",
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20",
    invalid ? "border-destructive" : "border-border",
  );
}

function Field({
  label,
  htmlFor,
  required = false,
  optional = false,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass(required)}>
        {label}
        {required && <span className="text-wine"> *</span>}
        {optional && <span className="font-normal normal-case tracking-normal text-muted-foreground/70"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
