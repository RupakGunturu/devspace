import { Skeleton } from "@/components/ui/skeleton";

interface AdminCardSkeletonProps {
  count?: number;
}

export function AdminCardSkeleton({ count = 6 }: AdminCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-line bg-card p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-3/4 bg-line" />
            <Skeleton className="h-5 w-14 shrink-0 rounded-full bg-line" />
          </div>
          <Skeleton className="mb-3 h-3 w-1/2 bg-line" />
          <Skeleton className="mb-1 h-3 w-full bg-line" />
          <Skeleton className="mb-3 h-3 w-5/6 bg-line" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-sm bg-line" />
            <Skeleton className="h-6 w-16 rounded-sm bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}
