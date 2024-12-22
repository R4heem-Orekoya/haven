import ProfilePicture from "@/components/profile-picture"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/db/queries/user"
import { UserPen } from "lucide-react"
import Link from "next/link"

const Page = async () => {
  const signedInUser = await currentUser()
  
  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6">
          <ProfilePicture 
            size="2xl" 
            image={signedInUser?.image!} 
            name={signedInUser?.name!} 
          />
          <div className="grid gap-2">
            <h2 className="text-xl md:text-2xl font-semibold">{signedInUser?.name}</h2>
            <Button asChild variant="outline" size="sm" className="w-fit rounded-3xl">
              <Link href="/dashboard/profile/edit">
                <UserPen />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
