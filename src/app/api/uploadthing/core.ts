import { auth } from "@/auth";
import { currentUser } from "@/lib/db/queries/user";
import { pick } from "@/lib/utils";
import { FileEdit } from "lucide-react";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
   propertyImageUploader: f({
      image: {
         maxFileSize: "8MB",
         maxFileCount: 8,
         minFileCount: 1
      },
   }).middleware(async ({ }) => {
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