import EditProfilePicture from "@/components/edit-profile-picture"
import { Button } from "@/components/ui/button"
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
                  Name <span className="text-red-500">*</span>
               </Label>
               <Input defaultValue={signedInUser?.name!} id="name"/>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="address">
                  Address
               </Label>
               <Input id="address"/>
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
            <div className="grid gap-2">
               <Label htmlFor="personal_website">
                  Personal Website
               </Label>
               <Input type="url" id="personal_website"/>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="schedule_url">
                  Cal.com or Calendly URL
               </Label>
               <Input type="url" id="schedule_url"/>
            </div>
            
            <div className="flex mt-4">
               <Button className="w-fit ml-auto rounded-3xl">Save Profile</Button>
               
            </div>
         </form>
      </div>
   )
}

export default Page
