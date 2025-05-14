import DashboardTab from "@/components/tabs/dashboard-tab"
import ProfilePicture from "@/components/profile-picture"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/db/queries/user"
import { UserPen } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const Page = async () => {
  const signedInUser = await currentUser()
  
  if(!signedInUser || !signedInUser.id) redirect("/sign-in")

  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <ProfilePicture
              size="2xl"
              image={signedInUser.image as string}
              name={signedInUser.name as string}
            />
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">{signedInUser?.name}</h2>
              <p className="text-muted-foreground font-medium">
                {(() => {
                  if (signedInUser?.accountType === "estate_agent") return "Real Estate Agent";
                  if (signedInUser?.accountType === "property_developer") return "Property Developer";
                  return "";
                })()}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit rounded-3xl">
            <Link href="/dashboard/account/profile">
              <UserPen strokeWidth={1.6} className="text-muted-foreground"/>
              Edit Profile
            </Link>
          </Button>
        </div>

        <div className="pt-4">
          <DashboardTab />
        </div>
      </div>
    </main>
  )
}

export default Page
