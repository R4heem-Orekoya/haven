import { getRandomColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface ProfilePictureProps {
   name: string
   image: string | undefined
}

const ProfilePicture = ({ image, name }: ProfilePictureProps) => {
   const color = getRandomColor()
   return (
      <Avatar>
         <AvatarImage style={{ background: color }} src={image || `https://api.dicebear.com/9.x/dylan/svg?seed=${name}`} />
         <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
   )
}

export default ProfilePicture
