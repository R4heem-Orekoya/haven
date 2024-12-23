import EditProfilePicture from "@/components/edit-profile-picture"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { currentUser } from "@/lib/db/queries/user"

const Page = async () => {
   const signedInUser = await currentUser()
   
   return (
      <div className="space-y-6">
         <EditProfilePicture />
         
         
         <form className="grid gap-4">
            <div className="grid gap-2">
               <Label htmlFor="name">
                  Name
               </Label>
               <Input className="h-8" defaultValue={signedInUser?.name!} id="name"/>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="address">
                  Address
               </Label>
               <Input className="h-8" id="address"/>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="address">
                  Bio
               </Label>
               <Textarea className="min-h-[70px] max-h-[250px]"/>
               <p className="text-xs text-muted-foreground">
                  Brief summary of your profile
               </p>
            </div>
         </form>
      </div>
   )
}

export default Page
