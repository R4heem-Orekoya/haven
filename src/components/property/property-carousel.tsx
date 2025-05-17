"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { PropertyWithFavoritesAndImages } from "@/types/property"
import { cn } from "@/lib/utils"
import PlaceHolderImage from "../../../public/placeholder.svg"
import { Image as TImage } from "@prisma/client"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { Button } from "../ui/button"

import SwiperCore from "swiper"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import { Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/thumbs"

interface PropertyCarouselProps {
   property: PropertyWithFavoritesAndImages;
   images: TImage[]
}

export default function PropertyCarousel({ property, images }: PropertyCarouselProps){
   const [isDialogOpen, setIsDialogOpen] = useState(false)
   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null)
   const [currentIndex, setCurrentIndex] = useState(0)
    const swiperRef = useRef<SwiperCore | null>(null)

   return (
      <>
         <div className="grid md:grid-cols-2 gap-4 w-full">
            <div
               onClick={() =>
                  setIsDialogOpen(true)
               }
               className={
                  cn("relative col-span-1 bg-zinc-100 rounded-lg border overflow-hidden max-md:aspect-[4/3] cursor-pointer",
                     { "h-[450px]": property.images.length < 3 })
               }>
               <Image
                  src={images[0].status === "processing" ? PlaceHolderImage : images[0].url}
                  alt={`${property.title} thumbnail`}
                  fill
                  className={cn("object-cover", { "animate-pulse": images[0].status === "processing" })}
                  placeholder={property.images[0].hash ? "blur" : "empty"}
                  blurDataURL={images[0].hash ?? undefined}
               />
            </div>
            <div className="col-span-1 grid grid-cols-2 gap-4 max-md:hidden">
               {images.slice(1, 5).map((image, i) => (
                  <div
                     onClick={() =>
                        setIsDialogOpen(true)
                     }
                     key={image.id}
                     className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-zinc-100 cursor-pointer"
                  >
                     <Image
                        src={image.status === "processing" ? PlaceHolderImage : image.url}
                        alt={`${property.title} image`}
                        fill
                        className={cn("object-cover", { "animate-pulse": image.status === "processing" })}
                        placeholder={property.images[0].hash ? "blur" : "empty"}
                        blurDataURL={image.hash ?? undefined}
                     />
                     {property.images.length > 5 && i === property.images.slice(1, 5).length - 1 && (
                        <div className="absolute grid place-items-center inset-0 bg-black/60 backdrop-blur-sm">
                           <span className="text-4xl font-medium text-white">+{property.images.length - 5}</span>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent
               showCloseButton={false}
               className="max-w-screen h-screen sm:rounded-none border-none bg-black/80 flex flex-col justify-between"
            >
               <DialogHeader className="flex flex-row items-center justify-between w-full text-white">
                  <DialogTitle>
                     {currentIndex + 1} / {images.length}
                  </DialogTitle>

                  <Button 
                     onClick={() => {
                        setThumbsSwiper(null)
                        setIsDialogOpen(false)
                     }}
                     size="icon" 
                     variant="ghost"
                  >
                     <X />
                  </Button>
               </DialogHeader>
               
               {isDialogOpen && (
                  <Swiper
                     modules={[Thumbs]}
                     onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                     navigation
                     thumbs={{ swiper: thumbsSwiper }}
                     onSwiper={(swiper) => (swiperRef.current = swiper)}
                     className="w-full h-[80%] rounded-lg overflow-hidden"
                  >
                     {images.map((img) => (
                        <SwiperSlide key={img.id}>
                           <img
                              src={img.url ?? PlaceHolderImage}
                              alt={img.url as string}
                              className="w-full h-full object-contain"
                           />
                        </SwiperSlide>
                     ))}
                     <SliderControls />
                  </Swiper>
               )}

               {/* Swiper Thumbnails */}
               {isDialogOpen && (
                  <div className="mt-4">
                     <Swiper
                        modules={[Thumbs]}
                        onSwiper={setThumbsSwiper}
                        slidesPerView={3}
                        breakpoints={{
                           640: { slidesPerView: 3 },
                           768: { slidesPerView: 5 },
                           1024: { slidesPerView: 8 },
                        }}
                        spaceBetween={10}
                        watchSlidesProgress
                        className="w-full"
                     >
                        {images.map((img) => (
                           <SwiperSlide key={img.id} className="cursor-pointer">
                              <img
                                 src={img.url ?? PlaceHolderImage}
                                 alt=""
                                 className="w-full h-20 object-cover rounded border border-zinc-700"
                              />
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </>
   )
}

function SliderControls() {
   const swiper = useSwiper()
   const [isBeginning, setIsBeginning] = useState(true)
   const [isEnd, setIsEnd] = useState(false)

   useEffect(() => {
      const update = () => {
         setIsBeginning(swiper.isBeginning)
         setIsEnd(swiper.isEnd)
      }

      update()
      swiper.on("slideChange", update)

      return () => {
         swiper.off("slideChange", update)
      }
   }, [swiper])

   return (
      <div className="absolute top-1/2 -translate-y-1/2 z-20 w-full flex justify-between px-4">
         <Button
            onClick={() => swiper.slidePrev()}
            size="icon" variant="ghost"
            className="rounded-full"
            disabled={isBeginning}
         >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
         </Button>
         <Button
            onClick={() => swiper.slideNext()}
            size="icon" variant="ghost"
            className="rounded-full"
            disabled={isEnd}
         >
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
         </Button>
      </div>
   )
}