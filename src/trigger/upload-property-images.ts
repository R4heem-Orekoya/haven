import { db } from "@/lib/db";
import { resetCache } from "@/lib/redis";
import { utapi } from "@/lib/uploadthing/utils";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const uploadPropertyImages = schemaTask({
   id: "upload_property_images",
   schema: z.object({
      images: z.object({
         name: z.string(),
         type: z.string(),
         content: z.string(),
         id: z.string()
      }).array(),
      propertyId: z.string()
   }),
   run: async (payload) => {
      await Promise.all(
         payload.images.map(async (image) => {
            
            if(typeof Buffer === undefined) {
               throw new Error("Buffer does not exist in this context!")
            }
            
            const buffer = Buffer.from(image.content, "base64");
            const file = new File([buffer], image.name, { type: image.type });
            
            try {
               const result = await utapi.uploadFiles(file);
               if (!result.data?.ufsUrl || !result.data?.key) {
                  throw new Error(result?.error?.message);
               }

               await db.image.update({
                  where: { id: image.id },
                  data: {
                     url: result.data.ufsUrl,
                     key: result.data.key,
                     hash: result.data.fileHash,
                     status: "uploaded",
                  },
               });
            } catch (error) {
               console.log(error);
               await db.image.update({
                  where: { id: image.id },
                  data: {
                     status: "failed",
                  },
               });
            }
         })
      )
      
      await resetCache()
   },
   handleError: (_, error) => {
      //@ts-expect-error unknown
      logger.error(_,error.message)
   }
})