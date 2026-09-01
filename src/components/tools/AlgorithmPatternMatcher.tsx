import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Pattern {
  name: string;
  keywords: string[];
  description: string;
  whenToUse: string;
  examples: string[];
}

const PATTERNS: Pattern[] = [
  {
    name: "Two Pointer",
    keywords: [
      "two pointer",
      "two pointers",
      "pair",
      "opposite ends",
      "sorted array pair",
      "container with water",
      "two sum sorted",
      "three sum",
      "partition",
      "palindrome check",
    ],
    description:
      "Use two indices moving toward each other (or same direction at different speeds) to scan a linear structure.",
    whenToUse:
      "When you need to find pairs in a sorted array, or compare elements from both ends. Works well when input is sorted or can be sorted.",
    examples: [
      "Two Sum II (Sorted)",
      "Container With Most Water",
      "Valid Palindrome",
      "3Sum",
      "Trapping Rain Water",
    ],
  },
  {
    name: "Sliding Window",
    keywords: [
      "sliding window",
      "window",
      "substring",
      "subarray",
      "contiguous",
      "max sum subarray",
      "longest substring",
      "fixed size",
      "dynamic window",
      "k size",
    ],
    description:
      "Maintain a window [left, right] over the input and expand/shrink it to find optimal subarray/substring.",
    whenToUse:
      "When finding contiguous sequences with a constraint (max sum, longest without repeats, contains all chars). Fixed or variable window size.",
    examples: [
      "Longest Substring Without Repeating",
      "Minimum Window Substring",
      "Maximum Sum Subarray of Size K",
      "Sliding Window Maximum",
      "Permutation in String",
    ],
  },
  {
    name: "Binary Search",
    keywords: [
      "binary search",
      "sorted array",
      "search sorted",
      "find in sorted",
      "upper bound",
      "lower bound",
      "search space",
      "rotated sorted",
      "peak element",
      "division search",
    ],
    description:
      "Divide search space in half each step. Requires sorted order or monotonic predicate.",
    whenToUse:
      "When searching in sorted data, finding boundaries, or when you can define a monotonic function over the answer space.",
    examples: [
      "Search in Rotated Sorted Array",
      "Find Peak Element",
      "Median of Two Sorted Arrays",
      "Capacity To Ship Packages",
      "Koko Eating Bananas",
    ],
  },
  {
    name: "BFS / DFS",
    keywords: [
      "bfs",
      "dfs",
      "breadth",
      "depth",
      "graph",
      "tree",
      "level order",
      "shortest path unweighted",
      "connected components",
      "island",
      "matrix traversal",
      "neighbor",
      "grid",
    ],
    description:
      "BFS explores level by level (queue). DFS goes deep first (stack/recursion). Both traverse graphs/trees.",
    whenToUse:
      "BFS for shortest path in unweighted graphs, level-order traversal. DFS for exhaustive search, cycle detection, topological sort, connected components.",
    examples: [
      "Number of Islands",
      "Binary Tree Level Order Traversal",
      "Course Schedule",
      "Clone Graph",
      "Word Ladder",
    ],
  },
  {
    name: "Dynamic Programming",
    keywords: [
      "dynamic programming",
      "dp",
      "memoization",
      "tabulation",
      "overlapping subproblems",
      "optimal substructure",
      "knapsack",
      "subsequence",
      "edit distance",
      "coin change",
      "fibonacci",
      "state machine",
    ],
    description:
      "Break problem into overlapping subproblems and store results to avoid recomputation.",
    whenToUse:
      "When problem has optimal substructure and overlapping subproblems. Count ways, optimize over decisions, find min/max over combinations.",
    examples: [
      "Climbing Stairs",
      "Coin Change",
      "Longest Common Subsequence",
      "0/1 Knapsack",
      "Edit Distance",
      "House Robber",
    ],
  },
  {
    name: "Backtracking",
    keywords: [
      "backtrack",
      "backtracking",
      "permutation",
      "combination",
      "subset",
      "generate all",
      "n-queens",
      "sudoku",
      "word search",
      "constraint",
      "prune",
      "decision tree",
    ],
    description:
      "Explore all possibilities by building candidates incrementally and undoing choices that fail constraints.",
    whenToUse:
      "When you need to generate all valid configurations, permutations, or subsets with constraints. Prune invalid paths early.",
    examples: [
      "N-Queens",
      "Sudoku Solver",
      "Combination Sum",
      "Word Search",
      "Palindrome Partitioning",
    ],
  },
  {
    name: "Greedy",
    keywords: [
      "greedy",
      "interval",
      "scheduling",
      "minimum cost",
      "maximum profit",
      "huffman",
      "activity selection",
      "jump game",
      "gas station",
      "task scheduler",
      "local optimum",
    ],
    description:
      "Make the locally optimal choice at each step hoping for a global optimum. No revisiting.",
    whenToUse:
      "When a greedy choice property holds: local optimum leads to global optimum. Often with sorting by a key. Verify with exchange argument.",
    examples: [
      "Jump Game",
      "Task Scheduler",
      "Merge Intervals",
      "Best Time to Buy/Sell Stock II",
      "Partition Labels",
    ],
  },
  {
    name: "Union Find",
    keywords: [
      "union find",
      "disjoint set",
      "connected components",
      "merge sets",
      "same group",
      "redundant connection",
      "union by rank",
      "path compression",
      "equivalence relation",
    ],
    description:
      "Track and merge disjoint sets efficiently. Find which component an element belongs to in near O(1).",
    whenToUse:
      "When you need to dynamically merge groups and query connectivity. Useful for graph problems with incremental edge addition.",
    examples: [
      "Redundant Connection",
      "Accounts Merge",
      "Number of Provinces",
      "Detect Cycles in Graphs",
      "Smallest String With Swaps",
    ],
  },
  {
    name: "Heap / Priority Queue",
    keywords: [
      "heap",
      "priority queue",
      "top k",
      "kth largest",
      "kth smallest",
      "median",
      "merge k sorted",
      "schedule by priority",
      "min heap",
      "max heap",
      "priority",
    ],
    description:
      "Maintain a data structure that efficiently provides the min or max element. O(log n) insert/remove.",
    whenToUse:
      "When you need the k-th element, top/bottom k, merge sorted streams, or process elements by priority. Often combined with sorting.",
    examples: [
      "Kth Largest Element",
      "Merge K Sorted Lists",
      "Find Median from Data Stream",
      "Top K Frequent Elements",
      "Task Scheduler",
    ],
  },
];

