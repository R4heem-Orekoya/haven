"use server"

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/db/queries/user";
import { signInSchema, signUpSchema, TSignInSchema, TSignUpSchema } from "@/lib/validators/auth-schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth";

export const signupAction = async (data: TSignUpSchema) => {
   try {
      const validatedCredentials = signUpSchema.safeParse(data)
      
      if(!validatedCredentials.success){
         return { error: "Invalid fields, please make sure you fill the form correctly!" }
      }
      
      const { email, password, name, accountType } = validatedCredentials.data
      
      const existingUser = await getUserByEmail(email)
      
      if(existingUser) {
         return { error: "User with this email already exist!" }
      }
      
      const hashedPassword = await bcrypt.hash(password, 12)
      
      await db.user.create({
         data: {
            email,
            hashedPassword,
            name,
            accountType
         }
      })
      
      return { success: "Your account has been created!" }
   } catch (error) {
      // @ts-expect-error type never issues
      return { error: error.message }
   }
}

export const signinAction = async (credentials: TSignInSchema) => {
   const validatedCredentials = signInSchema.safeParse(credentials)
   
   if(!validatedCredentials.success){
      return { error: "Invalid Credentials, Please provide the correct credentials!" }
   }
   
   const { email, password } = validatedCredentials.data
   
   const existingUser = await getUserByEmail(email)
   
   if(!existingUser || !existingUser.email) {
      return { error: "User with this email does not exist!" }
   }
   
   //TODO: Send verification email "i don't have a domain to use :("
   // if(!existingUser.emailVerified) {
   //    const verificationToken = await generateVerificationToken(existingUser.email)
      
   //    return { success: "Verification email sent" }
   // }
   
   try {
      await signIn("credentials", {
         email, password,
         redirectTo: DEFAULT_LOGIN_REDIRECT
         //TODO: callbackUrl ||
      })
            
      return { success: "Signed in to your account successfully!" }
   } catch (error) {
      if(error instanceof AuthError){
         switch (error.type) {
            case "CredentialsSignin":
               return { error: "Invalid Credentials, Please provide the correct credentials!" }
            case "CallbackRouteError":
               return { error: error.cause?.err?.message }
            default:
               return { error: "Something went wrong!" }
         }
      }
      
      throw error
   }
}

export const logoutAction = async (redirectTo: string) => {
   await signOut({ redirectTo })
}