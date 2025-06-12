"use client"

import ShareToolTip from "@/components/property/share-tooltip"
import ProfilePicture from "@/components/profile-picture"
import { Button } from "@/components/ui/button"
import { Prisma, User } from "@prisma/client"
import { capitalizeFirstLetter, cn, formatPriceWithSuffix, isUserVerified, sluggify } from "@/lib/utils"
import { BadgeCheck, Banknote, Bath, Bed, Bookmark, Building, Calendar, CalendarDays, DollarSign, Globe, Home, Info, MapPin, MapPinned, Phone, Square } from "lucide-react"
import Link from "next/link"
import { savePropertyAction } from "@/actions/property"
import { toast } from "sonner"
import { useState } from "react"


interface PropertyCarouselProps {
   property: Prisma.PropertyGetPayload<{
      include: {
         images: true;
         user: true;
         favoredByUsers: true;
      };
   }>;
   signedInUser: User | null
}

const category = [
   { value: "rent", icon: <Home strokeWidth={1.6} className="w-4 h-4 sm:w-5 sm:h-5" /> },
   { value: "sale", icon: <DollarSign strokeWidth={1.6} className="w-4 h-4 sm:w-5 sm:h-5" /> },
   { value: "shortlet", icon: <Calendar strokeWidth={1.6} className="w-4 h-4 sm:w-5 sm:h-5" /> },
]

