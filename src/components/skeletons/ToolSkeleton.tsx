import { Skeleton } from "@/components/ui/skeleton";

interface ToolSkeletonProps {
  accent?: string;
}

export function ToolSkeleton({ accent = "#e8c81c" }: ToolSkeletonProps) {
  return (
    <div data-skeleton="tool" className="space-y-4 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 shrink-0 rounded-lg"
          style={{ backgroundColor: `${accent}22`, border: `1px solid ${accent}44` }}
        />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3 max-w-xs bg-line" />
          <Skeleton className="h-3 w-1/2 max-w-[200px] bg-line" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-md bg-line" />
        <Skeleton className="h-10 w-full rounded-md bg-line" />
        <Skeleton className="h-10 w-full rounded-md bg-line" />
      </div>
      <Skeleton className="h-10 w-32 rounded-md bg-line" />
      <div className="rounded-md border border-line bg-paper p-4">
        <Skeleton className="h-4 w-1/3 bg-line" />
        <Skeleton className="mt-4 h-4 w-full bg-line" />
        <Skeleton className="mt-2 h-4 w-full bg-line" />
        <Skeleton className="mt-2 h-4 w-5/6 bg-line" />
      </div>
    </div>
  );
}
