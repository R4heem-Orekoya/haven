import { Skeleton } from "@/components/ui/skeleton"

interface PropertyCardSkeletonProps {
   length?: number
}

export const PropertyCardSkeleton = ({ length = 3}: PropertyCardSkeletonProps) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
         {Array.from({ length }).map((_, i) => (
            <div className="col-span-1" key={i}>
               <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                  <Skeleton className="h-full w-full" />
                  <Skeleton className="absolute top-4 right-4 w-8 h-8 rounded-3xl" />
               </div>
               <div className="mt-2">
                  <div className="flex justify-between items-start">
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-1/2 mt-1" />
               </div>
               <div className="flex items-center gap-2 py-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Skeleton className="h-4 w-16" />
                  </div>
               </div>
               <Skeleton className="h-6 w-1/3 mt-1" />
            </div>

         ))}
      </div>
   )
}
