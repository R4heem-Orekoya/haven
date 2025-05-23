import AuthInfo from "@/components/auth/info"
import EditProfileForm from "@/components/edit-profile-form"
import EditProfilePicture from "@/components/edit-profile-picture"
import { currentUser } from "@/lib/db/queries/user"
import { redirect } from "next/navigation"

const Page = async () => {
   const signedInUser = await currentUser()
   
   if(!signedInUser) redirect("/sign-in")
   
   return (
      <div className="space-y-6">
         <AuthInfo message="Most of these fields are only usefull if you have an estate agent or property developer account type." />
         <EditProfilePicture signedInUser={signedInUser} /> 
         <EditProfileForm signedInUser={signedInUser} />
      </div>
   )
}

export default Page
