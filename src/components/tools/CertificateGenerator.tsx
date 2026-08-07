import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { AntdDatePicker } from "@/components/ui/antd-date-picker";

const TEXT_INPUTS = [
  { key: "recipient", label: "Recipient Name", placeholder: "Jane Smith" },
  { key: "achievement", label: "Course / Achievement", placeholder: "Advanced Web Development" },
  { key: "instructor", label: "Instructor Name", placeholder: "Prof. John Doe" },
  { key: "organization", label: "Organization", placeholder: "DevSpace Academy" },
];

export function CertificateGenerator() {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(TEXT_INPUTS.map((f) => [f.key, ""])),
  );
  const [certDate, setCertDate] = useState<Date | null>(new Date());
  const { color } = useToolAccent();

  const set = (key: string, val: string) => setInputs((prev) => ({ ...prev, [key]: val }));

  const preview = useMemo(() => {
    const org = inputs.organization.trim() || "DevSpace Academy";
    const recipient = inputs.recipient.trim() || "[Recipient Name]";
    const achievement = inputs.achievement.trim() || "[Course / Achievement]";
    const instructor = inputs.instructor.trim() || "[Instructor Name]";
    const date = certDate
      ? certDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "[Date]";

    return { org, recipient, achievement, instructor, date };
  }, [inputs, certDate]);

  const handlePrint = () => {
    window.print();
  };

  const hasContent = inputs.recipient.trim() && inputs.achievement.trim();

  return (
    <ToolLayout id="certificate-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TEXT_INPUTS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {label}
            </span>
            <input
              type="text"
              value={inputs[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              style={{ borderColor: inputs[key] ? color : undefined }}
            />
          </div>
        ))}
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Date
          </span>
          <AntdDatePicker value={certDate} onChange={setCertDate} placeholder="Select date" />
        </div>
      </div>

      <div>
        <ToolButton onClick={handlePrint} disabled={!hasContent}>
          Print Certificate
        </ToolButton>
      </div>

      {hasContent && (
        <div className="space-y-4">
          <div
            className="certificate-preview relative overflow-hidden rounded-lg border-4 p-12 text-center"
            style={{ borderColor: color }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 20px)`,
              }}
            />

            <div className="relative z-10">
              <div
                className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.3em]"
                style={{ color }}
              >
                Certificate of Completion
              </div>

              <div className="mb-4 h-px w-32 mx-auto" style={{ backgroundColor: color }} />

              <div className="mb-2 font-mono text-xs text-muted">This is to certify that</div>

              <div className="mb-4 font-display text-3xl font-extrabold" style={{ color }}>
                {preview.recipient}
              </div>

              <div className="mb-2 font-mono text-xs text-muted">has successfully completed</div>

              <div className="mb-6 font-display text-xl font-bold text-foreground">
                {preview.achievement}
              </div>

              <div className="mb-6 h-px w-48 mx-auto" style={{ backgroundColor: color }} />

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="mb-1 font-mono text-xs text-muted">Date</div>
                  <div className="font-mono text-sm text-input-text">{preview.date}</div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-xs text-muted">Instructor</div>
                  <div className="font-mono text-sm text-input-text">{preview.instructor}</div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-xs text-muted">Organization</div>
                  <div className="font-mono text-sm text-input-text">{preview.org}</div>
                </div>
              </div>

              <div className="mt-8">
                <div className="inline-block border-b-2 px-8" style={{ borderColor: color }}>
                  <span className="font-display text-lg italic text-foreground">
                    {preview.instructor}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-muted">Instructor Signature</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasContent && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in the details above to preview your certificate
        </div>
      )}
    </ToolLayout>
  );
}
