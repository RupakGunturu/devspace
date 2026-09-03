import type { ComponentType } from "react";
import { BugFinder } from "./BugFinder";
import { DevWordle } from "./DevWordle";
import { DevTrivia } from "./DevTrivia";
import { TechMemory } from "./TechMemory";
import { StackMatcher } from "./StackMatcher";
import { HttpRoulette } from "./HttpRoulette";
import { BinaryRace } from "./BinaryRace";

export const GAMES_REGISTRY: Record<string, ComponentType> = {
  "bug-finder": BugFinder,
  devwordle: DevWordle,
  "dev-trivia": DevTrivia,
  "tech-memory": TechMemory,
  "stack-matcher": StackMatcher,
  "http-roulette": HttpRoulette,
  "binary-race": BinaryRace,
};
