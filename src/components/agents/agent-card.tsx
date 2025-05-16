"use client"

import { User } from "@prisma/client"
import ProfilePicture from "../profile-picture"
import { useRouter } from "next/navigation"
import { isUserVerified } from "@/lib/utils"
import { BadgeCheck } from "lucide-react"

interface AgentCardProps {
   agent: User
}

export default function AgentCard({ agent }: AgentCardProps) {
   const router = useRouter()
   const link = agent.accountType === "estate_agent" ? `/estate-agents/${agent.id}` : `/property-developers/${agent.id}`
   const isVerified = isUserVerified(agent)
   
   return (
      <div
         onClick={() => {
            router.push(link)
         }}
         key={agent.id}
         className="p-4 border rounded-lg flex justify-between items-start mb-4 cursor-pointer"
      >
         <div className="flex items-center gap-4">
            <ProfilePicture
               image={agent.image}
               name={agent.name}
               size="md"
            />
            <div>
               <h2 className="font-semibold flex items-center gap-1">
                  {agent.name ?? "Unnamed Agent"}
                  {isVerified && (
                     <BadgeCheck className="fill-green-600 stroke-background w-4 h-4"/>
                  )}
               </h2>
               <p className="text-sm text-muted-foreground">{agent.email}</p>

            </div>
         </div>
         {agent.personalWebsiteUrl && (
            <a
               href={agent.personalWebsiteUrl.startsWith("http") ? agent.personalWebsiteUrl : `https://${agent.personalWebsiteUrl}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-sm text-blue-600 hover:underline mt-1 inline-block"
            >
               Visit Website
            </a>
         )}
      </div>
   )
}
