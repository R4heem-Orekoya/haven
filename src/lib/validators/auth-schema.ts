import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, { message: "This field cannot be empty!" }),
  email: z.string().min(1, { message: "This field cannot be empty!" }).email({ message: "Please enter a valid email address!" }),
  password: z.string().min(8, { message: "Password should be atleast 8 characters long!" }),
  confirmPassword: z.string(),
  accountType: z.enum(["individual", "property_owner", "property_developer", "estate_agent"])
})
   .refine((data) => {
      if(!data.confirmPassword) {
         return false
      }
      return true
   }, {
      message: "This field is required!",
      path: ["confirmPassword"]
   }).refine((data) => {
      if(data.confirmPassword !== data.password) {
         return false
      }
      return true
   }, {
      message: "Password don't match!",
      path: ["confirmPassword"]
   })
   
   
   
export const signInSchema = z.object({
   email: z.string().email({message: "Enter a valid email."}),
   password: z.string().min(1, {message: "This field cannot be empty."})
})

export type TSignInSchema = z.infer<typeof signInSchema>
export type TSignUpSchema = z.infer<typeof signUpSchema> 