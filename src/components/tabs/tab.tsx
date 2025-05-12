"use client"

import React from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Bookmark, House, MessageCircleMore, Plus } from 'lucide-react'
import { User } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardPropertyGrid } from '../property/property-grid'
import { TProperty } from '@/types/property'

interface Tab {
   signedInUser: User | null;
   savedProperties: TProperty[];
   userProperties: TProperty[]
}

const tabs = [
   { icon: Bookmark, label: "Saved Properties", value: "saved_properties", new: false },
   { icon: House, label: "Property Listings", value: "property_listings", new: false },
   { icon: MessageCircleMore, label: "Messages", value: "messages", new: true },
]

export default function Tab({ signedInUser, savedProperties, userProperties }: Tab) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const currentTab = searchParams.get('tab')

   const handleTabChange = (value: string) => {
      router.push(`/dashboard/?tab=${value}`)
   }

   return (
      <Tabs defaultValue={currentTab || "saved_properties"} onValueChange={handleTabChange} className="justify-start">
         <ScrollArea>
            <TabsList className="mb-3 h-auto w-full gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
               {tabs.map((tab, index) => (
                  <TabsTrigger
                     key={index}
                     value={tab.value}
                     className={cn("relative py-1.5 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent", {
                        "hidden": signedInUser?.accountType === "individual" && index === 1,
                     })}
                  >
                     <tab.icon
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                     />
                     {tab.label}
                     {tab.new && <Badge className="ms-1.5 px-2 py-0.5 rounded-2xl">New</Badge>}
                  </TabsTrigger>
               ))}
               {signedInUser?.accountType !== "individual" && (
                  <Button asChild className="ml-auto" size="sm">
                     <Link href="/dashboard/listing/create" className="flex items-center gap-2">
                        Create a new Listing
                        <Plus />
                     </Link>
                  </Button>
               )}
            </TabsList>
            <ScrollBar orientation="horizontal" />
         </ScrollArea>
         <>
            <TabsContent value='saved_properties'>
               {savedProperties.length === 0 ? (
                  <p>You havent saved any properties.</p>
               ) : (
                  <DashboardPropertyGrid data={savedProperties} />
               )}
            </TabsContent>
            <TabsContent value='property_listings'>
               {userProperties.length === 0 ? (
                  <p>You have no property listing.</p>
               ) : (
                  <DashboardPropertyGrid data={userProperties} />
               )}
            </TabsContent>
         </>
      </Tabs>
   )
}
