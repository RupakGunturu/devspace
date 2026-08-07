import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const DURATIONS = ["1", "2", "3", "5", "10"] as const;

export function NdaTemplateGenerator() {
  const [disclosing, setDisclosing] = useState("");
  const [receiving, setReceiving] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("2");
  const [state, setState] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const template = useMemo(() => {
    if (!disclosing.trim() || !receiving.trim()) return null;
    const d = parseInt(duration) || 2;
    const stateName = state.trim() || "the State of [Jurisdiction]";
    const purposeText = purpose.trim() || "the evaluation of a potential business relationship";

    return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of __________, 20____, by and between:

Disclosing Party: ${disclosing}
Receiving Party: ${receiving}

RECITALS

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to ${purposeText}; and

WHEREAS, the Receiving Party desires to receive and the Disclosing Party desires to disclose certain Confidential Information as defined herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public information, in any form or medium, disclosed by the Disclosing Party to the Receiving Party, including but not limited to: trade secrets, business plans, financial data, customer lists, vendor information, product designs, technical specifications, software, algorithms, processes, methods, inventions, patent applications, marketing strategies, and any other proprietary information, whether oral, written, electronic, or in any other form.

2. OBLIGATIONS OF THE RECEIVING PARTY

The Receiving Party agrees to:

(a) Hold all Confidential Information in strict confidence;
(b) Not disclose Confidential Information to any third party without prior written consent of the Disclosing Party;
(c) Use the Confidential Information solely for the purpose of ${purposeText};
(d) Limit access to Confidential Information to those employees, agents, or advisors who have a need to know and are bound by confidentiality obligations at least as restrictive as those contained herein;
(e) Take all reasonable measures to protect the secrecy of and avoid disclosure or unauthorized use of Confidential Information.

3. EXCLUSIONS FROM CONFIDENTIAL INFORMATION

Confidential Information shall not include information that:

(a) Is or becomes publicly available through no fault of the Receiving Party;
(b) Was known to the Receiving Party prior to disclosure, as documented by written records;
(c) Is independently developed by the Receiving Party without use of or reference to Confidential Information;
(d) Is lawfully received from a third party without restriction on disclosure.

4. REMEDIES

The Receiving Party acknowledges that any unauthorized disclosure or use of Confidential Information would cause irreparable harm to the Disclosing Party for which monetary damages would be an inadequate remedy. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief, in addition to any other remedies available at law or in equity, without the necessity of proving actual damages or posting any bond.

5. TERM AND TERMINATION

This Agreement shall remain in effect for a period of ${d} year${d > 1 ? "s" : ""} from the date of first disclosure. The obligations of confidentiality shall survive termination or expiration of this Agreement for a period of ${d} year${d > 1 ? "s" : ""}.

6. RETURN OF MATERIALS

Upon termination of this Agreement, or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all documents, materials, and copies thereof containing Confidential Information.

7. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of ${stateName}, without regard to its conflict of laws principles.

8. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, and understandings. This Agreement may only be modified by a written instrument signed by both Parties.

DISCLOSING PARTY: ____________________________
Date: ____________________________

RECEIVING PARTY: ____________________________
Date: ____________________________`;
  }, [disclosing, receiving, purpose, duration, state]);

  const handleGenerate = () => {
    if (disclosing.trim() && receiving.trim()) setGenerated(true);
  };

  const fields = [
    { label: "Disclosing Party", value: disclosing, set: setDisclosing, placeholder: "e.g. Acme Corp" },
    { label: "Receiving Party", value: receiving, set: setReceiving, placeholder: "e.g. John Smith" },
    { label: "Purpose", value: purpose, set: setPurpose, placeholder: "e.g. evaluating a partnership" },
    { label: "Governing State", value: state, set: setState, placeholder: "e.g. Delaware" },
  ];

  return (
    <ToolLayout id="nda-template-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              style={{ borderColor: value ? color : undefined }}
            />
          </div>
        ))}
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Duration (years)</span>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className="rounded-md border-2 px-4 py-2 font-mono text-sm transition-all"
              style={duration === d ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {d} yr{d !== "1" ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <div>
        <ToolButton onClick={handleGenerate} disabled={!disclosing.trim() || !receiving.trim()}>
          Generate NDA Template
        </ToolButton>
      </div>

      {generated && template && (
        <div className="space-y-4">
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">NDA Template</span>
              <CopyButton text={template} />
            </div>
            <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {template}
            </pre>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {["Definition", "Obligations", "Exclusions", "Remedies", "Term"].map((section) => (
              <div key={section} className="rounded-md border-2 border-line bg-input-bg p-2 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{section}</div>
                <div className="mt-1 font-mono text-lg font-bold" style={{ color }}>
                  <svg className="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in party details and click Generate to create your NDA template
        </div>
      )}
    </ToolLayout>
  );
}
