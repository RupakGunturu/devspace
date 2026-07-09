import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BlogIntroGenerator() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");

  const templates = [
    `In today's fast-paced world of ${topic}, staying ahead of the curve is essential. Whether you're a seasoned professional or just getting started, understanding the fundamentals can make all the difference.`,
    `${topic} has become one of the most talked-about subjects in the tech community. But what exactly makes it so important, and how can you leverage it to your advantage?`,
    `When it comes to ${topic}, there's a lot of noise out there. In this article, we'll cut through the confusion and give you practical, actionable insights you can use right away.`,
    `The world of ${topic} is evolving rapidly. New tools, techniques, and best practices emerge every day. Let's explore what matters most and how you can stay ahead.`,
  ];

  const generate = () => setOutput(templates[Math.floor(Math.random() * templates.length)]);

  return (
    <ToolLayout id="blog-intro-generator">
      <ToolInput value={topic} onChange={setTopic} placeholder="React performance optimization" label="Topic" rows={1} />
      <ToolButton onClick={generate}>Generate Intro</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
