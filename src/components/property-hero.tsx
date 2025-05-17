import { db } from "@/lib/db"
import { PropertyGrid } from "./property/property-grid"
import { currentUser } from "@/lib/db/queries/user"

export default async function PropertyHero() {
   const signedInUser = await currentUser()
   
   const properties = await db.property.findMany({
      where: {
         status: "published"
      },
      include: {
         images: {
            orderBy: {
               order: "asc"
            }
         },
         user: true,
         favoredByUsers: true
      },
      take: 4
   })

   return (
      <PropertyGrid 
         data={properties} 
         signedInUser={signedInUser} 
      />
   )
}
