"use server"

import { db } from "@/lib/db";
import { currentUser } from "@/lib/db/queries/user";
import { changePasswordSchema, TChangePasswordSchema } from "@/lib/validators/update-profile-schema";
import bcrypt from "bcryptjs";

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
   
   await db.user.update({
      where: {
         id: signedInUser.id
      },
      data: {
         hashedPassword: hashedNewPassword
      }
   })
   
   return { success: "Password updated successfully!" }
}