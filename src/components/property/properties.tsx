import { db } from "@/lib/db";
import { currentUser } from "@/lib/db/queries/user"
import { getProertyCount, tryCatch } from "@/lib/utils";
import { PropertyCategory, PropertyType } from "@prisma/client";
import { PropertyGrid } from "./property-grid";
import PropertyPagination from "./property-pagination";
import Empty from "../svgs/empty";

interface PropertiesProps {
   filterParams:{
      propertyType: PropertyType | undefined;
      category: PropertyCategory | undefined;
      state: string | undefined;
      page: number
   }
}


export default async function Properties({ filterParams:{ category, page, propertyType, state }}: PropertiesProps) {
   const signedInUser = await currentUser()
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
         images: {
            orderBy: {
               order: "asc"
            }
         },
         favoredByUsers: true,
         user: true
      },
      take: PAGINATIONITEMSTODISPLAY,
      skip: (page - 1) * PAGINATIONITEMSTODISPLAY
   })

   const { data, error } = await tryCatch(getProertyCount())
   let propertyCount

   if (filterConditions.length > 0) {
      propertyCount = properties.length
   } else {
      propertyCount = error ? 30 : data!
   }

   const TOTALPAGES = Math.ceil(propertyCount / PAGINATIONITEMSTODISPLAY)

   return (
      <>
         <div className="mt-4 min-h-[calc(100vh-56px)]">
            {properties.length ? (
               <PropertyGrid
                  data={properties}
                  signedInUser={signedInUser}
               />
            ) : (
               <div className="text-center flex flex-col items-center text-2xl md:text-3xl font-medium max-w-md mx-auto">
                  <Empty className="w-48 h-48"/>
                  <p>No Properties Found!</p>
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
      </>
   )
}
