import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RandomQuoteGenerator() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const quotes = [
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
    { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  ];

  const generate = () => setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <ToolLayout id="random-quote-generator">
      <div className="flex flex-col items-center gap-6 py-4">
        <ToolButton onClick={generate}>Generate Quote</ToolButton>
        {quote && (
          <div className="p-6 bg-paper-dim/50 border border-border rounded-sm text-center max-w-lg">
            <p className="font-display text-lg font-bold text-foreground leading-relaxed italic">&ldquo;{quote.text}&rdquo;</p>
            <p className="text-sm text-muted-foreground mt-3">— {quote.author}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
