import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export interface ReviewRow {
  id: string;
  name: string;
  email: string | null;
  service: string | null;
  rating: number;
  review: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  cover_image: string | null;
  gallery: string[];
  video_url: string | null;
  project_url: string | null;
  tools: string[];
  year: number | null;
  featured: boolean;
  published: boolean;
  hue: number;
  alt: string;
  services: string[];
  approach: string;
  outcome: string;
  created_at: string;
  updated_at: string;
}

export type SupabaseClient = ReturnType<typeof createClient>;

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
