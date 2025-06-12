"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef, useState } from "react"
import PlaceHolderProfilePicture from "../../public/placeholder-profile-picture.svg"
import { useUploadThing } from "@/lib/uploadthing"
import { toast } from "sonner"
import { User } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from 'nextjs-toploader/app';

interface EditProfilePictureProps {
   signedInUser: User
}

const EditProfilePicture = ({ signedInUser }: EditProfilePictureProps) => {
   const router = useRouter()
   const [error, setError] = useState<string | null>(null)
   const uploadthing = useUploadThing("profilePictureUploader", {
      onClientUploadComplete: () => {
         toast.success("Profile picture uploaded successfully!")
         router.push("/dashboard")
      },
      onUploadError: (error) => {
         toast.error(error.message)
      }
   })
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [image, setImage] = useState<File | null>(null)

   const handeClick = () => {
      fileInputRef.current?.click()
   }

   const handleUpload = async (file: File) => {
      await uploadthing.startUpload([file])
   }

   return (
      <>
         <div className="flex items-center gap-4">
            <div className="relative size-16 rounded-full overflow-hidden border border-border">
               <Image
                  src={signedInUser.image && !image ? signedInUser.image : image ? URL.createObjectURL(image) : PlaceHolderProfilePicture}
                  alt="your profile image" fill
                  className="object-cover"
               />
            </div>
            <input
               type="file"
               ref={fileInputRef}
               accept="image/jpg, image/png, image/gif, image/webp"
               style={{ display: "none" }}
               onChange={(e) => {
                  if (e.target.files) {
                     if(e.target.files[0].size > 2 * 1024 * 1024) {
                        setError("Image cannot be greater than 2MB")
                     }
                     setImage(e.target.files[0])
                  }
               }}
            />
            <Button onClick={handeClick} variant="outline" size="sm" className="rounded-3xl">
               Change profile picture
            </Button>
            {image && (
               <>
                  <Button
                     onClick={() => setImage(null)}
                     variant="destructive"
                     size="sm"
                     className="rounded-3xl"
                  >
                     Remove
                  </Button>
                  <Button
                     variant="default"
                     size="sm"
                     className="rounded-3xl"
                     disabled={uploadthing.isUploading || !!error}
                     onClick={async () => {
                        await handleUpload(image)
                     }}
                  >
                     Upload Image
                     {uploadthing.isUploading && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                     )}
                  </Button>
               </>
            )}
         </div>
         {error && (
            <p className="text-sm text-destructive">{error}</p>
         )}
      </>
   )
}

export default EditProfilePicture
