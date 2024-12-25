"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TUpdateProfileSchema, updateProfileSchema } from "@/lib/validators/update-profile-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import AuthSuccess from "./auth/success"
import AuthError from "./auth/error"
import { updateProfileAction } from "@/actions/profile-update"
import { toast } from "sonner"

interface EditProfileFormProps {
   signedInUser: User
}

const EditProfileForm = ({ signedInUser }: EditProfileFormProps) => {
   const { register, handleSubmit, control, formState: { errors }} = useForm<TUpdateProfileSchema>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         name: signedInUser.name || "",
         address: signedInUser.address || "",
         bio: signedInUser.bio || "",
         phoneNumber: signedInUser.phoneNumber || "",
         personalWebsiteUrl: signedInUser.personalWebsiteUrl || "",
         scheduleAppUrl: signedInUser.schedulingAppUrl || "",
      }
   })
   
   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [isDisabled, setIsDisabled] = useState(true);
   
   const formValues = useWatch({ control: control });
   
   useEffect(() => {
      const hasChanged =
         (formValues.name || "") !== (signedInUser.name || "") ||
         (formValues.address || "") !== (signedInUser.address || "") ||
         (formValues.bio || "") !== (signedInUser.bio || "") ||
         (formValues.phoneNumber || "") !== (signedInUser.phoneNumber || "") ||
         (formValues.personalWebsiteUrl || "") !== (signedInUser.personalWebsiteUrl || "") ||
         (formValues.scheduleAppUrl || "") !== (signedInUser.schedulingAppUrl || "");
         
      setIsDisabled(!hasChanged);
   }, [formValues, signedInUser]);
   
   const onsubmit = async (data: TUpdateProfileSchema) => {
      setIsSubmitting(true)
      updateProfileAction(data)
         .then((callback) => {
            setError(callback.error)
            setSuccess(callback.success)
         })
         .catch(() => {
            toast.error("Something went wrong. Please try again.")
         })
         .finally(() => {
            setIsSubmitting(false)
         })
   }
   
   return (
      <form onSubmit={handleSubmit(onsubmit)} className="grid gap-4">
         <div className="grid gap-2">
            <Label htmlFor="name">
               Name <span className="text-red-500">*</span>
            </Label>
            <Input {...register("name")} id="name" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
         </div>
         <div className="grid gap-2">
            <Label htmlFor="address">
               Address
            </Label>
            <Input {...register("address")} id="address" />
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
         </div>
         <div className="grid gap-2">
            <Label htmlFor="address">
               Bio
            </Label>
            <Textarea {...register("bio")} className="min-h-[70px] max-h-[250px]" />
            {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
            <p className="text-xs text-muted-foreground">
               Brief summary of your profile (This can be useful if you are an estate agent or a property developer.)
            </p>
         </div>
         <div className="grid gap-2">
            <Label htmlFor="phone_number">
               Phone Number
            </Label>
            <Input {...register("phoneNumber")} id="phone_number" />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
         </div>
         <div className="grid gap-2">
            <Label htmlFor="personal_website">
               Personal Website
            </Label>
            <Input {...register("personalWebsiteUrl")} type="url" id="personal_website" />
            {errors.personalWebsiteUrl && <p className="text-red-500 text-xs">{errors.personalWebsiteUrl.message}</p>}
         </div>
         <div className="grid gap-2">
            <Label htmlFor="schedule_url">
               Cal.com or Calendly URL
            </Label>
            <Input {...register("scheduleAppUrl")} type="url" id="schedule_url" />
            {errors.scheduleAppUrl && <p className="text-red-500 text-xs">{errors.scheduleAppUrl.message}</p>}
         </div>
         
         <AuthSuccess message={success}/>
         <AuthError message={error}/>

         <div className="flex mt-4">
            <Button disabled={isDisabled || isSubmitting} className="w-fit ml-auto rounded-3xl">
               Save Profile
               {isSubmitting && <Loader2 className="w-4 h-4 ml-1 animate-spin"/>}
            </Button>
         </div>
      </form>
   )
}

export default EditProfileForm