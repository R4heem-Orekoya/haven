import { db } from "@/lib/db";
import { currentUser } from "@/lib/db/queries/user";
import { pick } from "@/lib/utils";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
   propertyImageUploader: f({
      image: {
         maxFileSize: "1MB",
         maxFileCount: 8,
         minFileCount: 1
      },
   }).middleware(async ({ input }) => {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) throw new UploadThingError("Unauthorized");

      return { user: signedInUser };
   }).onUploadComplete(async ({ file }) => {
      console.log("file url", file);
      const uploadedFile = pick(file, ["key", "name", "url", "size", "fileHash", "type"])

      return { file: uploadedFile };
   }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;