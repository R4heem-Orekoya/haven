import { z } from "zod";

export const propertySchema = z.object({
   name: z.string().nonempty("This field is required"),
   description: z.string().nonempty("This field is required"),
   price: z.number().int().positive("Price must be a positive number"),
   state: z.string().nonempty("This field is required"),
   location: z.string().nonempty("This field is required"),
   amenities: z
      .string()
      .nonempty("This field is required")
      .refine(
         (value) => value.split(",").every((amenity) => amenity.trim() !== ""),
         {
            message: "Each amenity must be separated by a comma and cannot be empty",
         }
      ),
   propertyType: z.enum(["house", "apartment", "land", "commercial"]),
   beds: z.number().int().positive("Beds must be a positive number").optional(),
   baths: z
      .number()
      .int()
      .positive("Bathrooms must be a positive number")
      .optional(),
   sqft: z.number().int().positive("Square feet must be a positive number").optional(),
}).superRefine((data, ctx) => {
   if (data.propertyType === "house" || data.propertyType === "apartment") {
      if (data.beds === undefined) {
         ctx.addIssue({
            code: "custom",
            path: ["beds"],
            message: "Number of beds is required for the property type selected",
         });
      }
      if (data.baths === undefined) {
         ctx.addIssue({
            code: "custom",
            path: ["baths"],
            message: "Number of baths is required for the property type selected",
         });
      }
      if (data.sqft === undefined) {
         ctx.addIssue({
            code: "custom",
            path: ["sqft"],
            message: "Square feet is required for the property type selected",
         });
      }
   }

   if (data.propertyType === "land" || data.propertyType === "commercial") {
      if (data.sqft === undefined) {
         ctx.addIssue({
            code: "custom",
            path: ["sqft"],
            message: "Square feet is required for the selected property type"
         });
      }
      if (data.beds !== undefined) {
         ctx.addIssue({
            code: "custom",
            path: ["beds"],
            message: "Beds should not be provided for the selected property type",
         });
      }
      if (data.baths !== undefined) {
         ctx.addIssue({
            code: "custom",
            path: ["baths"],
            message: "Bathrooms should not be provided for the selected property type",
         });
      }
   }
});

export type TPropertySchema = z.infer<typeof propertySchema>