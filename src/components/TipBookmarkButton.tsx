import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { userActivity } from "@/lib/userActivity";
import { toast } from "./ui/toaster";
import { cn } from "@/lib/utils";

export default function TipBookmarkButton({
  tipId,
  className,
}: {
  tipId: string;
  className?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      userActivity.get().then((data) => {
        setIsSaved(data.savedTips.some((s) => s.tipId === tipId));
      });
    } else {
      setIsSaved(false);
    }
  }, [user, tipId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast.danger("Please sign in to save tips");
      navigate("/login");
      return;
    }

    try {
      const result = await userActivity.toggleSavedTip(tipId);
      setIsSaved(result.isSaved);
      toast.success(result.isSaved ? "Tip saved!" : "Tip unsaved");
    } catch {
      toast.danger("Failed to update saved tip");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "shrink-0 rounded p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
        className,
      )}
      type="button"
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-colors",
          isSaved ? "fill-yellow text-yellow" : "text-muted hover:text-yellow",
        )}
      />
    </button>
  );
}
