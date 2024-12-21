import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Badge } from "./ui/badge"
import { Bath, Bed, Square } from "lucide-react"
import { property } from "@/types/property"

interface PropertyCardProps {
   property: property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
   return (
      <div className="col-span-1">
         <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
               src={property.image}
               alt={property.name}
               fill
               className="object-cover"
            />
            <div className="absolute top-4 left-4 py-1 px-2 bg-secondary text-xs font-semibold rounded-full">
               For {property.type}
            </div>
         </div>
         <div className="flex justify-between items-start mt-3">
            <div>
               <h3 className="text-xl font-semibold tracking-normal">{property.name}</h3>
               <p className="text-muted-foreground">{property.location}</p>
            </div>
            <p className="text-lg font-semibold text-primary">
               {formatPrice(property.price, { notation: "standard" })}
            </p>
         </div>
         <div className="flex items-center gap-3 mt-3 text-muted-foreground">
            <Badge variant="outline" className="flex items-center gap-1 py-1 px-1 rounded-md font-light">
               <Bed className="w-4 h-4" />
               <span>{property.beds}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 py-1 px-1 rounded-md font-light">
               <Bath className="w-4 h-4" />
               <span>{property.baths}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 py-1 px-1 rounded-md font-light">
               <Square className="w-4 h-4" />
               <span>{property.sqft.toLocaleString()} sq ft</span>
            </Badge>
         </div>
      </div>
   )
}

export default PropertyCard
