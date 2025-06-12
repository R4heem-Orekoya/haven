"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { sluggify } from "@/lib/utils"
import { propertySchema, updatePropertySchema } from "@/lib/validators/property-schema"
import { deleteFiles } from "@/trigger/delete-files"
import { uploadPropertyImages } from "@/trigger/upload-property-images"
import { ImageStatus } from "@prisma/client"
import { tasks } from "@trigger.dev/sdk/v3";
import { revalidatePath, revalidateTag } from "next/cache"

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

      const { property, dbImages } = await db.$transaction(async (tx) => {
         const property = await tx.property.create({
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

         const imageRecords = images.map((_, i) => ({
            order: i,
            propertyId: property.id,
            status: "processing" as ImageStatus,
         }));

         const dbImages = await tx.image.createManyAndReturn({
            data: imageRecords,
            skipDuplicates: true,
         });

         return { property, dbImages };
      })
      
      const imagePayloads = await Promise.all(
         images.map(async (file, index) => {
            const buffer = await file.arrayBuffer();
            return {
               name: file.name,
               type: file.type,
               content: Buffer.from(buffer).toString("base64"),
               id: dbImages[index].id
            };
         })
      )

      await tasks.trigger<typeof uploadPropertyImages>("upload_property_images", {
         propertyId: property.id,
         images: imagePayloads,
      });

      revalidateTag("get_proerty_count")

      return { success: "Property created. Uploading images in background...", id: property.id }
   } catch (error) {
      console.error('Failed to create property listing:', error);
      return {
         error: "Failed to create property listing. Please try again later."
      };
   }
}

export async function deletePropertyListing(propertyId: string) {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
         return {
            error: "Unauthorized!"
         }
      }

      const propertyToDelete = await db.property.findUnique({
         where: {
            id: propertyId
         }
      })

      if (!propertyToDelete) {
         return {
            error: "The property you're trying to delete does not exist!"
         }
      }

      if (propertyToDelete.userId !== signedInUser.id) {
         return {
            error: "You are not authorized to delete this property!"
         }
      }

      const images = (await db.image.findMany({
         where: {
            propertyId: propertyToDelete.id
         }
      })).map(image => image.key).filter(key => key !== null)

      await db.property.delete({
         where: {
            id: propertyId
         },
         include: {
            images: true,
            favoredByUsers: true
         }
      })

      await tasks.trigger<typeof deleteFiles>("delete_files", {
         fileKeys: images
      });

      return { success: "Property deleted successfully!" }

   } catch (error) {
      console.error('Failed to delete property listing:', error);
      return {
         error: "Failed to delete property listing. Please try again."
      };
   }finally {
      revalidatePath(`/properties/${propertyId}`)
   }
}

export async function updatePropertyListing({ formData, propertyId }: { formData: FormData, propertyId: string }) {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
         return {
            error: "Unauthorized!"
         }
      }

      const propertyToUpdate = await db.property.findUnique({
         where: {
            id: propertyId
         }
      })

      if (!propertyToUpdate) {
         return {
            error: "This property does not exist!"
         }
      }

      if (propertyToUpdate.userId !== signedInUser.id) {
         return {
            error: "You are not authorized to perform this action!"
         }
      }

      const validatedData = updatePropertySchema.safeParse({
         title: formData.get("title"),
         description: formData.get("description"),
         price: Number(formData.get("price")),
         category: formData.get("category"),
         propertyType: formData.get("propertyType"),
         address: formData.get("address"),
         state: formData.get("state"),
         city: formData.get("city"),
         amenities: formData.get("amenities"),
         baths: formData.get("baths"),
         beds: formData.get("beds"),
         sqft: Number(formData.get("sqft")),
      })

      if (!validatedData.success) {
         console.dir(validatedData.error, { depth: null });
         return { error: "Invalid input. Please check your data and try again." }
      }

      const propertyListingData = validatedData.data
      
      await db.property.update({
         where: {
            id: propertyId
         },
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
         }
      })

      return {
         success: "Property updated successfully!"
      }
   } catch (error) {
      console.error("Failed to update property:", error);
      return {
         error: "Something went wrong. Please try again.",
      };
   }finally {
      revalidatePath(`/properties/${propertyId}`)
   }
}

export async function togglePropoertyStatus(propertyId: string) {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
         return {
            error: "Unauthorized!"
         }
      }

      const propertyToToggle = await db.property.findUnique({
         where: {
            id: propertyId
         }
      })

      if (!propertyToToggle) {
         return {
            error: "This property does not exist!"
         }
      }

      if (!["draft", "published"].includes(propertyToToggle.status)) {
         return {
            error: "Invalid property status!"
         }
      }

      if (propertyToToggle.userId !== signedInUser.id) {
         return {
            error: "You are not authorized to edit this property!"
         }
      }

      const isDraft = propertyToToggle.status === "draft"

      await db.property.update({
         where: {
            id: propertyId
         },
         data: {
            status: isDraft ? "published" : "draft"
         }
      })

      return {
         success: isDraft ?
            "Property published successfully!" :
            "Property saved as draft!"
      }
   } catch (error) {
      console.error('Failed to toggle property status:', error);
      return {
         error: "Failed to toggle property status."
      };
   }finally {
      revalidatePath(`/properties/${propertyId}`)
   }
}

export async function savePropertyAction(propertyId: string) {
   try {
      const signedInUser = await currentUser();

      if (!signedInUser || !signedInUser.id) {
         return { error: "You need to be signed in to save a property!" };
      }

      const userWithFavorites = await db.user.findUnique({
         where: { id: signedInUser.id },
         include: { favoriteProperties: true },
      });

      if (!userWithFavorites) return { error: "User not found." };

      const alreadySaved = userWithFavorites.favoriteProperties.some(
         (prop) => prop.id === propertyId
      );

      await db.user.update({
         where: { id: signedInUser.id },
         data: {
            favoriteProperties: {
               [alreadySaved ? "disconnect" : "connect"]: { id: propertyId },
            },
         },
      });

      return {
         success: alreadySaved
            ? "Property removed from favorites!"
            : "Property added to favorites!",
         alreadySaved
      };
   } catch (error) {
      console.error("Failed to save/unsave property:", error);
      return {
         error: "Something went wrong. Please try again.",
      };
   }finally {
      revalidatePath(`/properties/${propertyId}`)
   }
}