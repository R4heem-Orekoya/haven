import { Skeleton } from "../ui/skeleton";

export default function AgentsSkeleton() {
   return (
      <div className="space-y-4">
         {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-4 border border-primary/5 rounded-lg flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                     <Skeleton className="w-40 h-4" />
                     <Skeleton className="w-32 h-3" />
                  </div>
               </div>
               <Skeleton className="w-24 h-4" />
            </div>
         ))}
      </div>
   )
}