import EditAccountType from "@/components/edit-account-type";
import { currentUser } from "@/lib/db/queries/user";
import { User } from "@prisma/client";

const Page = () => {
   const signedInUser = currentUser()
   
   return <EditAccountType signedInUserPromise={signedInUser as Promise<User>} />
}

export default Page