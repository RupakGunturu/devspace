import { useRef } from "react";
import { userActivity } from "@/lib/userActivity";

export function useSaveGameScore() {
  const savedRef = useRef(false);

  const save = (gameSlug: string, score: number, streak: number, accuracy = 0, rank = "") => {
    if (savedRef.current) return;
    savedRef.current = true;
    userActivity.saveGameScore(gameSlug, score, streak, accuracy, rank).catch(() => {});
  };

  return { save, canSave: true };
}
