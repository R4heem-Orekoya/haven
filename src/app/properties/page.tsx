import Properties from "@/components/property/properties"
import { PropertyCardSkeleton } from "@/components/property/property-card-skeleton"
import PropertyFilter from "@/components/property/property-filter"
import { PropertyCategory, PropertyType } from '@prisma/client'
import { Suspense } from "react"

interface Props {
   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async ({ searchParams }: Props) => {
   const propertyType = (await searchParams)?.propertyType as PropertyType | undefined
   const category = (await searchParams)?.category as PropertyCategory | undefined
   const state = (await searchParams)?.state as string | undefined
   const page = Number((await searchParams)?.page as string) || 1

   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <Suspense fallback={null}>
            <PropertyFilter />
         </Suspense>
         
         <Suspense fallback={<PropertyCardSkeleton length={8}/>}>
            <Properties 
               filterParams={{
                  category, 
                  page,
                  propertyType,
                  state
               }}
            />
         </Suspense>
      </main>
   )
}

export default Page
