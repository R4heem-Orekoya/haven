import EditProfileForm from "@/components/edit-profile-form"
import EditProfilePicture from "@/components/edit-profile-picture"
import { currentUser } from "@/lib/db/queries/user"

const Page = async () => {
   const signedInUser = await currentUser()
   
   return (
      <div className="space-y-6">
         <EditProfilePicture /> 
         <EditProfileForm signedInUser={signedInUser!}/>
      </div>
   )
}

export default Page
