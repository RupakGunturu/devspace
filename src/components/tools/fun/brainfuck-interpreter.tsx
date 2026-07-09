import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BrainfuckInterpreter() {
  const [code, setCode] = useState("++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const run = () => {
    const tape = new Array(30000).fill(0);
    let ptr = 0;
    let ip = 0;
    let out = "";
    let inputIdx = 0;
    const program = code;

    while (ip < program.length && out.length < 10000) {
      switch (program[ip]) {
        case ">": ptr++; break;
        case "<": ptr--; break;
        case "+": tape[ptr] = (tape[ptr] + 1) % 256; break;
        case "-": tape[ptr] = (tape[ptr] - 1 + 256) % 256; break;
        case ".": out += String.fromCharCode(tape[ptr]); break;
        case ",": tape[ptr] = input.charCodeAt(inputIdx++) || 0; break;
        case "[": if (tape[ptr] === 0) { let depth = 1; while (depth > 0 && ++ip < program.length) { if (program[ip] === "[") depth++; if (program[ip] === "]") depth--; } } break;
        case "]": if (tape[ptr] !== 0) { let depth = 1; while (depth > 0 && --ip >= 0) { if (program[ip] === "]") depth++; if (program[ip] === "[") depth--; } } break;
      }
      ip++;
    }
    setOutput(out || "(no output)");
  };

  return (
    <ToolLayout id="brainfuck-interpreter">
      <ToolInput value={code} onChange={setCode} placeholder="Brainfuck code..." label="Code" rows={4} />
      <ToolInput value={input} onChange={setInput} placeholder="Input for , command" label="Input" rows={1} />
      <ToolButton onClick={run}>Run</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
