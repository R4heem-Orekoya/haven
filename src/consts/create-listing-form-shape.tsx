import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TPropertySchema } from "@/lib/validators/property-schema"
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form"
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { states } from "./states"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { propertyTypes } from "./property-types"

interface InputComponentProps {
   label: string,
   id: keyof TPropertySchema
   type: string
   register: UseFormRegister<TPropertySchema>,
   errors: FieldErrors<TPropertySchema>
   subLabel?: string
}

const InputComponent = ({ register, errors, label, id, type }: InputComponentProps) => {
   return (
      <div className="grid gap-2 bg-red-400">
         <Label htmlFor={id}>
            {label}
         </Label>
         <Input {...register(id)} name={id} id={id} type={type} min={1} />
         {errors["name"] && <p className="text-red-500 text-sm">{errors["name"].message}</p>}
      </div>
   )
}

const TextAreaComponent = ({ register, errors, label, id, subLabel }: InputComponentProps) => {
   return (
      <div className="grid gap-2">
         <Label htmlFor={id}>
            {label}
         </Label>
         <Textarea {...register(id)} placeholder="List amenities (e.g. pool, garage, garden)" name={id} id={id} className="textarea" />
         {!errors[id] && <p className="text-xs text-muted-foreground">
            {subLabel}
         </p>}
         {errors[id] && <p className="text-red-500 text-sm">{errors[id].message}</p>}
      </div>
   )
}

interface ComboBoxComponentProps {
   label: string
   id: keyof TPropertySchema
   options: { label: string, value: string }[] | undefined
   setValue: UseFormSetValue<TPropertySchema>
   errors: FieldErrors<TPropertySchema>
}

const ComboBoxComponent = ({ errors, id, label, options, setValue }: ComboBoxComponentProps) => {
   const [open, setOpen] = useState(false)
   const [selected, setSelected] = useState("")

   return (
      <div className="flex flex-col justify-between gap-2">
         <Label>{label}</Label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("justify-between h-9", { "border-destructive": errors[id]?.message })}
               >
                  {selected
                     ? options?.find((opt) => opt.value === selected)?.label
                     : `Select ${label.toLowerCase()} ...`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
               <Command>
                  <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                  <CommandList>
                     <CommandEmpty>{`No ${label.toLowerCase()} found`}.</CommandEmpty>
                     <CommandGroup>
                        {options?.map((opt) => (
                           <CommandItem
                              key={opt.value}
                              className="cursor-pointer"
                              value={opt.value}
                              onSelect={(currentValue) => {
                                 setSelected(currentValue === selected ? "" : currentValue)
                                 setValue(id, currentValue === selected ? "" : currentValue)
                                 setOpen(false)
                              }}
                           >
                              <Check
                                 className={cn(
                                    "mr-2 h-4 w-4",
                                    selected === opt.value ? "opacity-100" : "opacity-0"
                                 )}
                              />
                              {opt.label}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
         <p className="text-xs font-medium text-destructive">{errors[id]?.message && "This field is required"}</p>
      </div>
   )
}


export const createListingFormShape = {
   basicInformation: {
      fields: [
         {
            id: "name",
            label: "Property Name",
            type: "text",
            required: true,
            component: InputComponent
         },
         {
            id: "description",
            label: " Property Description",
            type: "text",
            required: true,
            component: TextAreaComponent
         },
         {
            id: "price",
            label: "Price",
            type: "number",
            required: true,
            component: InputComponent
         },
         {
            id: "state",
            label: "State",
            type: "text",
            required: true,
            component: ComboBoxComponent,
            options: states
         },
         {
            id: "selected",
            label: "Location",
            type: "text",
            required: true,
            component: InputComponent
         },
      ]
   },
   propertyDetails: {
      fields: [
         {
            id: "propertyType",
            label: "Property Type",
            type: "text",
            required: true,
            component: ComboBoxComponent,
            options: propertyTypes.slice(1)
         },
         {
            id: "amenities",
            label: "Amenities",
            subLabel: "Separate amenities with commas",
            type: "text",
            required: true,
            component: TextAreaComponent,
         },
         {
            id: "beds",
            label: "Number of Bedrooms",
            type: "number",
            required: true,
            component: InputComponent,
         },
         {
            id: "baths",
            label: "Number of Baths",
            type: "number",
            required: true,
            component: InputComponent,
         },
         {
            id: "sqft",
            label: "Square Feet",
            type: "number",
            required: true,
            component: InputComponent,
         },
      ]
   }
}