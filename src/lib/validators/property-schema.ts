import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024

export const propertySchema = z.object({
   title: z.string().min(5, "Title must be at least 5 characters"),
   description: z.string().min(20, "Description must be at least 20 characters"),
   price: z.string()
      .nonempty("Price is required")
      .transform((val) => Number(val))
      .pipe(z.number().positive("Price must be greater than 0")),
   propertyType: z.enum(["house", "apartment", "land", "commercial"]),
   state: z.string().nonempty("State is required"),
   address: z.string().nonempty("Address is required"),
   category: z.enum(["rent", "sale", "shortlet"]),
   beds: z.string()
      .optional()
      .nullable()
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive().optional()),
   baths: z.string()
      .optional()
      .nullable()
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive().optional()),
   sqft: z.string()
      .nonempty("Square footage is required")
      .transform((val) => Number(val))
      .pipe(z.number().positive("Square footage must be greater than 0")),
   amenities: z.string().refine((value) => {
      if (value === "") return true
      const words = value.split(",")

      const isValid = words.every((word) => word.trim().length)
      return isValid;
   },
      {
         message: "Amenities must be separated by commas.",
      }
   ),
   images: z
      .array(
         z.instanceof(File).refine((file) => {
            const isLessthanThreshold = file.size < MAX_FILE_SIZE
            return isLessthanThreshold
         },
            { message: `Image Size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` }
         )
      )
      .min(5, "At least five images are required")
      .max(8, "Maximum 8 images allowed"),
})
   .superRefine((data, ctx) => {
      if (data.propertyType === "apartment" || data.propertyType === "house") {
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

export const updatePropertySchema = z.object({
   title: z.string().min(5, "Title must be at least 5 characters"),
   description: z.string().min(20, "Description must be at least 20 characters"),
   price: z.number()
      .pipe(z.number().positive("Price must be greater than 0")),
   propertyType: z.enum(["house", "apartment", "land", "commercial"]),
   state: z.string().nonempty("State is required"),
   address: z.string().nonempty("Address is required"),
   category: z.enum(["rent", "sale", "shortlet"]),
   beds: z.string()
      .optional()
      .nullable()
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive().optional()),
   baths: z.string()
      .optional()
      .nullable()
      .transform((val) => (val ? Number(val) : undefined))
      .pipe(z.number().positive().optional()),
   sqft: z.number()
      .pipe(z.number().positive("Square footage must be greater than 0")),
   amenities: z.string().refine((value) => {
      if (value === "") return true
      const words = value.split(",")

      const isValid = words.every((word) => word.trim().length)
      return isValid;
   },
      {
         message: "Amenities must be separated by commas.",
      }
   ),
})
   .superRefine((data, ctx) => {
      if (data.propertyType === "apartment" || data.propertyType === "house") {
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

export type TupdatePropertySchema = z.infer<typeof updatePropertySchema>
export type TPropertySchema = z.infer<typeof propertySchema>