export function AlgorithmPatternMatcher() {
  const { color } = useToolAccent();
  const [problem, setProblem] = useState("");

  const matched = useMemo(() => {
    if (!problem.trim()) return [];
    const lower = problem.toLowerCase();
    const scored: { pattern: Pattern; score: number }[] = [];
    for (const pattern of PATTERNS) {
      let score = 0;
      for (const kw of pattern.keywords) {
        if (lower.includes(kw)) {
          score += kw.split(" ").length;
        }
      }
      if (score > 0) scored.push({ pattern, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [problem]);

  const highlighted = useMemo(() => {
    if (!problem.trim()) return null;
    const lower = problem.toLowerCase();
    const result = problem;
    const allKws = PATTERNS.flatMap((p) => p.keywords).sort((a, b) => b.length - a.length);
    const parts: { start: number; end: number; kw: string }[] = [];
    for (const kw of allKws) {
      let idx = 0;
      while ((idx = lower.indexOf(kw, idx)) !== -1) {
        const overlaps = parts.some((p) => idx >= p.start && idx < p.end);
        if (!overlaps) {
          parts.push({ start: idx, end: idx + kw.length, kw });
        }
        idx += 1;
      }
    }
    parts.sort((a, b) => a.start - b.start);
    if (parts.length === 0) return null;
    const spans: React.ReactNode[] = [];
    let last = 0;
    for (const part of parts) {
      if (part.start > last)
        spans.push(<span key={`t-${last}`}>{problem.slice(last, part.start)}</span>);
      spans.push(
        <mark
          key={`m-${part.start}`}
          className="rounded-sm px-0.5 font-bold"
          style={{ backgroundColor: color, color: "#fff" }}
        >
          {problem.slice(part.start, part.end)}
        </mark>,
      );
      last = part.end;
    }
    if (last < problem.length) spans.push(<span key={`t-${last}`}>{problem.slice(last)}</span>);
    return spans;
  }, [problem, color]);

  return (
    <ToolLayout id="algorithm-pattern-matcher">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Describe your problem
        </label>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={6}
          placeholder={
            "e.g. Find the longest substring without repeating characters in a string. I need to use a sliding window approach on this sorted array..."
          }
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
        {highlighted && (
          <div className="mt-2 rounded-md border border-line bg-paper-dim/30 p-3 font-mono text-xs text-muted">
            <span className="mb-1 block text-[10px] uppercase tracking-wider">
              Detected keywords
            </span>
            <span className="whitespace-pre-wrap text-foreground">{highlighted}</span>
          </div>
        )}
      </div>

      {problem.trim() && matched.length === 0 && (
        <div className="rounded-lg border-2 border-line bg-input-bg p-6 text-center">
          <p className="text-sm text-muted">
            No patterns detected. Try including keywords like &quot;sliding window&quot;,
            &quot;binary search&quot;, &quot;dynamic programming&quot;, etc.
          </p>
        </div>
      )}

      {matched.length > 0 && (
        <div className="space-y-3">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            {matched.length} pattern{matched.length !== 1 ? "s" : ""} matched
          </span>
          {matched.map(({ pattern, score }) => (
            <div
              key={pattern.name}
              className="rounded-lg border-2 bg-input-bg p-4 transition-all"
              style={{ borderColor: color }}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-mono text-base font-bold" style={{ color }}>
                  {pattern.name}
                </h3>
                <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
                  confidence: {Math.min(100, score * 10)}%
                </span>
              </div>
              <p className="mb-2 text-sm text-foreground">{pattern.description}</p>
              <div className="mb-3 rounded-md border border-line bg-paper-dim/20 p-3">
                <span
                  className="mb-1 block font-mono text-[10px] uppercase tracking-wider"
                  style={{ color }}
                >
                  When to use
                </span>
                <p className="text-xs text-muted">{pattern.whenToUse}</p>
              </div>
              <div>
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-muted">
                  Example problems
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.examples.map((ex) => (
                    <span
                      key={ex}
                      className="rounded-md border border-line bg-paper-dim/30 px-2 py-0.5 font-mono text-[11px] text-muted"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!problem.trim() && (
        <div className="rounded-lg border-2 border-dashed border-line bg-input-bg p-6 text-center">
          <span className="mb-2 block font-mono text-lg" style={{ color }}>
            Enter a problem description above
          </span>
          <p className="text-xs text-muted">
            The matcher detects keywords like &quot;sliding window&quot;, &quot;binary search&quot;,
            &quot;dp&quot;, &quot;graph&quot;, &quot;backtrack&quot; and more.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
