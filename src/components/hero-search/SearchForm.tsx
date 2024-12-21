"use client"

import { Button } from "@/components/ui/button"

import PropertyType from "./property-type-select"
import Location from "./location-select"
import PriceRange from "./price-range-select"
import { useForm } from "react-hook-form"
import { searchSchema, TSearchSchema } from "@/lib/validators/search-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { modes } from "@/consts/property-types"

const SearchForm = () => {
   const [mode, setMode] = useState<"buy" | "rent" | "shortlet">("buy")
   const { handleSubmit, setValue, formState: { errors } } = useForm<TSearchSchema>({
      resolver: zodResolver(searchSchema),
      defaultValues: {
         mode
      }
   })
   
   const onSubmit = async (data: TSearchSchema) => {
      console.log(data);
   }
   
   return (
      <div className="mt-8 max-w-[50rem] mx-auto">
         <div className="flex items-center bg-white w-fit divide-x-[1px] border-b rounded-lg rounded-bl-none rounded-br-none overflow-hidden">
            {modes.map((modeItem, i) => (
               <button
                  key={modeItem.value}
                  onClick={() => {
                     setMode(modeItem.value)
                     setValue("mode", modeItem.value)
                  }}
                  className={
                     cn("text-foreground px-4 py-2 text-sm hover:bg-zinc-100", { 
                        "rounded-tl-lg" : i === 0,
                        "rounded-tr-lg" : i === 2,
                        "bg-foreground text-background hover:bg-foreground/90" : mode === modeItem.value
                     })
                  }
               >
                  {modeItem.label}
               </button>
            ))}
         </div>
         
         <form onSubmit={handleSubmit(onSubmit)} className="bg-background p-4 rounded-lg rounded-tl-none text-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <PropertyType 
                  errors={errors} 
                  setValue={setValue}
               />
               <Location 
                  setValue={setValue}
                  errors={errors}
               />
               <PriceRange 
                  setValue={setValue} 
                  errors={errors}
               />
            </div>
            <Button className="mt-4 w-full">Search</Button>
         </form>
      </div>
   )
}

export default SearchForm
