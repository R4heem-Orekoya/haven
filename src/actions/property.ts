"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { utapi } from "@/lib/uploadthing/utils"
import { sluggify } from "@/lib/utils"
import { propertySchema, TPropertySchema } from "@/lib/validators/property-schema"

export const createNewPropertyListing = async (data: TPropertySchema) => {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
         return { error: "Unauthorized" }
      }

      const validatedData = propertySchema.safeParse(data)

      if (!validatedData.success) {
         console.log(validatedData.error);
         return { error: "Invalid input. Please check your data and try again." }
      }

      const propertyListingData = validatedData.data
      const images = propertyListingData.images

      // Use a transaction for database operations
      return await db.$transaction(async (tx) => {
         // Create property
         const property = await tx.property.create({
            data: {
               title: propertyListingData.title,
               description: propertyListingData.description,
               slug: sluggify(propertyListingData.title),
               price: propertyListingData.price,
               amenities: propertyListingData.amenities,
               type: propertyListingData.listingType,
               location: propertyListingData.location.address,
               state: propertyListingData.location.state,
               userId: signedInUser.id,
               status: "published"
            },
         });

         // Upload images
         const uploadedImages = await Promise.all(
            images.map(async (image) => {
               try {
                  const result = await utapi.uploadFiles(image);
                  if (!result.data?.url || !result.data?.key) {
                     throw new Error('Image upload failed');
                  }
                  return {
                     key: result.data.key,
                     url: result.data.url,
                     propertyId: property.id
                  };
               } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                  throw new Error(`Failed to upload image: ${errorMessage}`);
               }
            })
         );

         // Create image records
         await tx.image.createMany({
            data: uploadedImages,
         });

         return { success: "Property listing created successfully!" };
      });

   } catch (error) {
      console.error('Failed to create property listing:', error);
      return {
         error: "Failed to create property listing. Please try again later."
      };
   }
}