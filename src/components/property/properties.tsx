import { currentUser } from "@/lib/db/queries/user"
import { getProertyCount, tryCatch } from "@/lib/utils";
import { PropertyCategory, PropertyType } from "@prisma/client";
import { PropertyGrid } from "./property-grid";
import Empty from "../svgs/empty";
import { PAGINATIONITEMSTODISPLAY } from "@/consts";
import { FilterOptions } from "@/types";
import { getPropertiesWithFilter } from "@/lib/db/queries/property";
import PropertyPaginationWrapper from "./property-pagination-wrapper";

interface PropertiesProps {
   filterParams: {
      propertyType: PropertyType | undefined;
      category: PropertyCategory | undefined;
      state: string | undefined;
      page: number
   }
}


export default async function Properties({ filterParams: { category, page, propertyType, state } }: PropertiesProps) {
   const signedInUser = await currentUser()

   const filterConditions: FilterOptions = []

   if (propertyType) {
      filterConditions.push({ type: propertyType })
   }
   if (category) {
      filterConditions.push({ category })
   }
   if (state) {
      filterConditions.push({ state })
   }

   const properties = await getPropertiesWithFilter({ filterOptions: filterConditions, page })

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
                  <Empty className="w-48 h-48" />
                  <p>No Properties Found!</p>
               </div>
            )}
         </div>

         <PropertyPaginationWrapper 
            page={page}
            totalPages={TOTALPAGES}
            paginationItemsToDisplay={PAGINATIONITEMSTODISPLAY}
         />
      </>
   )
}