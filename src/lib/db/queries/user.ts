import { auth } from "@/auth"
import { db } from ".."
import { cache } from "react"
import { redis } from "@/lib/redis"
import { User } from "@prisma/client"

export const getUserByEmail = cache(async (email: string) => {
   try {
      const user = await db.user.findUnique({
         where: {
            email
         }
      })
      
      return user
   } catch(err) {
      console.log(err);
      return null
   }
})

export const getUserById = cache(async (id: string) => {
   try {
      const user = await db.user.findUnique({
         where: {
            id
         },
      })
      
      return user
   } catch(err) {
      console.log(err);
      return null
   }
})

export const currentUser = cache(async () => {
   const session = await auth()
   if (!session?.user) return null
   
   try {
      const redisUser = await redis.get(`user:${session.user.id}`)
      console.log(redisUser);
      
      if(redisUser) return redisUser as User
      
      const user = await getUserById(session.user.id as string) 
      redis.set(`user:${session.user.id}`, JSON.stringify(user), { ex: 3600 })
      
      return user
   } catch (error) {
      console.log(error);
      return null
   }
})