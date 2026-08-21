import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUploader({
  label,
  accept = "image/*",
  multiple = false,
  onUpload,
  onRemove,
  preview,
  disabled,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  onRemove?: () => void;
  preview?: string | null;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onUpload(Array.from(files));
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles],
  );

  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      {preview ? (
        <div className="relative mt-2 overflow-hidden rounded-xl border border-border">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
          {onRemove && !disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/70"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition",
            dragging
              ? "border-wine bg-wine/5"
              : "border-border hover:border-wine/50",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <ImagePlus
            size={24}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            Click or drag to upload
          </p>
          <p className="text-xs text-muted-foreground/70">PNG, JPG, WebP</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
