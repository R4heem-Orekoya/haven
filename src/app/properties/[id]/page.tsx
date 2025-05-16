import PropertyCarousel from "@/components/property/property-carousel"
import PropertyDetails from "@/components/property/property-details"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { notFound } from "next/navigation"
import PlaceHolderImage from "../../../../public/placeholder.svg"

interface Props {
   params: Promise<{
      id: string
   }>
}

const Page = async ({ params }: Props) => {
   const signedInUser = await currentUser()
   const id = (await params).id

   const property = await db.property.findFirst({
      where: {
         id: id
      },
      include: {
         images: {
            orderBy: {
               order: "asc"
            }
         },
         user: true,
         favoredByUsers: true
      }
   })
   
   if (!property) return notFound()

   const images = property.images.filter((img) => img.status !== "failed")

   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12">
         <div className="grid md:grid-cols-2 gap-4 w-full">
            <div className={cn("relative col-span-1 bg-zinc-100 rounded-lg border overflow-hidden max-md:aspect-[4/3] cursor-pointer", { "h-[450px]": property.images.length < 3 })}>
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
                  <div key={image.id} className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-zinc-100 cursor-pointer">
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

         <PropertyDetails
            property={property}
            signedInUser={signedInUser}
         />
      </main>
   )
}

export default Page