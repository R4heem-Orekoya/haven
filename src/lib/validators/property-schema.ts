import { z } from "zod";

export const propertySchema = z.object({
   title: z.string().min(5, "Title must be at least 5 characters"),
   description: z.string().min(20, "Description must be at least 20 characters"),
   price: z.string()
      .nonempty("Price is required")
      .transform((val) => Number(val))
      .pipe(z.number().positive("Price must be greater than 0")),
   listingType: z.enum(["rent", "sale", "shortlet"]),
   location: z.object({
      state: z.string().nonempty("State is required"),
      city: z.string().nonempty("City is required"), //remove this later
      address: z.string().nonempty("Address is required"),
   }),
   type: z.enum(["house", "apartment", "land", "commercial"]),
   beds: z.string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive().optional()),
   baths: z.string()
      .optional()
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive().optional()),
   sqft: z.string()
      .nonempty("Square footage is required")
      .transform((val) => Number(val))
      .pipe(z.number().positive("Square footage must be greater than 0")),
   amenities: z.string().refine((value) => {
      if(value === "") return true
      const words = value.split(",")
      
      const isValid = words.every((word) => word.trim().length)
      return isValid;
   },
      {
         message: "Amenities must be separated by commas.",
      }
   ),
   images: z.array(z.string()).min(1, "At least one image is required").max(8, "Maximum 8 images allowed"),
   status: z.enum(["draft", "published"])
})
   .superRefine((data, ctx) => {
      if (data.type === "apartment" || data.type === "house") {
         if (data.beds === undefined) {
            ctx.addIssue({
               code: "custom",
               message: "Number of bedrooms is required for houses and apartments",
               path: ["beds"],
            })
         }

         if (data.baths === undefined) {
            ctx.addIssue({
               code: "custom",
               message: "Number of bathrooms is required for houses and apartments",
               path: ["baths"]
            })
         }
      }
   })

export type TPropertySchema = z.infer<typeof propertySchema>