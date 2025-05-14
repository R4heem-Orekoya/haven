import PropertyFilter from "@/components/property/property-filter"
import { PropertyGrid } from "@/components/property/property-grid"
import PropertyPagination from "@/components/property/property-pagination"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { getProertyCount, tryCatch } from "@/lib/utils"
import { PropertyCategory, PropertyType } from '@prisma/client'
import { Suspense } from "react"

interface Props {
   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: Props) => {
   const signedInUser = await currentUser()
   
   const propertyType = (await searchParams)?.propertyType as PropertyType | undefined
   const category = (await searchParams)?.category as PropertyCategory | undefined
   const state = (await searchParams)?.state as string | undefined
   const page = Number((await searchParams)?.page as string) || 1

   const PAGINATIONITEMSTODISPLAY = 12

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
            AND: filterConditions
         })
      },
      include: {
         images: true,
         favoredByUsers: true,
         user: true
      },
      take: PAGINATIONITEMSTODISPLAY,
      skip: (page - 1) * PAGINATIONITEMSTODISPLAY
   })


   const { data, error } = await tryCatch(getProertyCount())
   let propertyCount = error ? 30 : data!

   const TOTALPAGES = Math.ceil(propertyCount / PAGINATIONITEMSTODISPLAY)

   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <Suspense fallback={null}>
            <PropertyFilter />
         </Suspense>
         <div className="mt-4 min-h-[calc(100vh-56px)]">
            {properties.length ? (
               <PropertyGrid 
                  data={properties}
                  signedInUser={signedInUser} 
               />
            ) : (
               <div>
                  No Properties Found
               </div>
            )}
         </div>

         {PAGINATIONITEMSTODISPLAY < propertyCount && (
            <div className="py-8">
               <PropertyPagination
                  currentPage={page}
                  totalPages={TOTALPAGES}
                  paginationItemsToDisplay={PAGINATIONITEMSTODISPLAY}
               />
            </div>
         )}
      </main>
   )
}

export default Page
