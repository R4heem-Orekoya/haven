import EditAccountType from "@/components/edit-account-type";
import { currentUser } from "@/lib/db/queries/user";

const Page = async () => {
   const signedInUser = await currentUser()
   
   return <EditAccountType signedInUser={signedInUser!}/>
}

export default Page
