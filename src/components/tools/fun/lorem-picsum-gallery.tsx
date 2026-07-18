import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function LoremPicsumGallery() {
  const [images, setImages] = useState<number[]>([]);

  const generate = () => setImages(Array.from({ length: 12 }, (_, i) => i + 1));

  return (
    <ToolLayout id="lorem-picsum-gallery">
      <ToolButton onClick={generate}>Load Images</ToolButton>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((id) => (
          <img key={id} src={`https://picsum.photos/seed/${id}/400/300`} alt={`Placeholder ${id}`} className="w-full h-40 object-cover rounded-sm border border-border" loading="lazy" />
        ))}
      </div>
    </ToolLayout>
  );
}
