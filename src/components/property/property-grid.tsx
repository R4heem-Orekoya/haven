"use client"

import { cn } from "@/lib/utils"
import { PropertyCard } from "./property-cards"
import { PropertyWithFavoritesAndImages } from "@/types/property"
import { User } from "@prisma/client"

interface PropertyGridProps {
   data: PropertyWithFavoritesAndImages[],
   className?: string,
   signedInUser: User | null
}

export const PropertyGrid = ({ className, data: properties, signedInUser }: PropertyGridProps) => {
   return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
         {properties.map((property) => (
            <PropertyCard
               key={property.id}
               property={property}
               signedInUser={signedInUser}
            />
         ))}
      </div>
   )
}