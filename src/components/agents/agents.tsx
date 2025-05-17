"use client"

import React, { use } from 'react'
import AgentCard from './agent-card'
import { User } from '@prisma/client'
import Empty from '../svgs/empty'

interface AgentsProps {
   agentsPromise: Promise<User[]>
}

export default function Agents({ agentsPromise }: AgentsProps) {
   const agents = use(agentsPromise)
   
   return (
      <>
         {agents.length === 0 ? (
            <div className='flex flex-col items-center'>
               <Empty className='w-48 h-48'/>
               <p className="text-muted-foreground">No resources found.</p>
            </div>
         ) : (
            agents.map((agent) => (
               <AgentCard agent={agent} key={agent.id}/>
            ))
         )}
      </>
   )
}