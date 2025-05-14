import { utapi } from "@/lib/uploadthing/utils";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const deleteFiles = schemaTask({
   id: "delete_files",
   schema: z.object({
      fileKeys: z.string().array()
   }),
   run: async (payload) => {
      await utapi.deleteFiles(payload.fileKeys)
   }
})