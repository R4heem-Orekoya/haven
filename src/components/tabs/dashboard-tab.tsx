import { currentUser } from "@/lib/db/queries/user";
import Tab from "./tab";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardTab() {
   const signedInUser = await currentUser()

   if (!signedInUser || !signedInUser.id) redirect("/sign-in")

   const savedPropertiesPromise = db.property.findMany({
      where: {
         favoredByUsers: {
            some: {
               id: signedInUser.id
            }
         }
      },
      include: {
         images: {
            orderBy: {
               order: "asc"
            }
         },
         user: true,
      },
      orderBy: {
         updatedAt: "desc"
      }
   })
   const userPropertiesPromise = db.property.findMany({
      where: {
         userId: signedInUser.id
      },
      include: {
         images: {
            orderBy: {
               order: "asc"
            }
         },
      },
      orderBy: {
         createdAt: "desc"
      }
   })

   const [savedProperties, userProperties] = 
   await Promise.all([savedPropertiesPromise, userPropertiesPromise])


   return (
      <Tab
         signedInUser={signedInUser}
         savedProperties={savedProperties}
         userProperties={userProperties}
      />
   );
}