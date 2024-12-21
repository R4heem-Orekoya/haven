"use client"

import { useState } from "react"
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, } from "lucide-react"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { states } from "@/consts/states"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { TSearchSchema } from "@/lib/validators/search-schema"

interface LocationProps {
   setValue: UseFormSetValue<TSearchSchema>
   errors: FieldErrors<TSearchSchema>
}

const Location = ({ setValue, errors }: LocationProps) => {
   const [open, setOpen] = useState(false)
   const [location, setLocation] = useState("")

   return (
      <div className="flex flex-col gap-2">
         <Label className="text-xs font-medium">Location</Label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("justify-between", { "border-destructive": errors.location})}
               >
                  {location
                     ? states.find((state) => state.value === location)?.label
                     : "Select location ..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
               <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandList>
                     <CommandEmpty>No property type found.</CommandEmpty>
                     <CommandGroup>
                        {states.map((state) => (
                           <CommandItem
                              key={state.value}
                              className="cursor-pointer"
                              value={state.value}
                              onSelect={(currentValue) => {
                                 setLocation(currentValue === location ? "" : currentValue)
                                 setValue("location", currentValue === location ? "" : currentValue)
                                 setOpen(false)
                              }}
                           >
                              <Check
                                 className={cn(
                                    "mr-2 h-4 w-4",
                                    location === state.value ? "opacity-100" : "opacity-0"
                                 )}
                              />
                              {state.label}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         <p className="text-xs font-medium text-destructive">{errors.location?.message && "This field is required"}</p>
      </div>
   )
}

export default Location
