import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function GitCommandExplainer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const commands: Record<string, string> = {
    "git init": "Creates a new empty Git repository in the current directory. This initializes a .git folder with all the necessary repository files.",
    "git clone": "Creates a copy of a remote repository on your local machine. Downloads all files, branches, and commit history.",
    "git add": "Stages changes for the next commit. 'git add .' stages all changes, 'git add <file>' stages a specific file.",
    "git commit": "Records staged changes to the repository. Each commit has a unique hash and a message describing the changes.",
    "git push": "Uploads local commits to a remote repository. 'git push origin main' pushes the main branch to the origin remote.",
    "git pull": "Fetches changes from the remote repository and merges them into your current branch. Combines fetch + merge.",
    "git fetch": "Downloads changes from the remote repository but doesn't merge them. Use 'git merge' afterward to integrate.",
    "git branch": "Lists, creates, or deletes branches. 'git branch <name>' creates, 'git branch -d <name>' deletes.",
    "git checkout": "Switches branches or restores working tree files. 'git checkout -b <name>' creates and switches to a new branch.",
    "git merge": "Combines changes from one branch into the current branch. Creates a merge commit if there are differences.",
    "git rebase": "Reapplies commits on top of another base tip. Creates a linear history by moving your branch to the tip of another.",
    "git stash": "Temporarily saves uncommitted changes so you can work on something else. 'git stash pop' restores them.",
    "git reset": "Undoes changes. '--soft' undoes commit but keeps changes staged, '--mixed' unstages, '--hard' discards changes.",
    "git revert": "Creates a new commit that undoes the changes from a previous commit. Safe for shared branches.",
    "git log": "Shows the commit history. Use '--oneline' for compact view, '--graph' for visual branch graph.",
    "git diff": "Shows differences between commits, branches, or working directory. No args = unstaged changes.",
    "git remote": "Manages remote connections. 'git remote add origin <url>' adds a remote, 'git remote -v' lists them.",
    "git tag": "Creates a named reference to a specific commit. Used for release versions like v1.0.0.",
    "git cherry-pick": "Applies a specific commit from one branch to another. Useful for hotfixes.",
    "git reflog": "Shows a log of all reference updates. Useful for recovering lost commits.",
  };

  const explain = () => {
    const trimmed = input.trim().toLowerCase();
    let found = false;
    for (const [cmd, desc] of Object.entries(commands)) {
      if (trimmed.startsWith(cmd)) {
        setOutput(`${cmd}\n\n${desc}`);
        found = true;
        break;
      }
    }
    if (!found) {
      setOutput(`No explanation found for: "${input}"\n\nTry commands like: git init, git commit -m "msg", git rebase, etc.`);
    }
  };

  return (
    <ToolLayout id="git-command-explainer">
      <ToolInput value={input} onChange={setInput} placeholder='e.g. git rebase, git stash pop, git cherry-pick abc123' label="Git Command" rows={2} />
      <ToolButton onClick={explain}>Explain Command</ToolButton>
      <ToolOutput value={output} label="Explanation" />
    </ToolLayout>
  );
}
