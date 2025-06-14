"use client"

import { cn, formatPriceWithSuffix } from "@/lib/utils"
import Image from "next/image"
import { Bath, Bed, Bookmark, Edit, Loader2, MoreVertical, Pen, Ruler, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { User } from "@prisma/client"
import { deletePropertyListing, savePropertyAction, togglePropoertyStatus } from "@/actions/property"
import { toast } from "sonner"
import { PropertyWithFavoritesAndImages, PropertyWithImage, PropertyWithUser } from "@/types/property"
import { useRouter } from 'nextjs-toploader/app';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import PlaceholderImage from "../../../public/placeholder.svg"

interface PropertyCardProps {
   property: PropertyWithFavoritesAndImages;
   signedInUser: User | null
}

interface PropertyListingCardProps {
   signedInUser: User;
   property: PropertyWithImage
}

export const PropertyCard = ({ property, signedInUser }: PropertyCardProps) => {
   const [isFavorited, setIsFavorited] = useState(() =>
      signedInUser ? property.favoredByUsers?.some(user => user.id === signedInUser.id) : false
   )
   const router = useRouter()

   const handleSave = async () => {
      if (!signedInUser) router.push("/sign-in")
         
      setIsFavorited(prev => !prev)

      const res = await savePropertyAction(property.id);

      if (res.error) {
         setIsFavorited(prev => !prev)
         toast.error(res.error);
      }
      if (res.success) {
         toast.success(res.success);
      }
   }

   return (
      <div
         onClick={() => {
            router.push(`/properties/${property.id}`)
         }}
         className="col-span-1 cursor-pointer"
      >
         <div className="relative aspect-[16/10] overflow-hidden rounded-lg border">
            <Image
               src={property.images[0].status === "processing" ? PlaceholderImage : property.images[0].url}
               alt={property.title + "thumbnail image"}
               fill
               className="object-cover"
               placeholder={property.images[0].hash ? "blur" : "empty"}
               blurDataURL={property.images[0].hash ?? undefined}
            />

            <Button onClick={(e) => {
               e.stopPropagation()
               handleSave()
            }} variant="secondary" size="icon" className="w-8 h-8 absolute top-4 right-4 rounded-3xl">
               <Bookmark className={cn("w-4 h-4", { "fill-primary": isFavorited })} />
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
            router.push(`/properties/${property.id}`)
         }}
      >
         <div className="relative aspect-[16/10] overflow-hidden border rounded-lg">
            <Image
               src={property.images[0].status === "processing" ? PlaceholderImage : property.images[0].url}
               alt={property.title + "thumbnail image"}
               fill
               className="object-cover"
               placeholder={property.images[0].hash ? "blur" : "empty"}
               blurDataURL={property.images[0].hash ?? undefined}
            />

            <Button onClick={(e) => {
               e.stopPropagation()
               handleSave()
            }} variant="secondary" size="icon" className="w-8 h-8 absolute top-4 right-4 rounded-3xl">
               <Bookmark className="w-4 h-4 fill-primary" />
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

export const PropertyListingCard = ({ property }: PropertyListingCardProps) => {
   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
   const [isDeleting, setIsDeleting] = useState(false)
   const router = useRouter()

   async function handleDelete(propertyId: string) {
      const res = await deletePropertyListing(propertyId)

      if (res.error) {
         toast.error(res.error)
      }
      if (res.success) {
         toast.success(res.success)
         router.refresh()
      }
   }

   async function handlePropertyStatus(propertyId: string) {
      const res = await togglePropoertyStatus(propertyId)

      if (res.error) {
         toast.error(res.error)
      }
      if (res.success) {
         toast.success(res.success)
         router.refresh()
      }
   }

   return (
      <>
         <div
            className="col-span-1 cursor-pointer"
            onClick={(e) => {
               e.stopPropagation()
               router.push(`/properties/${property.id}`)
            }}
         >
            <div className="relative aspect-[16/10] overflow-hidden border rounded-lg">
               <Image
                  src={property.images[0].status === "processing" ? PlaceholderImage : property.images[0].url}
                  alt={property.title + "thumbnail image"}
                  fill
                  className="object-cover"
                  placeholder={property.images[0].hash ? "blur" : "empty"}
                  blurDataURL={property.images[0].hash ?? undefined}
               />

               <div className="flex justify-between w-[calc(100%-2rem)] absolute top-4 left-4">
                  {property.status === "draft" && (
                     <Badge className="py-0.5">Draft</Badge>
                  )}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild onClick={(e) => {
                        e.stopPropagation()
                     }}>
                        <Button variant="secondary" size="icon" className="ml-auto w-8 h-8 hover:bg-secondary">
                           <MoreVertical className="w-4 h-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent
                        onClick={(e) => {
                           e.stopPropagation()
                        }}
                        align="end"
                     >
                        <DropdownMenuItem
                           onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/listing/edit/${property.id}`)
                           }}
                           className="cursor-pointer text-xs"
                        >
                           <Edit className="size-3" />
                           Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={(e) => {
                              e.stopPropagation()
                              handlePropertyStatus(property.id)
                           }}
                           className="cursor-pointer text-xs">
                           {property.status === "draft" ? (
                              <>
                                 <Pen className="size-3" />
                                 Publish
                              </>
                           ) : (
                              <>
                                 <Pen className="size-3" />
                                 Unpublish
                              </>
                           )}

                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={(e) => {
                              e.stopPropagation()
                              setShowDeleteDialog(true)
                           }}
                           className="cursor-pointer text-xs text-destructive"
                        >
                           <Trash2 className="size-3" />
                           Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
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
         <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property Listing</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete this property?
                     This action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                     variant="destructive"
                     className="flex items-center gap-2"
                     disabled={isDeleting}
                     onClick={async () => {
                        setIsDeleting(true)
                        await handleDelete(property.id)
                        setIsDeleting(false)
                        setShowDeleteDialog(false)
                     }}
                  >
                     Delete
                     {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   )
}