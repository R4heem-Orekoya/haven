import PropertyFilter from "@/components/property/property-filter"
import { PropertyGrid } from "@/components/property/property-grid"
import { db } from "@/lib/db"
import { PropertyCategory, PropertyType } from '@prisma/client'

interface Props {
   searchParams?: { [key: string]: string | string[] | undefined }
}

const Page = async ({ searchParams }: Props) => {
   const propertyType = searchParams?.propertyType as PropertyType | undefined
   const category = searchParams?.category as PropertyCategory | undefined
   const state = searchParams?.state as string | undefined
   
   const properties = await db.property.findMany({
      where: {
         status: "published",
         ...(propertyType && { type: propertyType }),
         ...(category && { category }),
         ...(state && { state })
      },
      include: {
         images: true
      }
   })
   console.log(properties)
   
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <PropertyFilter />
         <div className="mt-4">
            {properties.length ? (
               <PropertyGrid data={properties}/>
            ): (
               <div>
                  No Properties Found
               </div>
            )}
         </div>
      </main>
   )
}

export default Page