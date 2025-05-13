import { currentUser } from "@/lib/db/queries/user";
import Tab from "./tab";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardTab() {
   const signedInUser = await currentUser()
   
   if(!signedInUser || !signedInUser.id) redirect("/login")
   
   const savedProperties = await db.property.findMany({
      where: {
         favoredByUsers:{
            some:{
               id: signedInUser.id
            }
         }
      },
      include: {
         images: true,
         user: true,
      }
   })
   
   const userProperties = await db.property.findMany({
      where: {
         userId: signedInUser.id
      },
      include: {
         images: true
      }
   })
   
   return (
      <Tab 
         signedInUser={signedInUser} 
         savedProperties={savedProperties}
      />
   );
}