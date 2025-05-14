"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/lib/db/queries/user"
import { deleteFiles } from "@/trigger/delete-files"
import { uploadPropertyImages } from "@/trigger/upload-property-images"
import { ImageStatus } from "@prisma/client"
import { tasks } from "@trigger.dev/sdk/v3"

export async function deleteImage(imageId: string) {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
         return {
            error: "Unauthorized"
         }
      }

      const imageToDelete = await db.image.findUnique({
         where: {
            id: imageId
         },
         include: {
            property: true
         }
      })

      if (!imageToDelete || !imageToDelete.id || !imageToDelete.key) {
         return {
            error: "This image does not exist!"
         }
      }

      if (imageToDelete.property.userId !== signedInUser.id) {
         return {
            error: "You are not permitted to perform this action!"
         }
      }

      await db.image.delete({
         where: {
            id: imageId
         }
      })

      await tasks.trigger<typeof deleteFiles>("delete_files", {
         fileKeys: [imageToDelete.key]
      })

      return {
         success: "Image deleted"
      }

   } catch (error) {
      console.log(error)
      return {
         error: "Failed to delete image!"
      }
   }
}

export async function uploadImages({ files, propertyId }: { files: File[], propertyId: string }) {
   try {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) {
         return { error: "Unauthorized!" }
      }

      const property = await db.property.findUnique({
         where: {
            id: propertyId
         }
      })

      if (!property) {
         return { error: "This property does not exist!" }
      }

      if (property.userId !== signedInUser.id) {
         return { error: "You are not authorized to perform this action!" }
      }

      const imagePayloads = await Promise.all(
         files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            return {
               name: file.name,
               type: file.type,
               content: Buffer.from(buffer).toString("base64"),
            };
         })
      )

      const imageRecords = imagePayloads.map(() => ({
         propertyId: property.id,
         status: "processing" as ImageStatus,
      }));

      await db.image.createMany({
         data: imageRecords,
         skipDuplicates: true,
      })

      await tasks.trigger<typeof uploadPropertyImages>("upload_property_images", {
         propertyId: property.id,
         images: imagePayloads,
      })

      return { success: "Images uploaded!" }
   } catch (error) {
      console.log("Failed to upload images");
      return { error: "Something went wrong!" }
   }
}