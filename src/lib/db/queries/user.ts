import { auth } from "@/auth"
import { db } from ".."

export const getUserByEmail = async (email: string) => {
   try {
      const user = await db.user.findUnique({
         where: {
            email
         }
      })
      
      return user
   } catch(err) {
      return null
   }  
}

async function user() {
   const user = await getUserByEmail("tundeorekoya1@gmail.com")
}

export const getUserById = async (id: string) => {
   try {
      const user = await db.user.findUnique({
         where: {
            id
         },
      })
      
      return user
   } catch(err) {
      return null
   }  
}

export const getUsers = async () => {
   const session = await auth()
   
   if(!session?.user) return []
   
   try {
      const users = await db.user.findMany({
         orderBy: {
            createdAt: "desc"
         },
         where: {
            NOT: {
               id: session.user.id
            }
         },
      })
      
      return users
   } catch (error) {
      return []
   }
}

export const currentUser = async () => {
   const session = await auth()
   if (!session?.user) return null
   
   try {
      const user = await getUserById(session.user.id as string)
      
      return user
   } catch (error) {
      return null
   }
}
