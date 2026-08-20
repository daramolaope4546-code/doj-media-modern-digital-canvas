/**
 * Project store backed by Supabase when configured.
 * Falls back to an empty array when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * are not set, allowing the static projects in src/data/site.ts to serve as seed data.
 */

import { getSupabase, type ProjectRow } from "@/lib/supabase";

/* ── Public type ───────────────────────────────────────────── */

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string | null;
  gallery: string[];
  videoUrl: string | null;
  projectUrl: string | null;
  tools: string[];
  year: number | null;
  featured: boolean;
  published: boolean;
  hue: number;
  alt: string;
  services: string[];
  approach: string;
  outcome: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = {
  title: string;
  category: string;
  description: string;
  coverImage?: string | null;
  gallery?: string[];
  videoUrl?: string | null;
  projectUrl?: string | null;
  tools?: string[];
  year?: number | null;
  featured?: boolean;
  published?: boolean;
  hue?: number;
  alt?: string;
  services?: string[];
  approach?: string;
  outcome?: string;
};

const BUCKET = "project-media";

/* ── Row → Project mapping ─────────────────────────────────── */

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    coverImage: row.cover_image,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    videoUrl: row.video_url,
    projectUrl: row.project_url,
    tools: Array.isArray(row.tools) ? row.tools : [],
    year: row.year,
    featured: row.featured,
    published: row.published,
    hue: row.hue,
    alt: row.alt,
    services: Array.isArray(row.services) ? row.services : [],
    approach: row.approach,
    outcome: row.outcome,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ── Slug generation ───────────────────────────────────────── */

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/* ── Public API ────────────────────────────────────────────── */

/** Fetch published projects for the public portfolio. */
export async function getPublicProjects(): Promise<Project[]> {
  const sb = getSupabase();
  if (!sb) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("projects") as any;
  try {
    const { data, error } = await qb
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as ProjectRow[]).map(rowToProject);
  } catch {
    return [];
  }
}

/** Fetch all projects (admin only — requires authenticated session). */
export async function getAllProjects(): Promise<Project[]> {
  const sb = getSupabase();
  if (!sb) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("projects") as any;
  try {
    const { data, error } = await qb
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as ProjectRow[]).map(rowToProject);
  } catch {
    return [];
  }
}

/** Fetch a single project by slug. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const sb = getSupabase();
  if (!sb) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("projects") as any;
  try {
    const { data, error } = await qb
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) return null;
    return rowToProject(data as ProjectRow);
  } catch {
    return null;
  }
}

/** Create a new project. Returns the created project or null on failure. */
export async function createProject(input: ProjectInput): Promise<Project | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const slug = generateSlug(input.title);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("projects") as any;
  try {
    const { data, error } = await qb
      .insert({
        title: input.title,
        slug,
        category: input.category,
        description: input.description,
        cover_image: input.coverImage ?? null,
        gallery: input.gallery ?? [],
        video_url: input.videoUrl ?? null,
        project_url: input.projectUrl ?? null,
        tools: input.tools ?? [],
        year: input.year ?? null,
        featured: input.featured ?? false,
        published: input.published ?? false,
        hue: input.hue ?? 200,
        alt: input.alt ?? "",
        services: input.services ?? [],
        approach: input.approach ?? "",
        outcome: input.outcome ?? "",
      })
      .select()
      .single();
    if (error || !data) return null;
    return rowToProject(data as ProjectRow);
  } catch {
    return null;
  }
}

/** Update an existing project. Returns the updated project or null on failure. */
export async function updateProject(
  id: string,
  input: Partial<ProjectInput>,
): Promise<Project | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const update: Record<string, unknown> = {};
  if (input.title !== undefined) {
    update.title = input.title;
    update.slug = generateSlug(input.title);
  }
  if (input.category !== undefined) update.category = input.category;
  if (input.description !== undefined) update.description = input.description;
  if (input.coverImage !== undefined) update.cover_image = input.coverImage;
  if (input.gallery !== undefined) update.gallery = input.gallery;
  if (input.videoUrl !== undefined) update.video_url = input.videoUrl;
  if (input.projectUrl !== undefined) update.project_url = input.projectUrl;
  if (input.tools !== undefined) update.tools = input.tools;
  if (input.year !== undefined) update.year = input.year;
  if (input.featured !== undefined) update.featured = input.featured;
  if (input.published !== undefined) update.published = input.published;
  if (input.hue !== undefined) update.hue = input.hue;
  if (input.alt !== undefined) update.alt = input.alt;
  if (input.services !== undefined) update.services = input.services;
  if (input.approach !== undefined) update.approach = input.approach;
  if (input.outcome !== undefined) update.outcome = input.outcome;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qb = sb.from("projects") as any;
  try {
    const { data, error } = await qb
      .update(update)
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return null;
    return rowToProject(data as ProjectRow);
  } catch {
    return null;
  }
}

/** Delete a project and its associated storage files. */
export async function deleteProject(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    // Fetch the project to find storage files before deleting the row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchQb = sb.from("projects") as any;
    const { data: project } = await fetchQb.select("cover_image,gallery").eq("id", id).single();

    // Delete storage files
    if (project) {
      const paths: string[] = [];
      if (project.cover_image) {
        const p = extractStoragePath(project.cover_image);
        if (p) paths.push(p);
      }
      if (Array.isArray(project.gallery)) {
        for (const url of project.gallery) {
          const p = extractStoragePath(url);
          if (p) paths.push(p);
        }
      }
      if (paths.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await sb.storage.from(BUCKET).remove(paths);
      }
    }

    // Delete the row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deleteQb = sb.from("projects") as any;
    const { error } = await deleteQb.delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/* ── Storage helpers ───────────────────────────────────────── */

/** Upload a file to Supabase Storage under a project's folder. Returns the public URL. */
export async function uploadProjectMedia(
  file: File,
  projectId: string,
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  try {
    const { error } = await sb.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) return null;
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl ?? null;
  } catch {
    return null;
  }
}

/** Delete files from Supabase Storage. */
export async function deleteProjectMedia(paths: string[]): Promise<void> {
  const sb = getSupabase();
  if (!sb || paths.length === 0) return;
  try {
    await sb.storage.from(BUCKET).remove(paths);
  } catch {
    /* best effort */
  }
}

/* ── Internal helpers ──────────────────────────────────────── */

function extractStoragePath(url: string): string | null {
  // Extract the path portion after the bucket name from a Supabase Storage URL.
  // URL format: https://<project>.supabase.co/storage/v1/object/public/project-media/<path>
  const marker = `${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
