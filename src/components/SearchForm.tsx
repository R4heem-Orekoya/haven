"use client"

import { Label } from "./ui/label"
import { categories, propertyTypes } from "@/consts/property-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { states } from "@/consts/states"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

type TpropertyType = typeof propertyTypes[number]["value"] | "" 
type TState = typeof states[number]["value"] | ""
type TCategory = typeof categories[number]["value"] | ""

export default function SearchForm() {
   const [propertyType, setPropertyType] = useState<TpropertyType>("")
   const [state, setState] = useState<TState>("")
   const [category, setCategory] = useState<TCategory>("")
   const router = useRouter()

   return (
      <div className="mt-12 max-w-[50rem] mx-auto bg-white text-foreground p-4 sm:p-6 rounded-xl">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <div className="grid gap-2">
               <Label htmlFor="property-type">
                  Property Type
               </Label>
               <Select
                  onValueChange={(value) => {
                     setPropertyType(value as TpropertyType)
                  }}
               >
                  <SelectTrigger className="rounded-full">
                     <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                     {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                           {type.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="property-category">
                  Category
               </Label>
               <Select onValueChange={(value) => {
                  setCategory(value as TCategory)
               }}>
                  <SelectTrigger className="rounded-full">
                     <SelectValue placeholder="Select property category" />
                  </SelectTrigger>
                  <SelectContent>
                     {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="property-state">
                  State
               </Label>
               <Select onValueChange={(value) => {
                  setState(value as TState)
               }}>
                  <SelectTrigger className="rounded-full">
                     <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                     {states.map((state) => (
                        <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>
         <div className="flex items-end mt-6">
            <Button
               onClick={() => {
                  if(!propertyType && !category && !state) return
                  router.push(`/properties?propertyType=${propertyType}&category=${category}&state=${state}`) 
               }}
               className="w-full rounded-3xl"
            >
               Search
            </Button>
         </div>
      </div>
   )
}
