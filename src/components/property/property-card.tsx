import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Bath, Bed, Edit, MapPin, MoreVertical, Ruler, Trash2 } from "lucide-react"
import { property } from "@/types/property"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"

interface PropertyCardProps {
   property: property
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
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
         <div className="space-y-1 mt-2">
            <p className="flex items-center gap-2 text-sm font-semibold"><MapPin className="w-4 h-4 text-muted-foreground" />{property.location}</p>
            <h3 className="text-lg font-semibold tracking-normal">{property.name}</h3>
         </div>
         <div className="flex items-center gap-2 py-2">
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
               <Bed className="w-3 h-3" />
               {property.beds}
            </p>
            <div className="w-[1px] h-[10px] bg-zinc-200" />
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
               <Bath className="w-3 h-3 " />
               {property.baths}
            </p>
            <div className="w-[1px] h-[10px] bg-zinc-200" />
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
               <Ruler className="w-3 h-3" />
               {property.sqft.toLocaleString()} sq ft
            </p>
         </div>
         <p className="text-lg font-semibold tracking-normal opacity-80">{formatPrice(property.price, { notation: "standard" })}</p>
      </div>
   )
}


export const DashboardPropertyCard = ({ property }: PropertyCardProps) => {
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
         <div className="flex items-start justify-between">
            <div>
               <div className="space-y-1 mt-2">
                  <p className="flex items-center gap-2 text-sm font-semibold"><MapPin className="w-4 h-4 text-muted-foreground" />{property.location}</p>
                  <h3 className="text-lg font-semibold tracking-normal">{property.name}</h3>
               </div>
               <div className="flex items-center gap-2 py-2">
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Bed className="w-3 h-3" />
                     {property.beds}
                  </p>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Bath className="w-3 h-3 " />
                     {property.baths}
                  </p>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Ruler className="w-3 h-3" />
                     {property.sqft.toLocaleString()} sq ft
                  </p>
               </div>
               <p className="text-lg font-semibold tracking-normal opacity-80">
                  {formatPrice(property.price, { notation: "standard" })}
               </p>
            </div>
            
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mt-2">
                     <MoreVertical className="w-4 h-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                     <Edit className="text-muted-foreground w-3 h-3 mr-1" />
                     Edit Listing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive cursor-pointer">
                     <Trash2 className="w-3 h-3 mr-1" />
                     Delete Listing
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   )
}