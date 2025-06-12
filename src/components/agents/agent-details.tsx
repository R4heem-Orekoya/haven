import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { isUserVerified } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Globe, CalendarCheck, Phone, MapPin, Mail, User as UserIcon, Home, BadgeCheck } from "lucide-react"
import ProfilePicture from "@/components/profile-picture"
import AgentProperties from "./agent-properties"
import { Suspense } from "react"
import { PropertyCardSkeleton } from "../property/property-card-skeleton"

interface AgentDetailsProps {
   id: string
}

export default async function AgentDetails({ id }: AgentDetailsProps) {
   const signedInUser = await currentUser()
   const propertyDeveloper = await db.user.findUnique({
      where: {
         id,
      }
   })

   if (
      !propertyDeveloper ||
      !propertyDeveloper.accountVisibility ||
      propertyDeveloper.accountType === "individual"
   ) {
      return notFound()
   }

   const isVerified = isUserVerified(propertyDeveloper)

   return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 border rounded-lg shadow-sm">
         <div className="flex items-center gap-4 mb-6">
            <ProfilePicture
               image={propertyDeveloper.image}
               name={propertyDeveloper.name}
               size="xl"
            />
            <div>
               <h1 className="text-2xl font-bold flex items-center gap-1">
                  {propertyDeveloper.name ?? "Unnamed Developer"}
                  {isVerified && (
                     <BadgeCheck className="fill-green-600 stroke-background" />
                  )}
               </h1>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{propertyDeveloper.email ?? "No Email"}</span>
               </div>
            </div>
         </div>

         <div>
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-1">
               <UserIcon className="h-5 w-5" />
               <span>Bio</span>
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
               {propertyDeveloper.bio ?? "No bio provided."}
            </p>
         </div>

         <div>
            <h2 className="font-semibold text-lg mb-2">Contact Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               {propertyDeveloper.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                     <Phone className="h-4 w-4 text-muted-foreground" />
                     <span>{propertyDeveloper.phoneNumber}</span>
                  </div>
               )}
               {propertyDeveloper.address && (
                  <div className="flex items-center gap-2 text-sm">
                     <MapPin className="h-4 w-4 text-muted-foreground" />
                     <span>{propertyDeveloper.address}</span>
                  </div>
               )}
            </dl>
         </div>

         <div>
            <h2 className="font-semibold text-lg mb-2">Links</h2>
            <div className="flex flex-col gap-2">
               {propertyDeveloper.personalWebsiteUrl && (
                  <a
                     href={
                        propertyDeveloper.personalWebsiteUrl.startsWith("http")
                           ? propertyDeveloper.personalWebsiteUrl
                           : `https://${propertyDeveloper.personalWebsiteUrl}`
                     }
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                  >
                     <Globe className="h-4 w-4" />
                     Visit Website
                  </a>
               )}

               {propertyDeveloper.schedulingAppUrl && (
                  <a
                     href={
                        propertyDeveloper.schedulingAppUrl.startsWith("http")
                           ? propertyDeveloper.schedulingAppUrl
                           : `https://${propertyDeveloper.schedulingAppUrl}`
                     }
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                  >
                     <CalendarCheck className="h-4 w-4" />
                     Book an Appointment
                  </a>
               )}
            </div>
         </div>

         <div className="pt-4">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-1">
               <Home className="h-5 w-5" />
               <span>Properties</span>
            </h2>
            <Suspense fallback={<PropertyCardSkeleton />}>
               <AgentProperties 
                  signedInUser={signedInUser} 
                  userId={propertyDeveloper.id} 
               />
            </Suspense>
         </div>
      </div>
   )
}
