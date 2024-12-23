"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import PlaceHolderProfilePicture from "../../public/placeholder-profile-picture.svg"

const EditProfilePicture = () => {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [image, setImage] = useState<File | null>(null)

   const handeClick = useCallback(() => {
      fileInputRef.current?.click()
   }, [])


   return (
      <div className="flex items-center gap-4">
         <div className="relative size-16 rounded-full overflow-hidden border border-border">
            <Image
               src={image ? URL.createObjectURL(image) : PlaceHolderProfilePicture}
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
               >
                  Upload Image
               </Button>
            </>
         )}
      </div>
   )
}

export default EditProfilePicture
