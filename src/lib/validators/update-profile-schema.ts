import { z } from "zod";

export const changePasswordSchema = z.object({
   oldPassword: z.string().min(1, { message: "This field cannot be empty!" }),
   newPassword: z.string().min(8, { message: "Password should be atleast 8 characters long!" }),
})

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>