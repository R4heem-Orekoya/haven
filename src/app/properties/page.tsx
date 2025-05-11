import PropertyFilter from "@/components/property/property-filter"
import { PropertyGrid } from "@/components/property/property-grid"
import PropertyPagination from "@/components/property/property-pagination"
import { db } from "@/lib/db"
import { PropertyCategory, PropertyType } from '@prisma/client'
import { Suspense } from "react"

interface Props {
   searchParams?: { [key: string]: string | string[] | undefined }
}

const Page = async ({ searchParams }: Props) => {
   const propertyType = searchParams?.propertyType as PropertyType | undefined
   const category = searchParams?.category as PropertyCategory | undefined
   const state = searchParams?.state as string | undefined
   const page = Number(searchParams?.page as string) || 1
   
   const PAGINATIONITEMSTODISPLAY = 12
   const TOTALPAGES = 3

   const filterConditions = []

   if (propertyType) {
      filterConditions.push({ type: propertyType })
   }
   if (category) {
      filterConditions.push({ category })
   }
   if (state) {
      filterConditions.push({ state })
   }

   const properties = await db.property.findMany({
      where: {
         status: "published",
         ...(filterConditions.length > 0 && {
            OR: filterConditions
         })
      },
      include: {
         images: true
      },
      take: PAGINATIONITEMSTODISPLAY,
      skip: (page - 1) * PAGINATIONITEMSTODISPLAY
   })
   
   console.log(properties)

   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <Suspense fallback={null}>
            <PropertyFilter />  
         </Suspense>
         <div className="mt-4 min-h-[calc(100vh-56px)]">
            {properties.length ? (
               <PropertyGrid data={properties} />
            ) : (
               <div>
                  No Properties Found
               </div>
            )}
         </div>
         
         <div className="py-8">
            <PropertyPagination 
               currentPage={page} 
               totalPages={TOTALPAGES} 
               paginationItemsToDisplay={PAGINATIONITEMSTODISPLAY}
            />
         </div>
      </main>
   )
}

export default Page
 