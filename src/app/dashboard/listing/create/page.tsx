"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ImagePlus, SquarePen, X } from "lucide-react"
import Link from "next/link"
import { ChangeEvent, useState } from "react"

const Page = () => {
   const [selectedImages, setSelectedImages] = useState<string[]>([]);

   const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      if (files) {
         const imageFiles = Array.from(files).map((file) =>
            URL.createObjectURL(file)
         );
         setSelectedImages((prev) => [...prev, ...imageFiles]);
      }
   };

   const handleRemoveImage = (index: number) => {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
   };

   return (
      <main className="bg-zinc-50 min-h-[calc(100vh-4rem)]">
         <div className="bg-white border-y border-border">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <Button asChild size="icon" className="rounded-full" variant="outline">
                     <Link href="/dashboard">
                        <ArrowLeft />
                     </Link>
                  </Button>
                  <h1 className="text-lg md:text-xl font-semibold">Create a New Listing</h1>
               </div>

               <Button>Save as Draft <SquarePen strokeWidth={1.6} /></Button>
            </div>
         </div>

         <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8 flex items-start gap-4">
            <form className="flex-1 bg-white shadow-sm p-4 border border-border rounded-lg">
               <h2 className="font-semibold">
                  Basic Information
               </h2>
               <p className="text-sm text-muted-foreground">
                  Start with the basic details of your property.
               </p>

               <div className="mt-4 grid gap-3">
                  <div className="grid gap-2">
                     <Label htmlFor="property_name">
                        Property Title
                     </Label>
                     <Input id="property_name" />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="property_description">
                        Property Description
                     </Label>
                     <Textarea id="property_description" className="min-h-[100px] max-h-[250px]" />
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 grid gap-2">
                        <Label htmlFor="price">
                           Price
                        </Label>
                        <Input id="price" type="number" />
                     </div>
                     <div className="flex-1 grid gap-2">
                        <Label htmlFor="state">
                           State
                        </Label>
                        <Input id="state" placeholder="e.g Akure" />
                     </div>
                  </div>


               </div>

               <Separator className="my-4" />

               <h2 className="font-semibold">
                  Property Details
               </h2>
               <p className="text-sm text-muted-foreground">
                  Provide specific details about your property.
               </p>

               <div className="grid gap-4 mt-4">
                  <div className="grid gap-3">
                     <div className="grid gap-2">
                        <Label htmlFor="property_type">
                           Property Type
                        </Label>
                        <Input id="property_type" />
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                           <Label htmlFor="bedrooms">
                              Bedrooms
                           </Label>
                           <Input id="bedrooms" type="number" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="bathrooms">
                              Bathrooms
                           </Label>
                           <Input id="bathrooms" type="number" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="square_feet">
                              Square Feet
                           </Label>
                           <Input id="square_feet" type="number" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="location">
                              Location
                           </Label>
                           <Input id="location" />
                        </div>
                     </div>
                  </div>

                  <div className="grid gap-2">
                     <Label htmlFor="amenities">
                        Amenities
                     </Label>
                     <Textarea id="amenities" placeholder="List amenities (e.g. pool, garage, garden)" className="min-h-[80px] max-h-[250px]" />
                     <p className="text-xs text-muted-foreground">
                        Separate amenities with commas
                     </p>
                  </div>
               </div>

               <Separator className="my-4" />

               <h2 className="font-semibold">
                  Property Media
               </h2>
               <p className="text-sm text-muted-foreground">
                  Upload 8 best images of your property (Not more than 4MB).
               </p>

               <div className="mt-4 grid grid-cols-6 gap-4">
                  {selectedImages.map((image, index) => (
                     <div
                        key={index}
                        className="relative col-span-1 aspect-square border border-border bg-zinc-50 flex items-center justify-center rounded-lg overflow-hidden"
                     >
                        <img
                           src={image}
                           alt={`Uploaded ${index + 1}`}
                           className="w-full h-full object-cover"
                        />
                        <button
                           type="button"
                           onClick={() => handleRemoveImage(index)}
                           className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full text-xs"
                        >
                           <X className="w-2 h-2"/>
                        </button>
                     </div>
                  ))}
                  {selectedImages.length < 8 && (
                     <div className="col-span-1 aspect-square border border-border bg-zinc-50 flex items-center justify-center rounded-lg">
                        <input
                           onChange={handleImageChange}
                           type="file" id="image"
                           className="hidden"
                           multiple
                           accept="image/*"
                        />
                        <label htmlFor="image" className="cursor-pointer text-center text-xs text-muted-foreground flex flex-col items-center gap-1">
                           <ImagePlus />
                           <span>Upload Image</span>
                        </label>
                     </div>
                  )}
               </div>

               <div className="mt-4 flex items-center gap-4 justify-start flex-row-reverse">
                  <Button>Publish Listing</Button>
                  <Button variant="outline">Save as Draft</Button>
               </div>
            </form>

            <div className="w-[320px] sticky top-20 p-4 rounded-lg border border-border bg-white shadow-sm">
               <h3 className="font-semibold">Quick Preview</h3>
            </div>
         </section>
      </main>
   )
}

export default Page
