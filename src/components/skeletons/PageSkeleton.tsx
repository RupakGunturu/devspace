import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "./CardGridSkeleton";
import { cn } from "@/lib/utils";

interface PageSkeletonProps {
  variant?: "list" | "detail";
  className?: string;
}

export function PageSkeleton({ variant = "list", className }: PageSkeletonProps) {
  return (
    <section data-skeleton="page" className={cn("mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16", className)}>
      <Skeleton className="h-4 w-24 bg-line" />
      <Skeleton className="mt-4 h-9 w-2/3 max-w-md bg-line" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl bg-line" />

      {variant === "list" ? (
        <div className="mt-8">
          <div className="mb-6">
            <Skeleton className="h-11 w-full max-w-md rounded-md bg-line" />
          </div>
          <CardGridSkeleton count={8} />
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          <Skeleton className="h-4 w-full bg-line" />
          <Skeleton className="h-4 w-5/6 bg-line" />
          <Skeleton className="h-4 w-full bg-line" />
          <Skeleton className="h-4 w-2/3 bg-line" />
          <div className="mt-6 rounded-md border border-line bg-paper p-6">
            <Skeleton className="h-4 w-1/3 bg-line" />
            <Skeleton className="mt-4 h-4 w-full bg-line" />
            <Skeleton className="mt-2 h-4 w-full bg-line" />
            <Skeleton className="mt-2 h-4 w-3/4 bg-line" />
          </div>
        </div>
      )}
    </section>
  );
}
