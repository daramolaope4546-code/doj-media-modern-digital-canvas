import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { projectCategories } from "@/data/site";
import type { Project, ProjectInput } from "@/lib/projects-store";
import {
  createProject,
  updateProject,
  uploadProjectMedia,
} from "@/lib/projects-store";
import { cn } from "@/lib/utils";

const CATEGORIES = projectCategories.filter((c) => c !== "All");

export function ProjectForm({
  project,
  onBack,
  onSaved,
}: {
  project?: Project;
  onBack: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [category, setCategory] = useState(project?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(project?.description ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    project?.coverImage ?? null,
  );
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl ?? "");
  const [projectUrl, setProjectUrl] = useState(project?.projectUrl ?? "");
  const [tools, setTools] = useState<string[]>(project?.tools ?? []);
  const [toolInput, setToolInput] = useState("");
  const [services, setServices] = useState<string[]>(project?.services ?? []);
  const [serviceInput, setServiceInput] = useState("");
  const [year, setYear] = useState(project?.year?.toString() ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? false);
  const [hue, setHue] = useState(project?.hue ?? 200);
  const [alt, setAlt] = useState(project?.alt ?? "");
  const [approach, setApproach] = useState(project?.approach ?? "");
  const [outcome, setOutcome] = useState(project?.outcome ?? "");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const coverInputRef = useRef<HTMLInputElement>(null);

  /* ── Upload cover image ─────────────────────────────────── */
  const handleCoverUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress("Uploading cover image...");
    try {
      const projectId = project?.id ?? "temp-" + Date.now();
      const url = await uploadProjectMedia(file, projectId);
      if (url) {
        setCoverImage(url);
        toast.success("Cover image uploaded.");
      } else {
        toast.error("Failed to upload image.");
      }
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  /* ── Upload gallery images ──────────────────────────────── */
  const handleGalleryUpload = async (files: File[]) => {
    const projectId = project?.id ?? "temp-" + Date.now();
    setUploading(true);
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`);
      const url = await uploadProjectMedia(files[i], projectId);
      if (url) newUrls.push(url);
    }
    if (newUrls.length > 0) {
      setGallery((prev) => [...prev, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded.`);
    }
    if (newUrls.length < files.length) {
      toast.error("Some uploads failed.");
    }
    setUploading(false);
    setUploadProgress("");
  };

  /* ── Tag helpers ────────────────────────────────────────── */
  const addTag = (
    input: string,
    setTags: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: (v: string) => void,
  ) => {
    const tag = input.trim();
    if (tag && !tools.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setInput("");
  };

  const removeTag = (
    idx: number,
    setTags: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ── Save ───────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    setSaving(true);
    try {
      const input: ProjectInput = {
        title: title.trim(),
        category,
        description: description.trim(),
        coverImage: coverImage || null,
        gallery,
        videoUrl: videoUrl.trim() || null,
        projectUrl: projectUrl.trim() || null,
        tools,
        year: year ? parseInt(year, 10) : null,
        featured,
        published,
        hue,
        alt: alt.trim(),
        services,
        approach: approach.trim(),
        outcome: outcome.trim(),
      };

      let result: Project | null;
      if (isEdit && project) {
        result = await updateProject(project.id, input);
      } else {
        result = await createProject(input);
      }

      if (result) {
        toast.success(isEdit ? "Project updated." : "Project created.");
        onSaved();
      } else {
        toast.error("Failed to save project.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-wine/50 hover:text-wine"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back
        </button>
        <h2 className="font-display text-xl font-bold text-foreground">
          {isEdit ? "Edit Project" : "Add Project"}
        </h2>
      </div>

      <div className="mt-6 space-y-6 rounded-3xl border border-border bg-card p-6">
        {/* Title */}
        <Field label="Title" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className={inputClass()}
          />
        </Field>

        {/* Category */}
        <Field label="Category" required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(inputClass(), "appearance-none bg-background")}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        {/* Description */}
        <Field label="Description" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the project..."
            rows={4}
            className={cn(inputClass(), "resize-none")}
          />
        </Field>

        {/* Cover Image */}
        <ImageUploader
          label="Cover Image"
          onUpload={handleCoverUpload}
          onRemove={() => setCoverImage(null)}
          preview={coverImage}
          disabled={uploading}
        />

        {/* Gallery */}
        <div>
          <ImageUploader
            label="Gallery Images"
            multiple
            onUpload={handleGalleryUpload}
            disabled={uploading}
          />
          {uploading && uploadProgress && (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin" aria-hidden="true" />
              {uploadProgress}
            </p>
          )}
          {gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {gallery.map((url, idx) => (
                <div key={url} className="group relative overflow-hidden rounded-xl">
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="h-24 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setGallery((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video URL */}
        <Field label="Video URL" optional>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className={inputClass()}
          />
        </Field>

        {/* Project URL */}
        <Field label="Project / Client URL" optional>
          <input
            type="url"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass()}
          />
        </Field>

        {/* Year */}
        <Field label="Year" optional>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            min={1970}
            max={2099}
            className={inputClass()}
          />
        </Field>

        {/* Tools */}
        <Field label="Tools Used" optional>
          <TagInput
            tags={tools}
            input={toolInput}
            onInputChange={setToolInput}
            onAdd={() => addTag(toolInput, setTools, setToolInput)}
            onRemove={(i) => removeTag(i, setTools)}
          />
        </Field>

        {/* Services */}
        <Field label="Services Provided" optional>
          <TagInput
            tags={services}
            input={serviceInput}
            onInputChange={setServiceInput}
            onAdd={() => addTag(serviceInput, setServices, setServiceInput)}
            onRemove={(i) => removeTag(i, setServices)}
          />
        </Field>

        {/* Approach */}
        <Field label="Design Approach" optional>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="Describe the approach taken..."
            rows={3}
            className={cn(inputClass(), "resize-none")}
          />
        </Field>

        {/* Outcome */}
        <Field label="Project Outcome" optional>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Describe the results..."
            rows={3}
            className={cn(inputClass(), "resize-none")}
          />
        </Field>

        {/* Alt text */}
        <Field label="Cover Image Alt Text" optional>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the cover image for accessibility"
            className={inputClass()}
          />
        </Field>

        {/* Hue */}
        <Field label="Placeholder Hue" optional>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="flex-1 accent-wine"
            />
            <span className="w-12 text-right text-xs text-muted-foreground">
              {hue}
            </span>
            <div
              className="h-8 w-8 rounded-lg"
              style={{
                background: `linear-gradient(135deg, hsl(${hue} 45% 25%), hsl(${hue} 60% 45%))`,
              }}
            />
          </div>
        </Field>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-wine"
            />
            <span className="text-sm font-medium text-foreground">
              Featured project
            </span>
          </label>
          <label className="inline-flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-wine"
            />
            <span className="text-sm font-medium text-foreground">
              Published
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 border-t border-border/70 pt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="rounded-full border border-border px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition hover:bg-card hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-full bg-wine px-7 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-wine/25 transition hover:bg-[#961e3c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving && (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            )}
            {saving
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Publish Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-wine">*</span>}
        {optional && (
          <span className="font-normal normal-case tracking-normal text-muted-foreground/70">
            {" "}
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function inputClass() {
  return "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20";
}

function TagInput({
  tags,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: {
  tags: string[];
  input: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-wine/10 px-3 py-1 text-xs font-medium text-wine"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="ml-0.5 rounded-full p-0.5 transition hover:bg-wine/20"
                aria-label={`Remove ${tag}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="Type and press Enter to add"
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-wine focus:ring-2 focus:ring-wine/20"
        />
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-wine/50 hover:text-wine"
        >
          <Plus size={12} aria-hidden="true" /> Add
        </button>
      </div>
    </div>
  );
}
