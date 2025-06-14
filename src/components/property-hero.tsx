import { PropertyGrid } from "./property/property-grid"
import { currentUser } from "@/lib/db/queries/user"
import { getHeroProperties } from "@/lib/db/queries/property"

export default async function PropertyHero() {
   const signedInUser = await currentUser()
   const properties = await getHeroProperties()

   return (
      <PropertyGrid 
         data={properties} 
         signedInUser={signedInUser} 
      />
   )
}