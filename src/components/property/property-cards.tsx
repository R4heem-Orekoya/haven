import { cn, formatPrice, formatPriceWithSuffix } from "@/lib/utils"
import Image from "next/image"
import { Bath, Bed, Bookmark, Edit, MapPin, MoreVertical, Ruler, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { User } from "@prisma/client"
import { savePropertyAction } from "@/actions/property"
import { toast } from "sonner"
import { PropertyWithFavoritesAndImages, PropertyWithUser } from "@/types/property"
import { useRouter } from "next/navigation"

interface PropertyCardProps {
   property: PropertyWithFavoritesAndImages,
   signedInUser: User | null
}

export const PropertyCard = ({ property, signedInUser }: PropertyCardProps) => {
   const [isFavorited, setIsFavorited] = useState(() =>
      signedInUser && property.favoredByUsers?.some(user => user.id === signedInUser.id)
   );
   const router = useRouter()

   const handleSave = async () => {
      const res = await savePropertyAction(property.id);

      if (res.error) toast.error(res.error);
      if (res.success) {
         toast.success(res.success);
         setIsFavorited((prev) => !prev);
         router.refresh()
      }
   };

   return (
      <div
         onClick={() => {
            router.push(`/properties/${property.slug}`)
         }}
         className="col-span-1 cursor-pointer"
      >
         <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
               src={property.images[0].url!}
               alt={property.title + "thumbnail image"}
               fill
               className="object-cover"
            />

            <Button onClick={(e) => {
               e.stopPropagation()
               handleSave()
            }} variant="secondary" size="icon" className="w-8 h-8 absolute top-4 right-4 rounded-3xl">
               <Bookmark className={cn({ "fill-primary": isFavorited })} />
            </Button>
         </div>
         <div className="mt-2">
            <div className="flex justify-between items-start">
               <h3 className="text-lg font-semibold tracking-normal line-clamp-1">{property.title}</h3>
               <Badge variant="outline" className="px-2 whitespace-nowrap">
                  For {property.category}
               </Badge>
            </div>
            <p className="line-clamp-1">{property.location}</p>
         </div>
         <div className="flex items-center gap-2 py-1">
            {property.beds && (
               <>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Bed className="w-3 h-3" />
                     {property.beds}
                  </p>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
               </>
            )}
            {property.baths && (
               <>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Bath className="w-3 h-3 " />
                     {property.baths}
                  </p>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
               </>
            )}
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
               <Ruler className="w-3 h-3" />
               {property.sqft.toLocaleString()} sq ft
            </p>
         </div>
         <p className="text-lg font-semibold tracking-normal opacity-80">{formatPriceWithSuffix(property.price, property.category)}</p>
      </div>
   )
}

export const PropertyFavoriteCard = ({ property }: { property: PropertyWithUser }) => {
   const router = useRouter()

   const handleSave = async () => {
      const res = await savePropertyAction(property.id);

      if (res.error) toast.error(res.error);
      if (res.success) {
         toast.success(res.success);
         router.refresh()
      }
   }

   return (
      <div
         className="col-span-1 cursor-pointer"
         onClick={() => {
            router.push(`/properties/${property.slug}`)
         }}
      >
         <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
               src={property.images[0].url!}
               alt={property.title + "thumbnail image"}
               fill
               className="object-cover"
            />

            <Button onClick={(e) => {
               e.stopPropagation()
               handleSave()
            }} variant="secondary" size="icon" className="w-8 h-8 absolute top-4 right-4 rounded-3xl">
               <Bookmark className="fill-primary" />
            </Button>
         </div>
         <div className="mt-2">
            <div className="flex justify-between items-start">
               <h3 className="text-lg font-semibold tracking-normal line-clamp-1">{property.title}</h3>
               <Badge variant="outline" className="px-2 whitespace-nowrap">
                  For {property.category}
               </Badge>
            </div>
            <p className="line-clamp-1">{property.location}</p>
         </div>
         <div className="flex items-center gap-2 py-1">
            {property.beds && (
               <>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Bed className="w-3 h-3" />
                     {property.beds}
                  </p>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
               </>
            )}
            {property.baths && (
               <>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Bath className="w-3 h-3 " />
                     {property.baths}
                  </p>
                  <div className="w-[1px] h-[10px] bg-zinc-200" />
               </>
            )}
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
               <Ruler className="w-3 h-3" />
               {property.sqft.toLocaleString()} sq ft
            </p>
         </div>
         <p className="text-lg font-semibold tracking-normal opacity-80">{formatPriceWithSuffix(property.price, property.category)}</p>
      </div>
   )
}
