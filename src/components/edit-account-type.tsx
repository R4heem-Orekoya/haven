"use client"

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@prisma/client";
import { Button } from "./ui/button";
import AuthInfo from "./auth/info";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateAccountTypeAction } from "@/actions/profile-update";
import { toast } from "sonner";

interface EditAccountTypeProps {
   signedInUser: User;
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

const EditAccountType = ({ signedInUser }: EditAccountTypeProps) => {
   const [selectedAccountType, setSelectedAccountType] = useState(signedInUser?.accountType);
   const [isSubmitting, setIsSubmitting] = useState(false)
   
   const handleSubmit = async () => {
      setIsSubmitting(true)
      updateAccountTypeAction(selectedAccountType)
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
      <div>
         <RadioGroup 
            className="gap-2" value={selectedAccountType}
            onValueChange={(value: "individual" | "estate_agent" | "property_owner" | "property_developer") => setSelectedAccountType(value)}
         >
            {accountTypes.map((type, i) => (
               <div key={type.id} className={cn("relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring", {
                  "hidden" : signedInUser.accountType !== "individual" && i === 0,
               })}>
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
         
         {signedInUser.accountType === "individual" && (
            <div className="mt-6 space-y-4">
               <AuthInfo 
                  message="If you update your account type to Property Developer or Estate Agent, 
                  you will not be able to revert to an Individual account."
               />
            </div>
         )}
         
         <div className="mt-4 flex">
            <Button 
               disabled={isSubmitting || selectedAccountType === signedInUser?.accountType} 
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
