"use client"

import { ArrowLeft, Bath, Bed, ImagePlus, MapPin, Ruler, SquarePen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { propertySchema, TPropertySchema } from "@/lib/validators/property-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { states } from "@/consts/states"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import PlaceHolderImage from "../../public/placeholder.svg"


export const CreateListing = () => {
   const [images, setImages] = useState<string[]>([])

   const form = useForm<TPropertySchema>({
      resolver: zodResolver(propertySchema),
      defaultValues: {
         status: "draft",
      }
   })
   
   const formState = form.watch()
   const propertyType = form.watch("type")
   const isResidential = ["house", "apartment"].includes(propertyType)

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      if (images.length + files.length > 8) {
         form.setError("images", { message: "Maximum 8 images allowed" })
         return
      }

      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
      form.setValue("images", [...images, ...newImages])
   }

   const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index))
      form.setValue("images", images.filter((_, i) => i !== index))
   }

   useEffect(() => {
      console.log(form.formState.errors);
   }, [form.formState.errors])

   const onSubmit = (data: TPropertySchema) => {
      console.log(data)
   }

   return (
      <>
         <Header />

         <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8 flex items-start gap-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1 bg-white border p-4 rounded-lg">
               {/* Basic Information */}
               <div>
                  <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="title">Property Title</Label>
                        <Input
                           id="title"
                           {...form.register("title")}
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors.title?.message}
                        </p>
                     </div>

                     <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                           id="description"
                           {...form.register("description")}
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors.description?.message}
                        </p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4">  
                        <div>
                           <Label htmlFor="price">Price</Label>
                           <Input
                              id="price"
                              type="number"
                              {...form.register("price")}
                           />
                           <p className="mt-2 text-xs text-destructive">
                              {form.formState.errors.price?.message}
                           </p>
                        </div>
                        
                        <div>
                           <Label htmlFor="price">Listing Type</Label>
                           <Select
                              //@ts-expect-error
                              onValueChange={(value) => form.setValue("listingType", value)}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="sale">Sale</SelectItem>
                                 <SelectItem value="rent">Rent</SelectItem>
                                 <SelectItem value="shortlet">Shortlet</SelectItem>
                              </SelectContent>
                           </Select>
                           <p className="mt-2 text-xs text-destructive">
                              {form.formState.errors.listingType?.message}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Location */}
               <div>
                  <h2 className="text-lg font-semibold mb-4">Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="state">State</Label>
                        <Select
                           onValueChange={(value) => form.setValue("location.state", value)}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                           </SelectTrigger>
                           <SelectContent>
                              {states.map((state) => (
                                 <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors.location?.state?.message}
                        </p>
                     </div>

                     <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                           id="city"
                           {...form.register("location.city")}
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors.location?.city?.message}
                        </p>
                     </div>

                     <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                           id="address"
                           {...form.register("location.address")}
                        // error={form.formState.errors.location?.address?.message}
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors.location?.address?.message}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Property Details */}
               <div>
                  <h2 className="text-lg font-semibold mb-4">Property Details</h2>
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="type">Property Type</Label>
                        <Select
                           //@ts-expect-error
                           onValueChange={(value) => form.setValue("type", value)}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                           </SelectContent>
                        </Select>
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors.type?.message}
                        </p>
                     </div>

                     {isResidential && (
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <Label htmlFor="beds">Bedrooms</Label>
                              <Input
                                 id="beds"
                                 type="number"
                                 {...form.register("beds")}
                              />
                              <p className="mt-2 text-xs text-destructive">
                                 {form.formState.errors?.beds?.message}
                              </p>
                           </div>

                           <div>
                              <Label htmlFor="baths">Bathrooms</Label>
                              <Input
                                 id="baths"
                                 type="number"
                                 {...form.register("baths")}
                              />
                              <p className="mt-2 text-xs text-destructive">
                                 {form.formState.errors?.baths?.message}
                              </p>
                           </div>
                        </div>
                     )}

                     <div>
                        <Label htmlFor="sqft">Square Footage</Label>
                        <Input
                           id="sqft"
                           type="number"
                           {...form.register("sqft")}
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors?.sqft?.message}
                        </p>
                     </div>

                     <div>
                        <Label htmlFor="amenities">Amenities</Label>
                        <Textarea
                           id="amenities"
                           {...form.register("amenities")}
                           placeholder="Enter amenities separated by commas (e.g. pool, garage, garden, fenced)"
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors?.amenities?.message}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Images */}
               <div>
                  <h2 className="text-lg font-semibold mb-4">Property Images</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                           <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                           />
                           <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 w-6 h-6 rounded-full"
                              onClick={() => removeImage(index)}
                           >
                              <X className="w-4 h-4" />
                           </Button>
                        </div>
                     ))}

                     {images.length < 8 && (
                        <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg">
                           <label className="cursor-pointer text-center p-4">
                              <ImagePlus className="mx-auto mb-2" />
                              <span className="text-sm">Add Image</span>
                              <input
                                 type="file"
                                 className="hidden"
                                 accept="image/*"
                                 multiple
                                 onChange={handleImageUpload}
                              />
                           </label>
                        </div>
                     )}
                  </div>
                  {form.formState.errors.images && (
                     <p className="text-red-500 text-sm mt-2">
                        {form.formState.errors.images.message}
                     </p>
                  )}
               </div>

               {/* Form Actions */}
               <div className="flex justify-end gap-4">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => form.setValue("status", "draft")}
                  >
                     Save as Draft
                  </Button>
                  <Button
                     type="submit"
                     onClick={() => form.setValue("status", "published")}
                  >
                     Publish Listing
                  </Button>
               </div>
            </form>
            
            <Preview 
               data={{
                  image: images[0],
                  listingType: formState.listingType,
                  location: formState.location?.address,
                  price: formState.price,
                  sqft: formState.sqft,
                  title: formState.title,
                  baths: formState.baths,
                  beds: formState.beds,
                  type: formState.type
               }}
            />
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

