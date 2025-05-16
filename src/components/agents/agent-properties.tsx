import { db } from "@/lib/db"
import { User } from "@prisma/client"
import { PropertyCard } from "../property/property-cards"

interface AgentPropertiesProps {
   userId: string
   signedInUser: User | null
}

export default async function AgentProperties({ userId, signedInUser }:AgentPropertiesProps) {
   const property = await db.property.findMany({
      where: {
         userId
      },
      include: {
         favoredByUsers: true,
         images: {
            orderBy: {
               order: "asc"
            }
         },
         user: true
      }
   })
   
   return (
      <>
         {property.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {property.map((property) => (
                  <PropertyCard
                     property={property}
                     signedInUser={signedInUser}
                  />
               ))}
            </div>
         ) : (
            <p className="text-sm text-muted-foreground">
               No properties listed.
            </p>
         )}
      </>
   )
}