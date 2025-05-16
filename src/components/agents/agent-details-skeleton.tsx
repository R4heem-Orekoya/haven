import { Globe, CalendarCheck, Phone, MapPin, Mail, User as UserIcon, Home} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { PropertyCardSkeleton } from "../property/property-card-skeleton"

export function AgentDetailsSkeleton() {
   return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 border rounded-lg shadow-sm animate-pulse">
         <div className="flex items-center gap-4 mb-6">
            <Skeleton className="rounded-full h-20 w-20" />
            <div>
               <Skeleton className="h-6 w-48 mb-2" />
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 opacity-40" />
                  <Skeleton className="h-4 w-32" />
               </div>
            </div>
         </div>

         <div>
            <div className="font-semibold text-lg mb-2 flex items-center gap-1">
               <UserIcon className="h-5 w-5 opacity-40" />
               <Skeleton className="h-5 w-16" />
            </div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-4/5 mb-2" />
               <Skeleton className="h-4 w-2/3" />
            </div>
         </div>

         <div>
            <div className="font-semibold text-lg mb-2">
               <Skeleton className="h-5 w-32 inline-block" />
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground opacity-40" />
                  <Skeleton className="h-4 w-24 inline-block" />
               </div>
               <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground opacity-40" />
                  <Skeleton className="h-4 w-24 inline-block" />
               </div>
            </dl>
         </div>

         <div>
            <div className="font-semibold text-lg mb-2">
               <Skeleton className="h-5 w-16 inline-block" />
            </div>
            <div className="flex flex-col gap-2">
               <div className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 opacity-40" />
                  <Skeleton className="h-4 w-32 inline-block" />
               </div>

               <div className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 opacity-40" />
                  <Skeleton className="h-4 w-32 inline-block" />
               </div>
            </div>
         </div>

         <div className="pt-4">
            <div className="font-semibold text-lg mb-4 flex items-center gap-1">
               <Home className="h-5 w-5 opacity-40" />
               <Skeleton className="h-5 w-24" />
            </div>
            <PropertyCardSkeleton />
         </div>
      </div>
   )
}
