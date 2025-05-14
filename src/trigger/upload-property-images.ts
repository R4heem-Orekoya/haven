import { db } from "@/lib/db";
import { utapi } from "@/lib/uploadthing/utils";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const uploadPropertyImages = schemaTask({
   id: "upload_property_images",
   schema: z.object({
      images: z.object({
         name: z.string(),
         type: z.string(),
         content: z.string()
      }).array(),
      propertyId: z.string()
   }),
   run: async (payload, { ctx }) => {
      const imageEntries = await db.image.findMany({
         where: { propertyId: payload.propertyId },
      });

      const uploadedImages = await Promise.all(
         payload.images.map(async (image, index) => {
            const entry = imageEntries[index];
            const buffer = Buffer.from(image.content, "base64");
            const file = new File([buffer], image.name, { type: image.type });
            
            try {
               const result = await utapi.uploadFiles(file);
               if (!result.data?.ufsUrl || !result.data?.key) {
                  throw new Error("Upload failed");
               }

               await db.image.update({
                  where: { id: entry.id },
                  data: {
                     url: result.data.ufsUrl,
                     key: result.data.key,
                     status: "uploaded",
                  },
               });
            } catch (error) {
               await db.image.update({
                  where: { id: entry.id },
                  data: {
                     status: "failed",
                  },
               });
            }
         })
      )
   }
})