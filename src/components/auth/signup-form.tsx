"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { signUpSchema, TSignUpSchema } from "@/lib/validators/auth-schema"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { signupAction } from "@/actions/auth"
import { useRouter } from 'nextjs-toploader/app';
import AuthError from "./error"
import AuthSuccess from "./success"
import { accountTypes } from "@/consts/account-type"
import { TAccountType } from "@/types"

interface SignUpFormProps {
   role: TAccountType
}

export default function SignUpForm({ role }: SignUpFormProps){
   const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<TSignUpSchema>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         accountType: role ?? "individual",
      },
   })

   const router = useRouter()

   const [isSubmitting, setIsSubmitting] = useState(false)
   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()

   const onSubmit = async (data: TSignUpSchema) => {
      setIsSubmitting(true)

      signupAction(data)
         .then(async (callback) => {
            setSuccess(callback.success)
            setError(callback.error)

            if (callback.success && !callback.error) {
               router.push("/sign-in")
            }
         })
         .catch((error) => {
            console.log(error);
         }).finally(() => {
            setIsSubmitting(false)
         })
   }
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 min-h-[calc(100vh-4rem)] grid place-items-center">
         <div className="w-full max-w-[350px] py-8">
            <div className="text-center">
               <h1 className="text-2xl font-semibold">Welcome to Haven</h1>
               <p className="text-sm text-muted-foreground">Already have an account? <Link href="/sign-in" className="text-primary font-medium hover:underline">Sign In</Link></p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
               <div className="grid gap-2">
                  <Label>Name<span className="text-red-500">*</span></Label>
                  <Input {...register("name")} className="rounded-3xl"/>
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Email<span className="text-red-500">*</span></Label>
                  <Input type="email" {...register("email")} className="rounded-3xl"/>
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Password<span className="text-red-500">*</span></Label>
                  <Input type="password" {...register("password")} className="rounded-3xl"/>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Confirm Password<span className="text-red-500">*</span></Label>
                  <Input type="password" {...register("confirmPassword")} className="rounded-3xl"/>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                     defaultValue={getValues("accountType")}
                     onValueChange={(value) => {
                        /*@ts-expect-errors some type shit*/
                        setValue("accountType", value)
                     }}
                     className="grid grid-cols-2 gap-3"
                  >
                     {accountTypes.map((type) => (
                        <Label key={type.id} htmlFor={type.id} className="flex items-center gap-2 rounded-full border border-input px-2 py-3 has-[[data-state=checked]]:border-ring">
                           <RadioGroupItem
                              id={type.id}
                              value={type.value}
                              className=""
                           />
                           <p className="text-xs">{type.label}</p>
                        </Label>
                     ))}
                  </RadioGroup>
               </div>
               
               <div className="max-w-[350px] overflow-hidden">
                  <AuthError message={error} />
                  <AuthSuccess message={success} />
               </div>

               <Button disabled={isSubmitting}>
                  Submit
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
               </Button>
            </form>

            <p className="text-sm mt-8">
               By registering you accept our Terms of Use and
               Privacy and agree that we and our selected partners
               may contact you with relevant offers and services.
            </p>
         </div>
      </main>
   )
}