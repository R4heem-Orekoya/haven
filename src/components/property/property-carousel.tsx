"use client"

import { Image as TImage } from "@prisma/client"
import Image from "next/image"
import { useState } from "react"
import SavePropertyButton from "./save-property-button"
import { Loader2, MapPin } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"

interface PropertyCarouselProps {
   images: TImage[]
   propertyId: string
   location: string
}

const PropertyCarousel = ({ images, location, propertyId }: PropertyCarouselProps) => {
   const [selectedIndex, setSelectedIndex] = useState(0)

   return (
      <div className="col-span-1 max-h-fit">
         <div className="relative rounded-xl overflow-hidden border">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-start justify-between w-[calc(100%-28px)]">
               <SavePropertyButton propertyId={propertyId} />

               <div className="px-2 py-1 flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-3xl">
                  <MapPin className="w-3 h-3" />
                  {location}
               </div>
            </div>
            <div className="relative aspect-square bg-neutral-200">
               {images[selectedIndex].status === "failed" && (
                  <p>Image Upload Failed</p>
               )}
               {images[selectedIndex].status === "processing" && (
                  <Loader2 className="w-8 h-8 animate-spin" />
               )}
               {images[selectedIndex].status === "uploaded" && images[selectedIndex].url && (
                  <Image
                     src={images[selectedIndex].url}
                     alt="Property Image thumbnail" fill
                     className="object-cover"
                  />
               )}
            </div>
         </div>

         <Carousel className="mt-4 sm:mt-6 w-full">
            <CarouselContent>
               {images.map((image, index) => (
                  <CarouselItem
                     key={image.id}
                     onClick={() => setSelectedIndex(index)}
                     className="basis-1/3"
                  >
                     <div className="relative aspect-square cursor-pointer">
                        {image.status === "failed" && (
                           <p>Image Upload Failed</p>
                        )}
                        {image.status === "processing" && (
                           <Loader2 className="w-8 h-8 animate-spin" />
                        )}
                        {image.status === "uploaded" && image.url && (
                           <Image 
                              src={image.url} 
                              alt="image" fill 
                              className="object-cover w-full h-full rounded-lg" 
                           />
                        )}
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 z-[90]" />
            <CarouselNext className="right-0 z-[90]" />
         </Carousel>
      </div>
   )
}

export default PropertyCarousel