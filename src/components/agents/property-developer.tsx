import { db } from '@/lib/db'
import React from 'react'
import { sleep } from '@/lib/utils'
import AgentCard from './agent-card'

export default async function PropertyDeveloper() {
   await sleep(3000)
   
   const estateAgents = await db.user.findMany({
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
      <>
         {estateAgents.length === 0 ? (
            <p className="text-muted-foreground">No estate agents found.</p>
         ) : (
            estateAgents.map((agent) => (
               <AgentCard key={agent.id} agent={agent} />
            ))
         )}
      </>
   )
}