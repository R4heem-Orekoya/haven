"use client"

import { ArrowLeft, Bath, Bed, Bookmark, ImagePlus, Loader2, Ruler, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { propertySchema, TPropertySchema } from "@/lib/validators/property-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { states } from "@/consts/states"
import { formatPriceWithSuffix } from "@/lib/utils"
import Image from "next/image"
import PlaceHolderImage from "../../public/placeholder.svg"
import { createNewPropertyListing } from "@/actions/property"
import { toast } from "sonner"
import { useRouter } from 'nextjs-toploader/app';
import { Badge } from "./ui/badge"

export const CreateListing = () => {
   const [images, setImages] = useState<File[]>([])
   const [isSubmitting, setIsSubmitting] = useState(false)

   const form = useForm<TPropertySchema>({
      resolver: zodResolver(propertySchema)
   })

   const formState = form.watch()
   const propertyType = form.watch("propertyType")
   const isResidential = ["house", "apartment"].includes(propertyType)

   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      if (images.length + files.length > 8) {
         form.setError("images", { message: "Maximum 8 images allowed" })
         return
      }

      const newImages = Array.from(files).map(file => file)
      setImages(prev => [...prev, ...newImages])
      form.setValue("images", [...images, ...newImages])
   }

   const removeImage = (index: number) => {
      setImages(prev => prev.filter((_, i) => i !== index))
      form.setValue("images", images.filter((_, i) => i !== index))
   }

   const router = useRouter()

   const onSubmit = async (data: TPropertySchema) => {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("price", String(data.price))
      formData.append("propertyType", data.propertyType)
      formData.append("category", data.category)
      formData.append("address", data.address)
      formData.append("state", data.state)
      formData.append("amenities", data.amenities)
      formData.append("sqft", String(data.sqft))

      if (isResidential) {
         formData.append("baths", String(data.baths))
         formData.append("beds", String(data.beds))
      }

      images.forEach((image) => {
         formData.append(`images`, image, image.name)
      })

      setIsSubmitting(true)
      createNewPropertyListing(formData)
         .then((callback) => {
            if ('success' in callback) {
               toast.success(callback.success)
               router.push(`/properties/${callback.id}`)
            }
            if ('error' in callback) {
               toast.error(callback.error)
               console.log(callback);
            }
         })
         .catch((error) => {
            console.log(error);
            toast.error("Something went wrong. Try again!")
         })
         .finally(() => setIsSubmitting(false))
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
                           className="min-h-[120px] max-h-[250px]"
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
                              //@ts-expect-error some error
                              onValueChange={(value) => form.setValue("category", value)}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="sale">For sale</SelectItem>
                                 <SelectItem value="rent">For rent</SelectItem>
                                 <SelectItem value="shortlet">Shortlet</SelectItem>
                              </SelectContent>
                           </Select>
                           <p className="mt-2 text-xs text-destructive">
                              {form.formState.errors.category?.message}
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
                           onValueChange={(value) => form.setValue("state", value)}
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
                           {form.formState.errors?.state?.message}
                        </p>
                     </div>

                     <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                           id="address"
                           {...form.register("address")}
                        />
                        <p className="mt-2 text-xs text-destructive">
                           {form.formState.errors?.address?.message}
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

                           onValueChange={(value) => {
                              //@ts-expect-error some error
                              form.setValue("propertyType", value)
                              if (value === "land" || value === "commercial") {
                                 form.setValue("beds", undefined)
                                 form.setValue("baths", undefined)
                              }
                           }}
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
                           {form.formState.errors.propertyType?.message}
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
                           className="min-h-[80px] max-h-[250px]"
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
                              src={URL.createObjectURL(image)}
                              alt={`Property ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg cursor-move"
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
                                 onChange={handleImageSelect}
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
                     disabled={isSubmitting}
                     type="button"
                     variant="outline"
                     onClick={() => { }}
                  >
                     Save as Draft
                  </Button>
                  <Button
                     disabled={isSubmitting}
                     type="submit"

                  >
                     Publish Listing
                     {isSubmitting && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
                  </Button>
               </div>
            </form>

            <Preview
               data={{
                  image: images[0],
                  category: formState.category,
                  location: formState?.address,
                  price: formState.price,
                  sqft: formState.sqft,
                  title: formState.title,
                  baths: formState.baths,
                  beds: formState.beds,
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
                     <ArrowLeft className="w-4 h-4"/>
                  </Link>
               </Button>
               <h1 className="text-lg md:text-xl font-semibold">Create a New Listing</h1>
            </div>
         </div>
      </div>
   )
}

interface PreviewProps {
   data: {
      image: File | undefined
      title: string | undefined
      category: "rent" | "sale" | "shortlet" | undefined
      location: string | undefined
      beds: number | undefined
      baths: number | undefined
      sqft: number | undefined
      price: number | undefined
   }
}

const Preview = ({ data: { image, category, location, price, sqft, title, baths, beds } }: PreviewProps) => {
   return (
      <div className="w-[340px] sticky top-20 p-4 rounded-lg border border-border bg-white shadow-sm max-lg:hidden">
         <h3 className="font-semibold">Quick Preview</h3>

         <div className="mt-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
               {image ? (
                  <Image
                     src={URL.createObjectURL(image) || PlaceHolderImage}
                     alt={title || "Placeholder Image Alt text"}
                     fill
                     className="object-cover"
                  />

               ) : (
                  <Image
                     src={PlaceHolderImage}
                     alt={title || "Placeholder Image Alt text"}
                     fill
                     className="object-cover"
                  />
               )}

               <Button variant="secondary" size="icon" className="w-8 h-8 absolute top-4 right-4 rounded-3xl">
                  <Bookmark className="w-4 h-4"/>
               </Button>
            </div>
            <div className="mt-2">
               <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold tracking-normal line-clamp-1">{title ?? "-"}</h3>
                  <Badge variant="outline" className="px-2 whitespace-nowrap">
                     For {category ?? "-"}
                  </Badge>
               </div>
               <p className="line-clamp-1">{location ?? "-"}</p>
            </div>
            <div className="flex items-center gap-2 py-1">
               {beds && (
                  <>
                     <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Bed className="w-3 h-3" />
                        {beds}
                     </p>
                     <div className="w-[1px] h-[10px] bg-zinc-200" />
                  </>
               )}
               {baths && (
                  <>
                     <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Bath className="w-3 h-3 " />
                        {baths}
                     </p>
                     <div className="w-[1px] h-[10px] bg-zinc-200" />
                  </>
               )}
               {sqft && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Ruler className="w-3 h-3" />
                     {sqft.toLocaleString()} sq ft
                  </p>
               )}
            </div>
            <p className="text-lg font-semibold tracking-normal opacity-80">{formatPriceWithSuffix(price, category)}</p>
         </div>
      </div>
   )
}