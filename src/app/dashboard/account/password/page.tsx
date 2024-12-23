"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { changePasswordSchema, TChangePasswordSchema } from "@/lib/validators/update-profile-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import AuthSuccess from "@/components/auth/success"
import AuthError from "@/components/auth/error"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { updatePasswordAction } from "@/actions/profile-update"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const Page = () => {
   const { register, handleSubmit, formState: { errors }} = useForm<TChangePasswordSchema>({
      resolver: zodResolver(changePasswordSchema)
   })
   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()
   const [isSubmitting, setIsSubmitting] = useState(false)
   
   const [isVisible, setIsVisible] = useState(false);
   
   const toggleVisibility = () => setIsVisible((prevState) => !prevState)
   
   const onsubmit = async (data: TChangePasswordSchema) => {
      setIsSubmitting(true)
      
      updatePasswordAction(data)
         .then((callback) => {
            setError(callback.error)
            setSuccess(callback.success)
         })
         .catch(() => {
            toast.error("An error occurred. Please try again.")
         })
         .finally(() => setIsSubmitting(false))
   }
   
   return (
      <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
         <div className="grid gap-2">
            <Label htmlFor="old_password">
               Old Password
            </Label>
            <Input {...register("oldPassword")} type={isVisible ? "text" : "password"} id="old_password" className={cn({"text-xl" : !isVisible })}/>
            {errors.oldPassword && <p className="text-red-500 text-xs">{errors.oldPassword.message}</p>}
         </div>
         <div className="grid gap-2">
            <Label htmlFor="new_password">
               New Password
            </Label>
            <Input {...register("newPassword")} type={isVisible ? "text" : "password"} id="new_password" className={cn({"text-xl" : !isVisible })}/>
            {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}
         </div>
         
         <div className="flex items-center gap-2">
            <Checkbox id="show_password" onCheckedChange={toggleVisibility}/>
            <Label htmlFor="show_password" className="cursor-pointer">
               Show Password
            </Label>
         </div>
         
         <AuthSuccess message={success}/>
         <AuthError message={error}/>
         
         <div className="flex pt-4">
            <Button disabled={isSubmitting} type="submit" className="rounded-3xl ml-auto">
               Update Password
               {isSubmitting && <Loader2 className="w-4 h-4 ml-1 animate-spin"/>}
            </Button>
         </div>
      </form>
   )
}

export default Page
