import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    id: "1",
    title: "What is DevSpace?",
    content:
      "DevSpace is a weekly dev zine built by a developer who was tired of bloated tools and boring tutorials. It gives you tools that just work, games that teach by doing, and real talk about the code we actually write.",
  },
  {
    id: "2",
    title: "What kind of tools are here?",
    content:
      "Dev tools that run in your browser — regex testers, JSON formatters, CSS generators, and more. No signups, no paywalls, no bloat. Open a tool, use it, close it. That's it.",
  },
  {
    id: "3",
    title: "What are the games about?",
    content:
      "Games like DevWordle and other coding challenges that teach you by doing. They're built to make learning feel less like studying and more like playing — because the best way to learn is to just mess around.",
  },
  {
    id: "4",
    title: "What's in the feed?",
    content:
      "The feed is where the zine lives — hot takes on dev culture, stack breakdowns of real products, resource drops, bug of the week, and changelog updates. New posts drop weekly.",
  },
  {
    id: "5",
    title: "Why no light mode?",
    content:
      "The whole visual identity — paper cards, ink background, that contrast — is built around dark mode. Adding light mode would mean designing a second brand. Maybe later, not now.",
  },
  {
    id: "6",
    title: "Who builds this?",
    content:
      "One developer, building tools and writing content that I actually want to exist. No team, no VC money, just a dev who got tired of bloated tools and decided to make something better.",
  },
  {
    id: "7",
    title: "Is it free?",
    content:
      "Yes. Everything on DevSpace — tools, games, and the feed — is free. No subscriptions, no premium tiers, no \"enter your credit card for the free trial\" nonsense.",
  },
  {
    id: "8",
    title: "How often is new content added?",
    content:
      "The feed gets new posts weekly — hot takes, resource drops, stack breakdowns, and more. Tools and games ship whenever they're ready, which is usually when I break something and have to fix it.",
  },
];

export function Accordion05() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" defaultValue="7" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="last:border-b">
            <AccordionTrigger className="text-left pl-6 md:pl-14 overflow-hidden text-foreground/20 duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 data-[state=open]:text-primary [&>svg]:hidden">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs">{item.id}</p>
                <h1
                  className={`uppercase relative text-center text-lg md:text-xl`}
                >
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground pb-6 pl-6 md:px-20">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
