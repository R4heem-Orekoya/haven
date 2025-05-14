import EditListing from "@/components/edit-listing"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { notFound, redirect, unauthorized } from "next/navigation"

interface Props {
   params: Promise<{
      id: string
   }>
}

export default async function Page({ params }: Props) {
   const signedInUser = await currentUser()
   
   if(!signedInUser) {
      redirect("/sign-in")
   }
   
   const propertyId = (await params).id
   
   console.log(propertyId);
   
   
   const property = await db.property.findUnique({
      where: {
         id: propertyId
      },
      include: {
         images: true
      }
   })
   
   if(!property || !property.id) {
      return notFound()
   }
   
   if(property.userId !== signedInUser.id) {
      return unauthorized()
   } 

   return (
      <EditListing initialData={property}/>
   )
}
