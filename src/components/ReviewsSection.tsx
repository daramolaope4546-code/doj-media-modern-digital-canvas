import { useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Section, Reveal } from "@/components/Section";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewFormDialog } from "@/components/ReviewFormDialog";
import { featuredReviews, type Review } from "@/data/reviews";
import { getPublicReviews } from "@/lib/reviews-store";
import { isSupabaseConfigured } from "@/lib/supabase";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(featuredReviews);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicReviews(featuredReviews).then((r) => {
      if (active) setReviews(r);
    });
    return () => {
      active = false;
    };
  }, []);

  // Refetch when the dialog closes (after a submission) so new pending reviews
  // are not shown, but the public list stays current.
  useEffect(() => {
    if (dialogOpen || !isSupabaseConfigured()) return;
    let active = true;
    getPublicReviews(featuredReviews).then((r) => {
      if (active) setReviews(r);
    });
    return () => {
      active = false;
    };
  }, [dialogOpen]);

  return (
    <>
      <Section
        eyebrow="Client Reviews"
        title={
          <>
            What people <span className="italic text-wine">say</span>.
          </>
        }
        subtitle="A few words from clients and partners who have worked with DOJ MEDIA."
      >
        {reviews.length === 0 ? (
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <h3 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                Be one of the first to share your experience
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Have you worked with DOJ MEDIA? Your feedback helps others understand what to
                expect.
              </p>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-wine px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-2xl shadow-wine/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#961e3c]"
              >
                <MessageSquarePlus size={16} aria-hidden="true" />
                Leave a Review
              </button>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={(i % 3) * 0.07}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="mx-auto mt-14 max-w-2xl text-center">
            <h3 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              Have you worked with DOJ MEDIA?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Share your experience — it only takes a minute and helps others decide.
            </p>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-wine px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-2xl shadow-wine/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#961e3c] hover:shadow-[0_14px_44px_-12px_rgba(160,30,60,0.75)]"
            >
              <MessageSquarePlus size={16} aria-hidden="true" />
              Leave a Review
            </button>
          </div>
        </Reveal>
      </Section>

      <ReviewFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
