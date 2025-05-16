"use client"

import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { prices } from "@/consts/price-list"
import { ScrollArea } from "../../ui/scroll-area"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { TSearchSchema } from "@/lib/validators/search-schema"
import { cn } from "@/lib/utils"

interface PriceRangeProps {
   setValue: UseFormSetValue<TSearchSchema>
   errors: FieldErrors<TSearchSchema>
}

const PriceRange = ({ setValue, errors }: PriceRangeProps) => {
   const [minPrice, setMinPrice] = useState<number | null>(null)
   const [maxPrice, setMaxPrice] = useState<number | null>(null)
   
   return (
      <div className="flex flex-col gap-2">
         <Label className="text-xs font-medium">Price Range</Label>
         <div className="flex max-sm:flex-wrap items-center gap-2 ">
            <DropdownMenu>
               <DropdownMenuTrigger asChild className="flex-1">
                  <Button variant="outline" className={cn("flex justify-between", { "border-destructive": errors.minPrice })}>
                     {minPrice ? prices.find(price => price.value === minPrice)?.label : 
                     "Min price"}
                     <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="flex-1 ">
                  <ScrollArea className="h-[200px]">
                     {prices.map((price) => (
                        <DropdownMenuItem 
                           key={price.label} 
                           onClick={() => {
                              setMinPrice(prev => {
                                 return prev === price.value ? null : price.value
                              })
                              
                              if(minPrice !== price.value) {
                                 setValue("minPrice", price.value)
                              }else {
                                 setValue("minPrice", undefined)
                              }
                           }} 
                           className="cursor-pointer"
                        >
                           {price.label}
                        </DropdownMenuItem>
                     ))}
                  </ScrollArea>
               </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
               <DropdownMenuTrigger asChild className="flex-1">
                  <Button variant="outline" className={cn("flex justify-between", { "border-destructive": errors.minPrice })}>
                     {maxPrice ? prices.find(price => price.value === maxPrice)?.label : 
                     "Max price"}
                     <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="flex-1">
                  <ScrollArea className="h-[200px]">
                     {prices.map((price) => (
                        <DropdownMenuItem 
                           key={price.label} 
                           onClick={() => {
                              setMaxPrice(prev => {
                                 return prev === price.value ? null : price.value
                              })
                              
                              if(maxPrice !== price.value) {
                                 setValue("maxPrice", price.value)
                              }else {
                                 setValue("maxPrice", undefined)
                              }
                           }} 
                           className="cursor-pointer"
                        >
                           {price.label}
                        </DropdownMenuItem>
                     ))}
                  </ScrollArea>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <p className="text-xs font-medium text-destructive">{errors.minPrice?.message}</p>
      </div>
   )
}

export default PriceRange
