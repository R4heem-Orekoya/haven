"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyTypes } from "@/consts/property-types"
import { states } from "@/consts/states"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"

const PropertyFilter = () => {
   const searchParams = useSearchParams()
   const router = useRouter()   
   
   const propertyType = searchParams.get("propertyType") || ""
   const category = searchParams.get("category") || ""
   const state = searchParams.get("state") || ""
   
   
   return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 md:py-6">
         <div className="grid gap-2">
            <Label htmlFor="property-type">
               Property Type
            </Label>
            <Select defaultValue={propertyType}
               onValueChange={(value) => {
                  router.push(`/properties?propertyType=${value}&category=${category}&state=${state}`)
               }}
            >
               <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Select property type" />
               </SelectTrigger>
               <SelectContent>
                  {propertyTypes.map((type) => (
                     <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>
         <div className="grid gap-2">
            <Label htmlFor="property-category">
               Category
            </Label>
            <Select defaultValue={category}
               onValueChange={(value) => {
                  router.push(`/properties?propertyType=${propertyType}&category=${value}&state=${state}`)
               }}
            >
               <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Select property category" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="shortlet">Shortlet</SelectItem>
               </SelectContent>
            </Select>
         </div>
         <div className="grid gap-2">
            <Label htmlFor="property-state">
               State
            </Label>
            <Select defaultValue={state}
               onValueChange={(value) => {
                  router.push(`/properties?propertyType=${propertyType}&category=${category}&state=${value}`)
               }}
            >
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
         <div className="flex items-end">
            <Button 
               onClick={() => {
                  router.push("/properties")
               }}
               className="w-full rounded-3xl"
            >
               Reset Filter
            </Button>
         </div>
      </div>
   )
}

export default PropertyFilter