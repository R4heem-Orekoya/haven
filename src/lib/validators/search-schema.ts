import { z } from "zod"

export const searchSchema = z.object({
   mode: z.string().min(1),
   propertyType: z.string().min(1),
   location: z.string(),
   minPrice: z.number().optional(),
   maxPrice: z.number().optional(),
})
   .refine((data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
         return data.minPrice <= data.maxPrice;
      }
      return true;
   }, {
      message: "Min price should be smaller than max price",
      path: ["minPrice"],
   })

export type TSearchSchema = z.infer<typeof searchSchema>