interface PreviewProps {
   data: {
      image: string | undefined
      title: string | undefined
      listingType: "rent" | "sale" | "shortlet" | undefined
      location: string | undefined
      beds: number | undefined
      baths: number | undefined
      sqft: number | undefined
      price: number | undefined 
      type: "land" | "commercial" | "apartment" | "house" 
   }
}

const Preview = ({ data: { image, listingType, location, price, sqft, title, baths, beds, type } }: PreviewProps) => {
   const formatPriceWithSuffix = (price: number | undefined, listingType: string | undefined) => {
      if (!price) return "-";
      const suffix = listingType === "shortlet" ? "/night" : listingType === "rent" ? "/year" : "";
      return `${formatPrice(price, { notation: "standard" })}${suffix}`;
   };
   
   return (
      <div className="w-[340px] sticky top-20 p-4 rounded-lg border border-border bg-white shadow-sm max-lg:hidden">
         <h3 className="font-semibold">Quick Preview</h3>
         
         <div className="mt-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-md">
               <Image
                  src={image || PlaceHolderImage}
                  alt={title || "Placeholder Image Alt text"}
                  fill
                  className="object-cover"
               />
               <div className="absolute top-4 left-4 py-1 px-2 bg-secondary text-xs font-semibold rounded-full">
                  For {listingType || "-"}
               </div>
            </div>
            <div className="space-y-1 mt-2">
               <p className="flex items-center gap-2 text-sm font-semibold"><MapPin className="w-4 h-4 text-muted-foreground" />{location || "No Address yet"}</p>
               <h3 className="text-lg font-semibold tracking-normal">{title || "No Property Title"}</h3>
            </div>
            <div className="flex items-center gap-2 py-2">
               {beds && type !== "land" && type !== "commercial" && (
                  <>
                     <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Bed className="w-3 h-3" />
                        {beds || "-"}
                     </p> 
                     <div className="w-[1px] h-[10px] bg-zinc-200" />
                  </>
               )}
               {baths && type !== "land" && type !== "commercial" && (
                  <>
                     <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Bath className="w-3 h-3 " />
                        {baths || "-"}
                     </p>
                     <div className="w-[1px] h-[10px] bg-zinc-200" />
                  </>
               )}
               <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Ruler className="w-3 h-3" />
                  {sqft?.toLocaleString() || "-"} sq ft
               </p>
            </div>
            <p className="text-lg font-semibold tracking-normal opacity-80">
               {formatPriceWithSuffix(price, listingType)}
            </p>
         </div>
      </div>
   )
}