import { getRandomColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useMemo } from "react";

interface ProfilePictureProps {
   name: string
   image: string | undefined
   size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

const sizes = [
   { size: "sm", className: "w-10 h-10" },
   { size: "md", className: "w-12 h-12" },
   { size: "lg", className: "w-16 h-16" },
   { size: "xl", className: "w-20 h-20" },
   { size: "2xl", className: "w-24 h-24" },
]

const ProfilePicture = ({ image, name, size = "sm" }: ProfilePictureProps) => {
   const color = useMemo(() => getRandomColor(), []);
   const resolvedSize = sizes.find((item) => item.size === size)?.className
   
   return (
      <Avatar className={resolvedSize}>
         <AvatarImage style={{ background: color }} src={image || `https://api.dicebear.com/9.x/dylan/svg?seed=${name}`} />
         <AvatarFallback>{name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
      </Avatar>
   )
}

export default ProfilePicture
