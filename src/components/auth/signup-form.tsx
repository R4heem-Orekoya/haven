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
import { useRouter } from "next/navigation"
import AuthError from "./error"
import AuthSuccess from "./success"

const accountTypes = [
   { id: "r1", value: "individual", label: "Individual (searching for property)" },
   { id: "r3", value: "property_developer", label: "Property Developer" },
   { id: "r4", value: "estate_agent", label: "Estate Agent" },
]

const SignUpForm = () => {
   const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<TSignUpSchema>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         accountType: "individual",
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
         <div className="w-full max-w-[380px] py-8">
            <div className="text-center">
               <h1 className="text-2xl font-semibold">Welcome to Haven</h1>
               <p className="text-sm text-muted-foreground">Already have an account? <Link href="/sign-in" className="text-primary font-medium hover:underline">Sign In</Link></p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
               <div className="grid gap-2">
                  <Label>Name<span className="text-red-500">*</span></Label>
                  <Input {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Email<span className="text-red-500">*</span></Label>
                  <Input type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Password<span className="text-red-500">*</span></Label>
                  <Input type="password" className="text-2xl" {...register("password")} />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
               </div>
               <div className="grid gap-2">
                  <Label>Confirm Password<span className="text-red-500">*</span></Label>
                  <Input type="password" className="text-2xl" {...register("confirmPassword")} />
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
                        <Label key={type.id} htmlFor={type.id} className="flex items-center gap-2 rounded-lg border border-input p-3 has-[[data-state=checked]]:border-ring">
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

               <AuthError message={error} />
               <AuthSuccess message={success} />

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

export default SignUpForm