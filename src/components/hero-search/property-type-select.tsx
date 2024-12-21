"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { propertyTypes } from "@/consts/property-types"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { TSearchSchema } from "@/lib/validators/search-schema"
import { FieldErrors, UseFormSetValue } from "react-hook-form"

interface PropertyTypeProps {
   setValue: UseFormSetValue<TSearchSchema>
   errors: FieldErrors<TSearchSchema>
}

const PropertyType = ({ setValue, errors }: PropertyTypeProps) => {
   const [open, setOpen] = useState(false)
   const [type, setType] = useState<string>("")
   
   return (
      <div className="flex flex-col gap-2">
         <Label className="text-xs font-medium">Property Type</Label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("justify-between", { "border-destructive": errors.propertyType })}
               >
                  {type
                     ? propertyTypes.find((propertyType) => propertyType.value === type)?.label
                     : "Select property type ..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
               <Command>
                  <CommandInput placeholder="Search property type..." />
                  <CommandList>
                     <CommandEmpty>No property type found.</CommandEmpty>
                     <CommandGroup>
                        {propertyTypes.map((propertyType) => (
                           <CommandItem
                              key={propertyType.value}
                              className="cursor-pointer"
                              value={propertyType.value}
                              onSelect={(currentValue) => {
                                 setType(currentValue === type ? "" : currentValue)
                                 setValue("propertyType", currentValue === type ? "" : currentValue)
                                 setOpen(false)
                              }}
                           >
                              <Check
                                 className={cn(
                                    "mr-1 h-4 w-4",
                                    type === propertyType.value ? "opacity-100" : "opacity-0"
                                 )}
                              />
                              {propertyType.label}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         <p className="text-xs font-medium text-destructive">{errors.propertyType?.message && "This field is required"}</p>
      </div>
   )
}

export default PropertyType
