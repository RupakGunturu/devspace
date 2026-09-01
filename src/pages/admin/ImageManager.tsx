import { useRef, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { UploadCloud } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

export default function ImageManager() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const res = await adminApi.uploadImage(file);
      setUploaded((prev) => [...prev, res.image]);
      setMessage(`Uploaded: ${res.image}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-foreground">Images</h1>
        <p className="text-sm text-muted">
          Upload images stored at <span className="font-mono text-yellow">/content/images/</span>.
          Use the returned path in markdown or as a hero image.
        </p>
      </div>

      {error && (
        <p className="rounded-sm bg-coral/10 p-2 font-mono text-[12px] text-coral">{error}</p>
      )}
      {message && (
        <p className="rounded-sm bg-yellow/20 p-2 font-mono text-[12px] text-ink">{message}</p>
      )}

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
            {uploaded.map((path) => (
              <div key={path} className="overflow-hidden rounded-lg border border-line bg-card">
                <img
                  src={`${API_URL}${path}`}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <div className="p-2">
                  <p className="truncate font-mono text-[11px] text-muted">{path}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(path)}
                    className="mt-1 rounded-sm bg-paper-dim px-2 py-0.5 font-mono text-[10px] text-foreground hover:text-yellow"
                  >
                    Copy path
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
