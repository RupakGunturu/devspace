import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { userActivity } from "@/lib/userActivity";
import { toast } from "./ui/toaster";
import { cn } from "@/lib/utils";

export default function BookmarkButton({
  type,
  slug,
  className,
}: {
  type: string;
  slug: string;
  className?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      userActivity.get().then((data) => {
        setIsBookmarked(data.favorites.some((f) => f.type === type && f.slug === slug));
      });
    } else {
      setIsBookmarked(userActivity.isFavorited(type, slug));
    }
  }, [user, type, slug]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast.danger("Please sign in to bookmark items");
      navigate("/login");
      return;
    }

    try {
      const result = await userActivity.toggleFavorite(type, slug);
      setIsBookmarked(result.isFavorited);
      toast.success(result.isFavorited ? "Bookmarked!" : "Bookmark removed");
    } catch {
      toast.danger("Failed to update bookmark");
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
          isBookmarked
            ? "fill-yellow text-yellow"
            : "text-muted hover:text-yellow",
        )}
      />
    </button>
  );
}
