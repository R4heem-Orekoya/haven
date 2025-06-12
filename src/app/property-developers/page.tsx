import Agents from "@/components/agents/agents"
import EstateAgentsSkeleton from "@/components/agents/agents-skeleton"
import { db } from "@/lib/db"
import { Suspense } from "react"

export default async function Page() {
   const propertDevelopers = db.user.findMany({
      where: {
         accountType: "property_developer",
         accountVisibility: {
            equals: true
         }
      },
      orderBy: {
         createdAt: "desc",
      },
   })

   return (
      <main className="container mx-auto md:px-6 lg:px-8">
         <div className="max-w-2xl mx-auto p-4 my-12">
            <h1 className="text-2xl font-bold mb-8">Property Developers</h1>

            <Suspense fallback={<EstateAgentsSkeleton />}>
               <Agents agentsPromise={propertDevelopers} />
            </Suspense>
         </div>
      </main>
   )
}