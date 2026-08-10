import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
}

export function CardGridSkeleton({ count = 8, className }: CardGridSkeletonProps) {
  return (
    <div
      data-skeleton="grid"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-md border border-line bg-paper p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md bg-line" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4 bg-line" />
              <Skeleton className="h-2.5 w-1/2 bg-line" />
            </div>
          </div>
          <Skeleton className="mt-4 h-3 w-full bg-line" />
          <Skeleton className="mt-2 h-3 w-5/6 bg-line" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-line" />
            <Skeleton className="h-5 w-16 rounded-full bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
