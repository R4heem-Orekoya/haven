"use server"

import { utapi } from "@/lib/uploadthing/utils";

export default async function TestAction(file: File) {
   try {
      await utapi.uploadFiles([file])
      
      return { success: "FIle uploaded successfully"}
   }catch(error) {
      console.log(error);
      return { error: "Something went wrong!"}
   }
}