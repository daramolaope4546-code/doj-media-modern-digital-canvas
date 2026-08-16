/**
 * ============================================================
 * CLIENT REVIEWS (featured / approved)
 * Edit this file to change which reviews appear on the site.
 * Reviews submitted by visitors through the "Leave a review"
 * form are stored separately and only shown once approved.
 * ============================================================
 */

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  name: string;
  /** Optional. Never rendered publicly — only visible to the owner in the admin panel. */
  email?: string;
  service?: string;
  rating: number;
  review: string;
  status: ReviewStatus;
  createdAt: string;
}

/** Options shown in the "Service / Project" dropdown of the review form. */
export const REVIEW_SERVICES = [
  "Graphic Design",
  "Web Design",
  "Video Editing",
  "Motion Design",
  "Live Streaming",
  "Other",
] as const;

/** Featured reviews displayed publicly (approved). Newest first. */
export const featuredReviews: Review[] = [
  {
    id: "seed-01",
    name: "Samuel Adewale",
    service: "Graphic Design",
    rating: 5,
    review:
      "DOJ MEDIA delivered exactly what we needed. The design was professional, the brand colours were respected, and the whole process was smooth from first draft to final file.",
    createdAt: "February 12, 2026",
    status: "approved",
  },
  {
    id: "seed-02",
    name: "Grace O.",
    service: "Web Design",
    rating: 5,
    review:
      "My website finally looks premium. Fast, clean, and easy to navigate on both desktop and mobile. I received a lot of compliments from clients.",
    createdAt: "January 28, 2026",
    status: "approved",
  },
  {
    id: "seed-03",
    name: "Emmanuel B.",
    service: "Live Streaming",
    rating: 5,
    review:
      "The live broadcast was flawless. Multi-camera switching, clean graphics, and zero downtime. Viewers kept asking how it was done.",
    createdAt: "December 15, 2025",
    status: "approved",
  },
  {
    id: "seed-04",
    name: "Pastor Michael A.",
    service: "Video Editing",
    rating: 5,
    review:
      "The highlight video captured every special moment. Beautiful colour grading, clear audio, and delivered on time for our anniversary.",
    createdAt: "November 9, 2025",
    status: "approved",
  },
  {
    id: "seed-05",
    name: "Temiloluwa D.",
    service: "Motion Design",
    rating: 4,
    review:
      "The animated logo sting gave our videos a much more polished opening. Communication was clear and the final result matched the brief.",
    createdAt: "October 3, 2025",
    status: "approved",
  },
  {
    id: "seed-06",
    name: "Mrs. F. Ogunleye",
    service: "Graphic Design",
    rating: 5,
    review:
      "Beautiful posters and flyers that people actually stopped to read. Everything was delivered quickly and with great attention to detail.",
    createdAt: "September 18, 2025",
    status: "approved",
  },
];
