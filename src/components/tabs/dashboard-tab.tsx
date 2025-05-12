import { currentUser } from "@/lib/db/queries/user";
import Tab from "./tab";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardTab() {
   const signedInUser = await currentUser()
   
   if(!signedInUser || !signedInUser.id) redirect("/login")
      
   const userWithFavorites = await db.user.findMany({
      where: {
         id: signedInUser.id
      },
      include: {
         favoriteProperties: {
            include: {
               images: true
            }
         }
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
   
   const savedProperties = userWithFavorites[0].favoriteProperties || []
   
   return (
      <Tab 
         signedInUser={signedInUser} 
         savedProperties={savedProperties}
         userProperties={userProperties}
      />
   );
}

