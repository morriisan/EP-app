import { Skeleton } from "@/components/ui/skeleton";

export function BookingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Calendar Section Skeleton */}
      <div className="bg-theme-section-primary rounded-xl shadow-sm">
        <div className="p-6 border-b border-theme-border-default">
          <Skeleton className="h-6 w-32 mb-4" />
        </div>
        <div className="p-2 flex justify-center items-center">
          <Skeleton className="min-w-[240px] max-w-[280px] h-[250px] w-fit" />
        </div>
      </div>

      {/* Form Section Skeleton */}
      <div className="bg-theme-section-primary rounded-xl shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-28 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

export function BookingListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="border border-theme-border-default rounded-lg p-4 bg-theme-accent-secondary">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
} 