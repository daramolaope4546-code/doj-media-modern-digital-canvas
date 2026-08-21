import { useEffect, useState } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/lib/projects-store";
import { getAllProjects, deleteProject } from "@/lib/projects-store";
import { cn } from "@/lib/utils";

export function ProjectList({
  onEdit,
  onAdd,
}: {
  onEdit: (project: Project) => void;
  onAdd: () => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const all = await getAllProjects();
    setProjects(all);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteProject(deleteId);
    setDeleteId(null);
    if (ok) {
      toast.success("Project deleted.");
      await load();
    } else {
      toast.error("Failed to delete project.");
    }
  };

  const filtered = search.trim()
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      )
    : projects;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          Projects
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-wine px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-wine/25 transition hover:bg-[#961e3c]"
        >
          <Plus size={14} aria-hidden="true" /> Add Project
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-wine" aria-hidden="true" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {search ? "No projects match your search." : "No projects yet. Add your first project."}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.alt || project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, hsl(${project.hue} 45% 25%), hsl(${project.hue} 60% 45%))`,
                    }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      project.published ? "text-emerald-600" : "text-amber-600",
                    )}
                  >
                    {project.published ? (
                      <Eye size={10} aria-hidden="true" />
                    ) : (
                      <EyeOff size={10} aria-hidden="true" />
                    )}
                    {project.published ? "Published" : "Draft"}
                  </span>
                  {project.year && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{project.year}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(project)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-wine/50 hover:text-wine"
                  aria-label={`Edit ${project.title}`}
                >
                  <Pencil size={12} aria-hidden="true" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(project.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
                  aria-label={`Delete ${project.title}`}
                >
                  <Trash2 size={12} aria-hidden="true" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold text-foreground">
              Delete project?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently remove the project and its uploaded media.
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-full border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-destructive/50 bg-destructive px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
