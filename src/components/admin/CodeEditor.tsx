import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  height = "360px",
  readOnly = false,
}: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[javascript({ typescript: true, jsx: true })]}
        onChange={onChange}
        placeholder={placeholder}
        editable={!readOnly}
        readOnly={readOnly}
        className="text-[13px]"
      />
    </div>
  );
}
