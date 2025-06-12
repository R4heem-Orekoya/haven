import PropertyCarousel from "@/components/property/property-carousel"
import PropertyDetails from "@/components/property/property-details"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { notFound } from "next/navigation"

interface Props {
   params: Promise<{
      id: string
   }>
}

export async function generateStaticParams() {
   const properties = await db.property.findMany({
      select: {
         id: true
      },
      take: 100
   })
   return properties
}

const Page = async ({ params }: Props) => {
   const signedInUser = await currentUser()
   const id = (await params).id

   const property = await db.property.findFirst({
      where: {
         id
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
         <PropertyCarousel 
            images={images} 
            property={property}
         />

         <PropertyDetails
            property={property}
            signedInUser={signedInUser}
         />
      </main>
   )
}

export default Page