const PropertyDetails = ({ property, signedInUser }: PropertyCarouselProps) => {
   const [isFavorited, setIsFavorited] = useState(() =>
      signedInUser && property.favoredByUsers.some(user => user.id === signedInUser.id)
   );

   const amenities = property.amenities.split(",").map((item) => item.trim())

   const handleSave = async () => {
      const res = await savePropertyAction(property.id);

      if (res.error) toast.error(res.error);
      if (res.success) {
         toast.success(res.success);
         setIsFavorited((prev) => !prev);
      }
   };

   const isVerified = isUserVerified(property.user)
   
   return (
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-6 w-full">
         <div className="col-span-1 lg:col-span-5 rounded-lg py-4 space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4 pt-4">
               <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold">{property.title}</h1>
                  <p className="sm:text-lg text-muted-foreground font-medium mt-1">{property.location}</p>
               </div>
               <div className="flex items-center gap-3">
                  <Button onClick={handleSave} variant="outline" size="icon" className="rounded-3xl">
                     <Bookmark className={cn("w-4 h-4", { "fill-primary": isFavorited })} />
                  </Button>
                  <ShareToolTip propertySlug={property.slug} />
               </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 border rounded-xl overflow-hidden">
               {property.baths && (
                  <div className="lined-div relative lined-div p-3 sm:p-4 flex items-center gap-2">
                     <Bed strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                     <p className="text-sm sm:text-base xl:text-lg font-semibold">{property.beds + " Bed(s)"}</p>
                  </div>
               )}
               {property.baths && (
                  <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                     <Bath strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                     <p className="text-sm sm:text-base xl:text-lg font-semibold">{property.baths + " Bath(s)"}</p>
                  </div>
               )}
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  <Square strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{property.sqft + " Sqft(s)"}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  <Banknote strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{formatPriceWithSuffix(property.price, property.category, "compact")}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  <MapPinned strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{capitalizeFirstLetter(property.state)}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  <Building strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{capitalizeFirstLetter(property.type)}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  {category.find((cat) => cat.value === property.category)?.icon}
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">For {property.category}</p>
               </div>
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-semibold">Description</h2>
               <p className="sm:text-lg text-muted-foreground font-medium mt-2">
                  {property.description}
                  {property.description}
               </p>
            </div>
            {amenities.length > 0 && (
               <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-4">Amenities</h2>
                  <ul>
                     {amenities.map((amenity) => (
                        <li key={amenity} className="list-disc md:text-lg text-muted-foreground ml-5">{capitalizeFirstLetter(amenity)}</li>
                     ))}
                  </ul>
               </div>
            )}

            <div>
               <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-4">Details</h2>

               <div className="grid sm:grid-cols-2 md:grid-cols-1 border rounded-xl overflow-hidden">
                  <div className="relative lined-div p-3 sm:p-4 flex justify-between gap-4 items-center">
                     <p className="text-zinc-700 font-semibold">Property ID</p>
                     <p className="text-muted-foreground">{property.id}</p>
                  </div>
                  <div className="relative lined-div p-3 sm:p-4 flex justify-between gap-4 items-center">
                     <p className="text-zinc-700 font-semibold">Price</p>
                     <p className="text-muted-foreground">{formatPriceWithSuffix(property.price, property.category, "standard")}</p>
                  </div>
                  <div className="relative lined-div p-3 sm:p-4 flex justify-between gap-4 items-center">
                     <p className="text-zinc-700 font-semibold">Property Type</p>
                     <p className="text-muted-foreground">
                        {(property.type === "house" || property.type === "apartment") ? "Residence" : capitalizeFirstLetter(property.type)}
                     </p>
                  </div>
               </div>
            </div>

            <div className="rounded-lg bg-amber-200/50 border border-amber-300 px-4 py-3 text-amber-600 mt-4">
               <h3 className="text-lg font-semibold flex items-center">
                  <Info
                     className="-mt-0.5 me-3 inline-flex opacity-60"
                     size={16}
                     strokeWidth={2}
                     aria-hidden="true"
                  />
                  Disclaimer
               </h3>
               <p className="max-sm:text-sm mt-1">
                  {
                     `The information displayed about this property comprises a property advertisement.
                     Haven makes no warranty as to the accuracy or completeness of the advertisement
                     or any linked or associated information, and Haven Centre has no control over the content.
                     This property listing does not constitute property particulars.The information is provided
                     and maintained by ${property.user.name}. Haven shall not in any way be held
                     liable for the actions of any agent and/or property owner/landlord on or off this website.`
                  }
               </p>
            </div>
         </div>
         <div className="col-span-1 lg:col-span-2 aspect-square p-4 rounded-lg border lg:sticky top-16">
            <h2 className="text-lg font-semibold">Marketed By</h2>

            <div className="flex items-center gap-2 mt-3">
               <ProfilePicture
                  image={property.user.image}
                  name={property.user.name ?? "Property Developer"}
               />
               <Link
                  className="font-medium flex items-center gap-1"
                  href={`/${property.user.accountType}s/${property.user.id}`}
               >
                  {property.user.name}
                  {isVerified && (
                     <BadgeCheck className="fill-green-600 stroke-background w-4 h-4" />
                  )}
               </Link>
            </div>

            {property.user.address && (
               <p className="text-muted-foreground flex items-start gap-2 mt-3 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {property.user.address}
               </p>
            )}

            {property.user.bio && (
               <p className="text-muted-foreground flex items-start gap-2 mt-3">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-sm">{property.user.bio}</span>
               </p>
            )}

            {property.user.phoneNumber && (
               <p className="text-muted-foreground flex items-start gap-2 mt-3 text-sm line-clamp-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  {property.user.phoneNumber}
               </p>
            )}

            {property.user.personalWebsiteUrl && (
               <p className="text-muted-foreground flex items-center gap-2 mt-3 text-sm">
                  <Globe className="w-4 h-4 shrink-0" />
                  <Link
                     href={property.user.personalWebsiteUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:underline"
                  >
                     Visit Website
                  </Link>
               </p>
            )}

            {property.user.schedulingAppUrl && (
               <p className="text-muted-foreground flex items-center gap-2 mt-3 text-sm">
                  <CalendarDays className="w-4 h-4" />
                  <a
                     href={property.user.schedulingAppUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:underline"
                  >
                     Book a Meeting
                  </a>
               </p>
            )}
         </div>
      </div>
   )
}

export default PropertyDetails