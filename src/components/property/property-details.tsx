import { Property } from "@prisma/client"
import ShareToolTip from "./share-tooltip"
import { capitalizeFirstLetter, formatPrice } from "@/lib/utils"
import { Banknote, Bath, Bed, Building, Calendar, DollarSign, Home, MapPinned, Square } from "lucide-react"
import { Fragment } from "react"


interface PropertyCarouselProps {
   params: {
      slug: string
   }
   property: Property
}

const category = [
   { value: "rent", icon: <Home strokeWidth={1.6} className="w-4 h-4 sm:w-5 sm:h-5" /> },
   { value: "sale", icon: <DollarSign strokeWidth={1.6} className="w-4 h-4 sm:w-5 sm:h-5" /> },
   { value: "shortlet", icon: <Calendar strokeWidth={1.6} className="w-4 h-4 sm:w-5 sm:h-5" /> },
]


const PropertyDetails = ({ property, params }: PropertyCarouselProps) => {
   const amenities = property.amenities.split(",").map((item) => item.trim())
   console.log(property.description.split("\n"))

   return (
      <div className="col-span-1 row-span-2 md:py-4 space-y-6">
         <div className="flex items-start justify-between gap-4">
            <div>
               <h1 className="text-xl md:text-2xl text-balance font-semibold">{property.title}</h1>
               <div className="flex items-center gap-2 mt-2 text-lg font-semibold text-muted-foreground">
                  {category.find((cat) => cat.value === property.category)?.icon}
                  <p>For {property.category}</p>
               </div>
            </div>

            <ShareToolTip propertySlug={params.slug} />
         </div>

         <div className="w-full">
            <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-3">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 bg-zinc-50 border rounded-xl overflow-hidden">
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
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{formatPrice(property.price)}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  <MapPinned strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{capitalizeFirstLetter(property.state)}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex items-center gap-2">
                  <Building strokeWidth={1.5} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm sm:text-base xl:text-lg font-semibold">{capitalizeFirstLetter(property.type)}</p>
               </div>
            </div>
         </div>

         <div>
            <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-3">Description</h2>
            <p className="md:text-lg text-muted-foreground whitespace-pre-wrap">
               {property.description.split("\n").map((line, index) => (
                  <Fragment key={index}>
                     {line}
                     <br />
                  </Fragment>
               ))}
            </p>
         </div>

         <div>
            <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-3">Amenities</h2>
            <ul>
               {amenities.map((amenity) => (
                  <li key={amenity} className="list-disc md:text-lg text-muted-foreground ml-5">{capitalizeFirstLetter(amenity)}</li>
               ))}
            </ul>
         </div>

         <div>
            <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-3">Details</h2>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-1 bg-zinc-50 border rounded-xl overflow-hidden">
               <div className="relative lined-div p-3 sm:p-4 flex justify-between gap-4 items-center">
                  <p className="text-zinc-700 font-semibold">Property ID</p>
                  <p className="text-muted-foreground">{property.id}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex justify-between gap-4 items-center">
                  <p className="text-zinc-700 font-semibold">Price</p>
                  <p className="text-muted-foreground">{formatPrice(property.price, { notation: "standard" })}</p>
               </div>
               <div className="relative lined-div p-3 sm:p-4 flex justify-between gap-4 items-center">
                  <p className="text-zinc-700 font-semibold">Property Type</p>
                  <p className="text-muted-foreground">
                     {(property.type === "house" || property.type === "apartment") ? "Residence" : capitalizeFirstLetter(property.type)}
                  </p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PropertyDetails