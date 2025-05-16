"use client"

import React, { use } from 'react'
import AgentCard from './agent-card'
import { User } from '@prisma/client'

interface AgentsProps {
   agentsPromise: Promise<User[]>
}

export default function Agents({ agentsPromise }: AgentsProps) {
   const agents = use(agentsPromise)
   
   return (
      <>
         {agents.length === 0 ? (
            <p className="text-muted-foreground">No resources found.</p>
         ) : (
            agents.map((agent) => (
               <AgentCard agent={agent} key={agent.id}/>
            ))
         )}
      </>
   )
}