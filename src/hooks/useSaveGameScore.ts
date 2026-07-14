import { useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { activityApi } from "@/lib/api";

export function useSaveGameScore() {
  const { user } = useAuth();
  const savedRef = useRef(false);

  const save = (gameSlug: string, score: number, streak: number, accuracy = 0, rank = "") => {
    if (!user || savedRef.current) return;
    savedRef.current = true;
    activityApi
      .saveGameScore({ gameSlug, score, streak, accuracy, rank })
      .catch(() => {});
  };

  return { save, canSave: !!user };
}
