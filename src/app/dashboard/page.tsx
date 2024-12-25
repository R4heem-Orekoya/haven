import DashboardTab from "@/components/tabs/dashboard-tab"
import ProfilePicture from "@/components/profile-picture"
import { Button } from "@/components/ui/button"
import { currentUser } from "@/lib/db/queries/user"
import { property } from "@/types/property"
import { UserPen } from "lucide-react"
import Link from "next/link"

const properties: property[] = [
  {
    id: 1,
    name: "Oceanfront Villa",
    price: 7500000,
    location: "Malibu, CA",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    beds: 5,
    baths: 6,
    sqft: 6800,
    type: "sale"
  },
  {
    id: 2,
    name: "Penthouse Suite",
    price: 12000000,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    beds: 4,
    baths: 4.5,
    sqft: 5200,
    type: "sale"
  },
  {
    id: 3,
    name: "Mountain Retreat",
    price: 4900000,
    location: "Aspen, CO",
    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2503&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    beds: 6,
    baths: 7,
    sqft: 7500,
    type: "sale"
  },
]

const Page = async () => {
  const signedInUser = await currentUser()

  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <ProfilePicture
              size="2xl"
              image={signedInUser?.image!}
              name={signedInUser?.name!}
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
          <Button asChild variant="outline" size="sm" className="w-fit">
            <Link href="/dashboard/account/profile">
              <UserPen strokeWidth={1.6} className="text-muted-foreground"/>
              Edit Profile
            </Link>
          </Button>
        </div>

        <div className="pt-4">
          <DashboardTab signedInUser={signedInUser!} />
        </div>
      </div>
    </main>
  )
}

export default Page
