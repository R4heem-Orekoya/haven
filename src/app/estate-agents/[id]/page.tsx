import AgentDetails from "@/components/agents/agent-details"
import { AgentDetailsSkeleton } from "@/components/agents/agent-details-skeleton"
import { Suspense } from "react"

interface Props {
   params: Promise<{
      id: string
   }>
}

export default async function Page({ params }: Props) {
   const id = (await params).id

   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 my-12">
         <Suspense fallback={<AgentDetailsSkeleton />}>
            <AgentDetails id={id}/>
         </Suspense>
      </main>
   )
}