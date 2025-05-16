import { db } from "@/lib/db";
import { currentUser } from "@/lib/db/queries/user";
import { pick } from "@/lib/utils";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { utapi } from "@/lib/uploadthing/utils"

const f = createUploadthing();

export const ourFileRouter = {
   propertyImageUploader: f({
      image: {
         maxFileSize: "1MB",
         maxFileCount: 8,
         minFileCount: 1
      },
   }).middleware(async () => {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) throw new UploadThingError("Unauthorized");

      return { user: signedInUser };
   }).onUploadComplete(async ({ file }) => {
      console.log("file url", file);
      const uploadedFile = pick(file, ["key", "name", "ufsUrl", "size", "fileHash", "type"])

      return { file: uploadedFile };
   }),
   profilePictureUploader: f({
      image: {
         maxFileSize: "1MB",
         maxFileCount: 1,
         minFileCount: 1
      },
   }).middleware(async () => {
      const signedInUser = await currentUser()

      if (!signedInUser || !signedInUser.id) throw new UploadThingError("Unauthorized");

      return { user: signedInUser };
   }).onUploadComplete(async ({ file, metadata:{ user } }) => {
      const uploadedFile = pick(file, ["key", "name", "ufsUrl", "size", "fileHash", "type"])
      
      if(user.image && user.image_key) {
         await utapi.deleteFiles(user.image_key)
      }
      
      await db.user.update({
         where:{
            id: user.id
         },
         data:{
            image: file.ufsUrl,
            image_key: file.key
         }
      })

      return { file: uploadedFile };
   })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;