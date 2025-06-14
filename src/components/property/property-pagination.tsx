"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { ReadonlyURLSearchParams } from "next/navigation";

interface PropertyPaginationProps {
   currentPage: number;
   totalPages: number;
   paginationItemsToDisplay?: number;
   searchParams: ReadonlyURLSearchParams
}

function createUrlWithPage(page: number, searchParams: ReadonlyURLSearchParams) {
   const params = new URLSearchParams(searchParams);

   params.set("page", String(page));

   return `/properties?${params.toString()}`;
}


const PropertyPagination = ({ currentPage, totalPages, paginationItemsToDisplay = 12, searchParams }: PropertyPaginationProps) => {
   const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
      currentPage,
      totalPages,
      paginationItemsToDisplay,
   })

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               <PaginationPrevious
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  href={currentPage === 1 ? undefined : createUrlWithPage(currentPage - 1, searchParams)}
                  aria-disabled={currentPage === 1 ? true : undefined}
                  role={currentPage === 1 ? "link" : undefined}
               />
            </PaginationItem>

            {showLeftEllipsis && (
               <PaginationItem>
                  <PaginationEllipsis />
               </PaginationItem>
            )}

            {pages.map((page) => (
               <PaginationItem key={page}>
                  <PaginationLink className="w-8 h-8" href={createUrlWithPage(page, searchParams)} isActive={page === currentPage}>
                     {page}
                  </PaginationLink>
               </PaginationItem>
            ))}

            {showRightEllipsis && (
               <PaginationItem>
                  <PaginationEllipsis />
               </PaginationItem>
            )}

            <PaginationItem>
               <PaginationNext
                  size="sm"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  href={currentPage === totalPages ? undefined : createUrlWithPage(currentPage + 1, searchParams)}
                  aria-disabled={currentPage === totalPages ? true : undefined}
                  role={currentPage === totalPages ? "link" : undefined}
               />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   )
}

export default PropertyPagination