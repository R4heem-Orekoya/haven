"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@prisma/client";
import { Button } from "./ui/button";
import AuthInfo from "./auth/info";
import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { updateAccountTypeAction } from "@/actions/profile-update";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { TAccountType } from "@/types";

interface EditAccountTypeProps {
   signedInUserPromise: Promise<User>;
}

const accountTypes = [
   {
      id: "r1",
      value: "individual",
      label: "Individual (searching for property)",
      description: "An individual user looking to buy, rent, or shortlet properties."
   },
   {
      id: "r3",
      value: "property_developer",
      label: "Property Developer",
      description: "A user involved in developing and selling real estate projects."
   },
   {
      id: "r4",
      value: "estate_agent",
      label: "Estate Agent",
      description: "A professional facilitating property sales, rentals, or management."
   }
];

const EditAccountType = ({ signedInUserPromise }: EditAccountTypeProps) => {
   const signedInUser = use(signedInUserPromise)
   
   const [selectedAccountType, setSelectedAccountType] = useState(signedInUser?.accountType);
   const [accountVisibility, setAccountVisibility] = useState(signedInUser?.accountVisibility);
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [isDisabled, setIsDisabled] = useState(true)
   
   const toggleAccountVisibility = () => {
      setAccountVisibility((prev) => !prev)
   }
   
   useEffect(() => {
      const hasChanged = accountVisibility !== signedInUser?.accountVisibility || selectedAccountType !== signedInUser?.accountType;
      setIsDisabled(!hasChanged)
   }, [accountVisibility, selectedAccountType])
   
   const handleSubmit = async () => {
      setIsSubmitting(true)
      updateAccountTypeAction({ accountType: selectedAccountType, accountVisibility })
         .then((callback) => {
            if(callback.success && !callback.error) {
               toast.success(callback.success)
            }
            if(!callback.success && callback.error) {
               toast.error(callback.error)
            }
         })
         .catch(() => {
            toast.error("An error occurred. Please try again.")
         })
         .finally(() => {
            setIsSubmitting(false)
         })
   }
   
   return (
      <div className="space-y-6">
         <RadioGroup 
            className="gap-2" value={selectedAccountType}
            onValueChange={(value: TAccountType) => setSelectedAccountType(value)}
         >
            {accountTypes.map((type) => (
               <div key={type.id} className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
                  <RadioGroupItem
                     value={type.value}
                     id={type.id}
                     className="order-1 after:absolute after:inset-0"
                  />
                  <div className="grid grow gap-2">
                     <Label htmlFor={type.id}>
                        {type.label}
                     </Label>
                     <p className="text-xs text-muted-foreground">
                        {type.description}
                     </p>
                  </div>
               </div>
            ))}
         </RadioGroup>
         
         <div className="flex items-center gap-2">
            <Checkbox id="account_visibility" defaultChecked={accountVisibility} onCheckedChange={toggleAccountVisibility}/>
            <Label htmlFor="account_visibility" className="cursor-pointer">
               Account Visibilty
            </Label>
         </div>
         
         <AuthInfo 
            message={`If account visibility is checked and you are either an estate agnet or a property developer, your account will be visible on the property developers or estate agents page.`}/>
         
         <div className="flex">
            <Button 
               disabled={isSubmitting || isDisabled} 
               className="rounded-3xl ml-auto"
               onClick={handleSubmit}
            >
               Save Changes
               {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
            </Button>
         </div>
      </div>
   )
}

export default EditAccountType
