/**
 * ============================================================
 * EDIT THIS FILE TO UPDATE YOUR PERSONAL PORTFOLIO CONTENT.
 * Everything below (profile, services, projects, skills,
 * experience, contact details) drives the whole website.
 * ============================================================
 */

export const profile = {
  brand: "DOJ MEDIA",
  name: "[YOUR FULL NAME]",
  title: "Creative Digital Media & Production Specialist",
  tagline: "Create. Connect. Impact.",
  intro:
    "I design, produce, and broadcast creative work for brands, creators, churches, and organizations — combining graphics design, web design, video editing, motion design, and professional live streaming under one roof.",
  bio: [
    "I am a creative digital media professional working under the DOJ MEDIA brand. My work spans visual design, digital production, and live broadcast — helping clients present their message clearly and beautifully across every screen.",
    "I enjoy taking an idea from a rough brief to a finished, polished deliverable: a brand identity, a responsive website, an edited film, a motion graphic, or a fully directed multi-camera live stream.",
  ],
  education: "[YOUR DEGREE / PROGRAMME], [YOUR SCHOOL]",
  location: "[YOUR CITY, NIGERIA]",
  interests: [
    "Creative direction and brand storytelling",
    "Video post-production and motion design",
    "Broadcast and live event production",
    "Web design and digital experiences",
  ],
  goals: [
    "Grow DOJ MEDIA into a full-service creative and production studio",
    "Deliver consistently premium work for clients across Nigeria and beyond",
    "Keep expanding technical skills in motion design and live production",
  ],
  strengths: [
    "Strong eye for detail and composition",
    "Reliable, deadline-driven delivery",
    "Clear communication with clients",
    "Calm under pressure during live events",
    "Continuous learner",
    "Collaborative team player",
  ],
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Me" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
] as const;

export type ServiceIcon =
  | "palette" | "monitor" | "video" | "sparkles" | "radio" | "camera" | "share";

export const services: {
  icon: ServiceIcon; title: string; desc: string; points: string[];
}[] = [
  {
    icon: "palette",
    title: "Graphics Design",
    desc: "Flyers, posters, banners, brand collateral, and social media creative built for attention.",
    points: ["Brand identity & logos", "Print and digital assets", "Social media graphics"],
  },
  {
    icon: "monitor",
    title: "Web Design",
    desc: "Clean, fast, responsive websites and landing pages that look premium on every device.",
    points: ["Responsive layouts", "Landing pages", "Portfolio & business sites"],
  },
  {
    icon: "video",
    title: "Video Editing",
    desc: "Cinematic edits with colour grading, sound design, subtitles, and clean pacing.",
    points: ["Event & promo videos", "Short-form content", "Colour & audio polish"],
  },
  {
    icon: "sparkles",
    title: "Motion Design",
    desc: "Animated logos, kinetic typography, lower thirds, and explainer animation.",
    points: ["Logo stings", "Kinetic typography", "Broadcast graphics"],
  },
  {
    icon: "radio",
    title: "Live Streaming",
    desc: "Multi-camera live production and multi-platform streaming, directed end to end.",
    points: ["Church & conference streams", "Multi-platform simulcast", "Live graphics"],
  },
  {
    icon: "camera",
    title: "Live Streaming Setup",
    desc: "Studio and gear installation, signal flow design, and workflow configuration.",
    points: ["Equipment consultation", "Studio installation", "Team training"],
  },
  {
    icon: "share",
    title: "Digital Media Services",
    desc: "Content creation, media management, and creative support for ongoing campaigns.",
    points: ["Content planning", "Media management", "Creative consulting"],
  },
];

export const projectCategories = [
  "All",
  "Graphics Design",
  "Web Design",
  "Video Editing",
  "Motion Design",
  "Live Streaming",
] as const;

