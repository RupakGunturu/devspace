import { useRef, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { toast } from "@/components/ui/toaster";
import { UploadCloud, ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { motion } from "motion/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

export default function ImageManager() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await adminApi.uploadImage(file);
      setUploaded((prev) => [...prev, res.image]);
      toast.success(`Uploaded: ${res.image}`);
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h1 className="font-display text-2xl font-extrabold text-foreground">Images</h1>
        <p className="text-sm text-muted">
          Upload images stored at <span className="font-mono text-yellow">/content/images/</span>.
          Use the returned path in markdown or as a hero image.
        </p>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line p-10 text-center transition-colors hover:border-yellow"
      >
        <UploadCloud className="mb-2 h-10 w-10 text-muted" />
        <p className="font-display font-bold text-foreground">
          {uploading ? "Uploading..." : "Drop an image here or click to browse"}
        </p>
        <p className="text-sm text-muted">PNG, JPG, WebP, GIF, SVG, AVIF · max 5MB</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            e.target.value = "";
          }}
        />
      </div>

      {uploaded.length > 0 && (
        <div>
          <h2 className="mb-2 font-display text-base font-bold text-foreground">
            Uploaded this session
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {uploaded.map((path, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="overflow-hidden rounded-lg border border-line bg-card"
              >
                <img
                  src={`${API_URL}${path}`}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <div className="p-2">
                  <p className="truncate font-mono text-[11px] text-muted">{path}</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(path);
                      toast.success("Path copied!");
                    }}
                    className="mt-1 rounded-sm bg-paper-dim px-2 py-0.5 font-mono text-[10px] text-foreground hover:text-yellow"
                  >
                    Copy path
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {uploaded.length === 0 && (
        <EmptyState
          icon={<ImageIcon className="h-8 w-8" />}
          title="No images uploaded yet."
          description="Upload an image to get started."
        />
      )}
    </motion.div>
  );
}
