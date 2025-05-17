"use client"

import { signinAction } from "@/actions/auth"
import AuthError from "./error"
import AuthSuccess from "./success"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema, TSignInSchema } from "@/lib/validators/auth-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"


const SignInForm = () => {
   const { register, handleSubmit, formState: { errors } } = useForm<TSignInSchema>({
      resolver: zodResolver(signInSchema),
   })

   const [isSubmitting, setIsSubmitting] = useState(false)
   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()
   
   const onSubmit = async (data: TSignInSchema) => {
      setIsSubmitting(true)
      
      signinAction(data)
         .then((callback) => {
            setSuccess(callback?.success)
            setError(callback?.error)
         })
         .catch((err) => {
            console.log(err);
         })
         .finally(() => {
            setIsSubmitting(false)
         })
   }
   
   
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 min-h-[calc(100vh-4rem)] grid place-items-center">
         <div className="w-full max-w-[350px] py-8">
            <div className="text-center">
               <h1 className="text-2xl font-semibold">Login to your Haven Account</h1>
               <p className="text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/register" className="text-primary font-medium hover:underline">Sign Up</Link></p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
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

               <AuthError message={error} />
               <AuthSuccess message={success} />

               <Button disabled={isSubmitting}>
                  Submit
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
               </Button>
            </form>
         </div>
      </main>
   )
}

export default SignInForm
