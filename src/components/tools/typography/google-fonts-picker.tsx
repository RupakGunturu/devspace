import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

const googleFonts = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Source Sans Pro", "Nunito", "Raleway", "PT Sans", "Work Sans",
  "Quicksand", "Rubik", "Karla", "Cabin", "Josefin Sans", "Varela Round",
  "Muli", "Barlow", "Manrope",
];

export default function GoogleFontsPicker() {
  const [preview, setPreview] = useState("The quick brown fox");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ToolLayout id="google-fonts-picker">
      <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Preview Text</label><input value={preview} onChange={(e) => setPreview(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" /></div>
      <div className="space-y-2">
        {googleFonts.map((font) => (
          <div key={font} className={`p-3 border rounded-sm cursor-pointer transition-all ${selected === font ? "border-yellow bg-yellow/5" : "border-border hover:border-yellow/50"}`} onClick={() => setSelected(font)}>
            <p style={{ fontFamily: font }} className="text-lg text-foreground">{preview}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{font}</p>
          </div>
        ))}
      </div>
      {selected && <div className="p-3 bg-paper-dim/50 border border-border rounded-sm"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Import</span><p className="font-mono text-xs text-foreground mt-1 break-all">{`<link href="https://fonts.googleapis.com/css2?family=${selected.replace(/ /g, "+")}&display=swap" rel="stylesheet">`}</p></div>}
    </ToolLayout>
  );
}
