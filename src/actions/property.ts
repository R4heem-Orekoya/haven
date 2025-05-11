"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { sluggify } from "@/lib/utils"
import { propertySchema } from "@/lib/validators/property-schema"
import { uploadPropertyImages } from "@/trigger/upload-property-images"
import { ImageStatus } from "@prisma/client"
import { tasks } from "@trigger.dev/sdk/v3";

export const createNewPropertyListing = async (formData: FormData) => {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id || signedInUser.accountType === "individual") {
         return { error: "Unauthorized" }
      }

      const validatedData = propertySchema.safeParse({
         title: formData.get("title"),
         description: formData.get("description"),
         price: formData.get("price"),
         category: formData.get("category"),
         propertyType: formData.get("propertyType"),
         address: formData.get("address"),
         state: formData.get("state"),
         city: formData.get("city"),
         amenities: formData.get("amenities"),
         baths: formData.get("baths"),
         beds: formData.get("beds"),
         sqft: formData.get("sqft"),
         images: formData.getAll("images")
      })

      if (!validatedData.success) {
         console.dir(validatedData.error, { depth: null });
         return { error: "Invalid input. Please check your data and try again." }
      }

      const propertyListingData = validatedData.data
      const images = propertyListingData.images

      const imagePayloads = await Promise.all(
         images.map(async (file) => {
            const buffer = await file.arrayBuffer();
            return {
               name: file.name,
               type: file.type,
               content: Buffer.from(buffer).toString("base64"),
            };
         })
      )

      const { property } = await db.$transaction(async (tx) => {
         let property = await tx.property.create({
            data: {
               title: propertyListingData.title,
               description: propertyListingData.description,
               slug: sluggify(propertyListingData.title),
               price: propertyListingData.price,
               amenities: propertyListingData.amenities,
               type: propertyListingData.propertyType,
               category: propertyListingData.category,
               location: propertyListingData.address,
               beds: propertyListingData.beds ?? null,
               baths: propertyListingData.baths ?? null,
               sqft: propertyListingData.sqft,
               state: propertyListingData.state,
               userId: signedInUser.id,
               status: "published"
            },
         })

         const imageRecords = images.map(() => ({
            propertyId: property.id,
            status: "processing" as ImageStatus,
         }));

         await tx.image.createMany({
            data: imageRecords,
            skipDuplicates: true,
         });
         
         return { property };
      })

      await tasks.trigger<typeof uploadPropertyImages>("upload_property_images", {
         propertyId: property.id,
         images: imagePayloads,
      });

      return { success: "Property created. Uploading images in background...", slug: property.slug }
   } catch (error) {
      console.error('Failed to create property listing:', error);
      return {
         error: "Failed to create property listing. Please try again later."
      };
   }
}