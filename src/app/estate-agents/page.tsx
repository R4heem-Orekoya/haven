import Agents from "@/components/agents/agents"
import AgentsSkeleton from "@/components/agents/agents-skeleton"
import { db } from "@/lib/db"
import { Suspense } from "react"

export default async function Page() {
   const estateAgents = db.user.findMany({
      where: {
         accountType: "estate_agent",
         accountVisibility: {
            equals: true
         }
      },
      orderBy: {
         createdAt: "desc",
      },
   })
   
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <div className="max-w-2xl mx-auto p-4 my-12">
            <h1 className="text-2xl font-bold mb-8">Estate Agents</h1>

            <Suspense fallback={<AgentsSkeleton />}>
               <Agents agentsPromise={estateAgents} />
            </Suspense>
         </div>
      </main>
   )
}
