"use client"

import { useSearchParams } from "next/navigation";
import PropertyPagination from "./property-pagination"

interface PropertyPaginationWrapperProps {
   page: number
   totalPages: number;
   paginationItemsToDisplay?: number;
}

export default function PropertyPaginationWrapper({ page, totalPages, paginationItemsToDisplay }: PropertyPaginationWrapperProps) {
   const searchParams = useSearchParams()
   
   return (
      <div className="py-8">
         <PropertyPagination
            currentPage={page}
            totalPages={totalPages}
            paginationItemsToDisplay={paginationItemsToDisplay}
            searchParams={searchParams}
         />
      </div>
   )
}