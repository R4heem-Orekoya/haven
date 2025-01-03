import PropertyCarousel from "@/components/property/property-carousel"
import PropertyDetails from "@/components/property/property-details"
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

   if (!property) return notFound()

   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12">
         <div className="grid md:grid-cols-2 gap-6">
            <PropertyCarousel
               propertyId={property.id}
               images={property.images}
               location={property.location}
            />
            
            <PropertyDetails 
               property={property} 
               params={params}
            />

            <div className="col-span-1 p-4 bg-yellow-300 rounded-lg">
            </div>
         </div>
      </main>
   )
}

export default Page