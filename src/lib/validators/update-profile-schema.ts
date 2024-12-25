import { z } from "zod";

export const updateProfileSchema = z.object({
   name: z.string().min(1, { message: "This field cannot be empty!" }),
   address: z.string().optional(),
   bio: z.string().optional(),
   phoneNumber: z.string().optional(),
   personalWebsiteUrl: z.string().optional(),
   scheduleAppUrl: z.string().optional()
})

export const changePasswordSchema = z.object({
   oldPassword: z.string().min(1, { message: "This field cannot be empty!" }),
   newPassword: z.string().min(8, { message: "Password should be atleast 8 characters long!" }),
})

export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>
export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>