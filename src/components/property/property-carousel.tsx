"use client"

import { Image as TImage } from "@prisma/client"
import Image from "next/image"
import { useRef, useState } from "react"
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperInstance } from "swiper";
import SavePropertyButton from "./save-property-button"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import 'swiper/css';
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface PropertyCarouselProps {
   images: TImage[]
   propertyId: string
   location: string
}

const PropertyCarousel = ({ images, location, propertyId }: PropertyCarouselProps) => {
   const [selectedIndex, setSelectedIndex] = useState(0)
   const swiperRef = useRef<SwiperInstance | null>(null)
   
   return (
      <div className="col-span-1">
         <div>
            <div className="relative rounded-xl overflow-hidden border">
               <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-start justify-between w-[calc(100%-28px)]">
                  <SavePropertyButton propertyId={propertyId}/>
                  
                  <div className="px-2 py-1 flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-3xl">
                     <MapPin className="w-3 h-3"/>
                     {location}
                  </div>
               </div>
               <div className="relative aspect-square">
                  <Image 
                     src={images[selectedIndex].url} 
                     alt="Property Image thumbnail" fill 
                     className="object-cover" 
                  />
               </div>
            </div>
            
            <Swiper
               className="mt-4 sm:mt-6 relative p-4 max-w-full max-h-[300px]"
               modules={[Pagination]}
               spaceBetween={20}
               slidesPerView={3}
               // loop
               onSwiper={(swiper) => {
                  swiperRef.current = swiper
               }}
            >
               {images.map((image, index) => (
                  <SwiperSlide
                     key={image.id} 
                     onClick={() => setSelectedIndex(index)}
                  >
                     <div className="relative aspect-square cursor-pointer">
                        <Image src={image.url} alt="image" fill className="object-cover w-full h-full rounded-lg"/>
                     </div>
                  </SwiperSlide>
               ))}
               
               <Button
                  onClick={() => swiperRef.current?.slidePrev()} 
                  size="icon" variant="outline" 
                  className={cn("rounded-full w-6 h-6 border border-border absolute top-1/2 -translate-y-1/2 left-0 z-[90]", { "hidden": images.length <= 3 })}
               >
                  <ChevronLeft className="w-3 h-3"/>
               </Button>
               <Button
                  onClick={() => swiperRef.current?.slideNext()} 
                  size="icon" variant="outline" 
                  className={cn("rounded-full w-6 h-6 border border-border absolute top-1/2 -translate-y-1/2 right-0 z-[90]", { "hidden": images.length <= 3 })}
               >
                  <ChevronRight className="w-3 h-3"/>
               </Button>
            </Swiper>
         </div>
      </div>
   )
}

export default PropertyCarousel