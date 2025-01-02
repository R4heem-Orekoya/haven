import PropertyCarousel from "@/components/property/property-carousel"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface Props {
   params: {
      slug: string
   }
}

const Page = async ({ params }: Props) => {
   const property = await db.property.findFirst({
      where: { 
         slug: params.slug
      },
      include: {
         images: true,
         user: true
      }
   })
   
   if(!property) return notFound()
   
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12">
         <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <PropertyCarousel 
               propertyId={property.id} 
               images={property.images} 
               location={property.location} 
            />
            <div className="col-span-1 max-md:aspect-square row-span-2 bg-green-300 rounded-lg">
               
            </div>
            <div className="col-span-1 aspect-square bg-yellow-300 rounded-lg">
               
            </div>
         </div>
      </main>
   )
}

export default Page