import { cn } from "@/lib/utils"
import { property } from "@/types/property"
import PropertyCard from "./property-card"

interface PropertyGridProps {
   data: property[],
   className?: string
}

const PropertyGrid = ({ className, data: properties }: PropertyGridProps) => {
   return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
         {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
         ))}
      </div>
   )
}

export default PropertyGrid
