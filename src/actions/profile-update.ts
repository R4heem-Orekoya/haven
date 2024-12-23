"use server"

import { db } from "@/lib/db";
import { currentUser } from "@/lib/db/queries/user";
import { changePasswordSchema, TChangePasswordSchema, TUpdateProfileSchema, updateProfileSchema } from "@/lib/validators/update-profile-schema";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const updateProfileAction = async (data: TUpdateProfileSchema) => {
   const signedInUser = await currentUser()
   
   if(!signedInUser || !signedInUser.email) {
      return { error: "Unauthorised" }
   }
   
   const validatedData = updateProfileSchema.safeParse(data)
   
   if(!validatedData.success) {
      return { error: "Invalid input. Please check your data and try again." }
   }
   
   const { name, address, bio, personalWebsiteUrl, scheduleAppUrl } = validatedData.data
   
   await db.user.update({
      where: {
         id: signedInUser.id
      },
      data: {
         name,
         address,
         bio,
         personalWebsiteUrl,
         schedulingAppUrl: scheduleAppUrl
      }
   })
   
   revalidatePath("/dashboard/account/profile")
   
   return { success: "Profile updated successfully!" }
}

export const updatePasswordAction = async (data: TChangePasswordSchema) => {
   const signedInUser = await currentUser()
   
   if(!signedInUser || !signedInUser.email) {
      return { error: "Unauthorised" }
   }
   
   const validatedData = changePasswordSchema.safeParse(data)
   
   if(!validatedData.success) {
      return { error: "Invalid input. Please check your data and try again." }
   }
   
   const { oldPassword, newPassword } = validatedData.data
   
   const isOldPasswordCorrect = await bcrypt.compare(oldPassword, signedInUser.hashedPassword!)
   
   if(!isOldPasswordCorrect ) {
      return { error: "Invalid credentials. Please try again." }
   }
   
   const hashedNewPassword = await bcrypt.hash(newPassword, 12);
   const isNewPasswordSameAsOldPassword = await bcrypt.compare(newPassword, signedInUser.hashedPassword!)
   
   if(isNewPasswordSameAsOldPassword) {
      return { error: "Passwords cannot be the same! Please input a new strong password." }
   }   
   
   await db.user.update({
      where: {
         id: signedInUser.id
      },
      data: {
         hashedPassword: hashedNewPassword
      }
   })
   
   revalidatePath("/dashboard/account/password")
   
   return { success: "Password updated successfully!" }
}