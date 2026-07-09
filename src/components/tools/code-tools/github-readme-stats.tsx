import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function GithubReadmeStats() {
  const [username, setUsername] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`## GitHub Stats\n\n![${username}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical)\n\n![${username}'s top languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=radical)\n\n## Streak Stats\n\n![${username}'s streak](https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=radical)`);
  };

  return (
    <ToolLayout id="github-readme-stats">
      <ToolInput value={username} onChange={setUsername} placeholder="octocat" label="GitHub Username" rows={1} />
      <ToolButton onClick={generate}>Generate Stats</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
