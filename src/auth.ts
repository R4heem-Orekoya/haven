import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { getUserByEmail, getUserById } from "@/lib/db/queries/user"
import { signInSchema } from "./lib/validators/auth-schema"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(db),
   session: { strategy: "jwt" },
   pages: {
      signIn: "/sign-in",
      error: "/error"
   },
   events: {
      async linkAccount({ user }) {
         await db.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
         })
      }
   },
   callbacks: {
      //TODO: Send verification email "i don't have a domain to use :("
      // async signIn({ user, account }) {
      //   //Allow OAuth without email verification
      //   if(account?.provider !== "credentials") return true

      //   const dbUser = await getUserById(user.id as string)

      //   //Prevent sign in without verification
      //   if(!dbUser || !dbUser.emailVerified) return false

      //   //TODO: Add 2FA Check

      //   return true
      // },

      async session({ token, session }) {
         if (token.sub && session.user) {
            session.user.id = token.sub
         }
         return session
      },

      async jwt({ token }) {
         if (!token.sub) return token

         const dbUser = await getUserById(token.sub)

         if (!dbUser) return token

         return token
      }
   },
   trustHost: true,
   debug: process.env.NODE_ENV === 'development',
   secret: process.env.AUTH_SECRET,
   providers: [
      credentials({
         async authorize(credentials) {
            const validatedCredentials = signInSchema.safeParse(credentials)

            if (validatedCredentials.success) {
               const { email, password } = validatedCredentials.data

               const dbUser = await getUserByEmail(email)

               // Check if the email exists in the database
               if (!dbUser) {
                  throw new Error("User with this email does not exist!")
               }

               // Check if the user is associated with a different login provider
               if (!dbUser.hashedPassword) {
                  throw new Error("This email is associated with another login provider!")
               }

               const isPasswordMatch = await bcrypt.compare(password, dbUser.hashedPassword)

               if (!isPasswordMatch) {
                  throw new Error("Invalid credentials!")
               }

               return dbUser
            }

            return null
         }
      })
   ]
})