/** Add new projects here — they appear automatically in the gallery. */
export const projects: {
  title: string;
  category: Exclude<(typeof projectCategories)[number], "All">;
  description: string;
  image?: string;
  link?: string;
  hue: number;
}[] = [
  { title: "Event Poster Series", category: "Graphics Design", description: "A set of bold event posters with a consistent typographic system.", hue: 15 },
  { title: "Brand Identity Kit", category: "Graphics Design", description: "Logo, colour palette, and social templates for a growing brand.", hue: 340 },
  { title: "Business Website", category: "Web Design", description: "Responsive marketing site with a clean, conversion-focused layout.", hue: 220 },
  { title: "Portfolio Landing Page", category: "Web Design", description: "A minimal one-page site built for speed and clarity.", hue: 200 },
  { title: "Event Highlight Film", category: "Video Editing", description: "Cinematic recap edit with colour grading and sound design.", hue: 25 },
  { title: "Short-Form Promo Cuts", category: "Video Editing", description: "Vertical social edits optimised for reach and retention.", hue: 280 },
  { title: "Animated Logo Sting", category: "Motion Design", description: "A short branded animation used across video intros.", hue: 300 },
  { title: "Kinetic Typography Reel", category: "Motion Design", description: "Text-driven motion piece synced to voiceover.", hue: 260 },
  { title: "Sunday Service Broadcast", category: "Live Streaming", description: "Multi-camera live production with live graphics and simulcast.", hue: 15 },
  { title: "Conference Live Stream", category: "Live Streaming", description: "Full-day streaming setup with switching and remote guests.", hue: 190 },
];

export const skills: { name: string; level: number; note: string }[] = [
  { name: "Graphics Design", level: 90, note: "Photoshop, Illustrator, Canva" },
  { name: "Web Design", level: 80, note: "HTML, CSS, responsive layouts, WordPress" },
  { name: "Video Editing", level: 88, note: "Premiere Pro, CapCut" },
  { name: "Motion Design", level: 78, note: "After Effects" },
  { name: "Live Streaming", level: 85, note: "OBS Studio, multi-platform streaming" },
  { name: "Live Streaming Setup", level: 80, note: "Cameras, audio, switchers, signal flow" },
  { name: "Content Creation", level: 85, note: "Concepting, scripting, shooting" },
  { name: "Digital Media", level: 82, note: "Social media, media management" },
];

/** Update your experience, education and certifications here. */
export const experience: {
  group: string;
  items: { role: string; org: string; period: string; desc: string }[];
}[] = [
  {
    group: "Work Experience",
    items: [
      { role: "[YOUR ROLE]", org: "[COMPANY / ORGANISATION]", period: "[YEAR – YEAR]", desc: "[Describe your responsibilities and key achievements here.]" },
    ],
  },
  {
    group: "Freelance Projects",
    items: [
      { role: "Freelance Creative — DOJ MEDIA", org: "Independent", period: "[YEAR – Present]", desc: "Design, video editing, motion graphics, and live streaming for clients across multiple industries." },
    ],
  },
  {
    group: "Internships",
    items: [
      { role: "[INTERN ROLE]", org: "[ORGANISATION]", period: "[YEAR]", desc: "[What you learned and contributed.]" },
    ],
  },
  {
    group: "Volunteer Experience",
    items: [
      { role: "[VOLUNTEER ROLE]", org: "[ORGANISATION]", period: "[YEAR – YEAR]", desc: "[Media, design, or streaming support you provided.]" },
    ],
  },
  {
    group: "Education & Training",
    items: [
      { role: "[YOUR DEGREE / PROGRAMME]", org: "[YOUR SCHOOL]", period: "[YEAR – YEAR]", desc: "[Course focus or notable coursework.]" },
    ],
  },
  {
    group: "Certifications",
    items: [
      { role: "[CERTIFICATION NAME]", org: "[ISSUING BODY]", period: "[YEAR]", desc: "[Short description of the certification.]" },
    ],
  },
];

/** Replace the placeholders below with your real contact details. */
export const contact = {
  phone: "[YOUR PHONE NUMBER]",
  whatsapp: "[YOUR WHATSAPP NUMBER]",
  email: "[YOUR EMAIL]",
  location: "[YOUR CITY, NIGERIA]",
  linkedin: "[YOUR LINKEDIN URL]",
  github: "[YOUR GITHUB URL]",
  instagram: "[YOUR INSTAGRAM URL]",
  facebook: "[YOUR FACEBOOK URL]",
};
