"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { utapi } from "@/lib/uploadthing/utils"
import { sluggify } from "@/lib/utils"
import { propertySchema } from "@/lib/validators/property-schema"
import { TProperty } from "@/types/property"
import { Property } from "@prisma/client"

export const createNewPropertyListing = async (formData: FormData) => {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
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

      // Use a transaction for database operations
      return await db.$transaction(async (tx) => {
         // Create property
         let property: Property
         
         if(propertyListingData.propertyType === "house" || propertyListingData.propertyType === "apartment") {
            property = await tx.property.create({
               data: {
                  title: propertyListingData.title,
                  description: propertyListingData.description,
                  slug: sluggify(propertyListingData.title),
                  price: propertyListingData.price,
                  amenities: propertyListingData.amenities,
                  type: propertyListingData.propertyType,
                  category: propertyListingData.category,
                  location: propertyListingData.address,
                  beds: propertyListingData.beds,
                  baths: propertyListingData.baths,
                  sqft: propertyListingData.sqft,
                  state: propertyListingData.state,
                  userId: signedInUser.id,
                  status: "published"
               },
            })
         }else {
            property = await tx.property.create({
               data: {
                  title: propertyListingData.title,
                  description: propertyListingData.description,
                  slug: sluggify(propertyListingData.title),
                  price: propertyListingData.price,
                  amenities: propertyListingData.amenities,
                  type: propertyListingData.propertyType,
                  category: propertyListingData.category,
                  location: propertyListingData.address,
                  sqft: propertyListingData.sqft,
                  state: propertyListingData.state,
                  userId: signedInUser.id,
                  status: "published"
               },
            })
         }

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
      }, {
         maxWait: 5000, // 5 seconds max wait to connect to prisma
         timeout: 20000, // 20 seconds
      });

   } catch (error) {
      console.error('Failed to create property listing:', error);
      return {
         error: "Failed to create property listing. Please try again later."
      };
   }
}