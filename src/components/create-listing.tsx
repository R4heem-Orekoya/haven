"use client"

import { ArrowLeft, ImagePlus, SquarePen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { propertySchema, TPropertySchema } from "@/lib/validators/property-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createListingFormShape } from "@/consts/create-listing-form-shape"
import { toast } from "sonner"


export const CreateListing = () => {
   const [selectedImages, setSelectedImages] = useState<string[]>([]);

   const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TPropertySchema>({
      resolver: zodResolver(propertySchema)
   })

   const selectedPropertyType = watch("propertyType");

   const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files

      if (files) {
         if((files.length + selectedImages.length) > 8) {
            toast.error("You can't select more than 8 image!")
            return
         }
         
         const imageFiles = Array.from(files).map((file) =>
            URL.createObjectURL(file)
         );
         setSelectedImages((prev) => [...prev, ...imageFiles]);
      }
   };

   useEffect(() => {
      console.log(selectedPropertyType)
   }, [selectedPropertyType])
   
   const handleRemoveImage = (index: number) => {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
   }

   return (
      <>
         <Header />

         <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8 flex items-start gap-4">
            <form className="flex-1 bg-white shadow-sm p-4 border border-border rounded-lg space-y-4">
               <div>
                  <h2 className="font-semibold">
                     Basic Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                     Start with the basic details of your property.
                  </p>

                  <div className="mt-4 grid gap-3">
                     {createListingFormShape.basicInformation.fields.slice(0, 2).map((item) => {
                        const Component = item.component

                        return (
                           <Component
                              key={item.id}
                              id={item.id as keyof TPropertySchema}
                              type={item.type}
                              label={item.label}
                              options={item.options}
                              errors={errors}
                              register={register}
                              setValue={setValue}
                           />
                        )
                     })}

                     <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {createListingFormShape.basicInformation.fields.slice(2).map((item) => {
                           const Component = item.component

                           return (
                              <Component
                                 key={item.id}
                                 id={item.id as keyof TPropertySchema}
                                 label={item.label}
                                 type={item.type}
                                 options={item.options}
                                 errors={errors}
                                 register={register}
                                 setValue={setValue}
                              />
                           )
                        })}
                     </div>
                  </div>
               </div>

               <Separator />

               <div>
                  <h2 className="font-semibold">
                     Property Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                     Provide specific details about your property.
                  </p>

                  <div className="grid gap-3 mt-4">
                     {createListingFormShape.propertyDetails.fields.slice(0, 2).map((item) => {
                        const Component = item.component

                        return (
                           <Component
                              key={item.id}
                              errors={errors}
                              id={item.id as keyof TPropertySchema}
                              type={item.type}
                              register={register}
                              label={item.label}
                              subLabel={item.subLabel}
                              options={item.options}
                              setValue={setValue}
                           />
                        )
                     })}

                     <div className="grid md:grid-cols-2 gap-4">
                        {(selectedPropertyType === "apartment" || selectedPropertyType === "house") && (
                           createListingFormShape.propertyDetails.fields.slice(2, 5).map((item) => {
                              const Component = item.component

                              return (
                                 <Component
                                    key={item.id}
                                    errors={errors}
                                    id={item.id as keyof TPropertySchema}
                                    type={item.type}
                                    register={register}
                                    label={item.label}
                                    subLabel={item.subLabel}
                                    options={item.options}
                                    setValue={setValue}
                                 />
                              )
                           })
                        )}    
                          
                        {(selectedPropertyType === "land" || selectedPropertyType === "commercial") && (
                           createListingFormShape.propertyDetails.fields.slice(-1).map((item) => {
                              const Component = item.component

                              return (
                                 <Component
                                    key={item.id}
                                    errors={errors}
                                    id={item.id as keyof TPropertySchema}
                                    type={item.type}
                                    register={register}
                                    label={item.label}
                                    subLabel={item.subLabel}
                                    options={item.options}
                                    setValue={setValue}
                                 />
                              )
                           })
                        )}      
                     </div>
                  </div>
               </div>

               <Separator />

               <div>
                  <h2 className="font-semibold">
                     Property Media
                  </h2>
                  <p className="text-sm text-muted-foreground">
                     Upload 8 best images of your property (Not more than 4MB).
                  </p>

                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
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
                              <X className="w-2 h-2" />
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
               </div>

               <div className="mt-6 flex items-center gap-4 justify-start flex-row-reverse">
                  <Button className="max-sm:flex-1">Publish Listing</Button>
                  <Button className="max-sm:flex-1" variant="outline">Save as Draft</Button>
               </div>
            </form>

            <Preview />
         </section>

      </>
   )
}


const Header = () => {
   return (
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
   )
}

const Preview = () => {
   return (
      <div className="w-[320px] sticky top-20 p-4 rounded-lg border border-border bg-white shadow-sm max-lg:hidden">
         <h3 className="font-semibold">Quick Preview</h3>
      </div>
   )
}