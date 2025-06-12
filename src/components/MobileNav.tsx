"use client"

import { AlignJustify, Bookmark, LayoutDashboard, LogOut, UserRoundPen, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
import { User } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import ProfilePicture from "./profile-picture"
import { logoutAction } from "@/actions/auth"
import { toast } from "sonner"

interface MobileNavProps {
   signedInUser: User | null
}

export default function MobileNav({ signedInUser }: MobileNavProps) {
   const [isOpen, setIsOpen] = useState(false)

   const handleLogout = () => {
      const promise = logoutAction("/")
      toast.promise(promise, {
         loading: 'Logging out...',
         success: () => {
            return "Logged out successfully!";
         },
      })
   }

   return (
      <div className="block md:hidden">
         {signedInUser ? (
            <DropdownMenu>
               <DropdownMenuTrigger className="rounded-full focus:outline-offset-4">
                  <ProfilePicture image={signedInUser.image} name={signedInUser.name} />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[250px] mt-3 border z-[999]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                     <Link href="/dashboard">
                        <LayoutDashboard strokeWidth={1.7} className="size-4 text-muted-foreground" />
                        Dashboard
                     </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                     <Link href="/dashboard/account/profile">
                        <UserRoundPen strokeWidth={1.7} className="size-4 text-muted-foreground" />
                        Edit Profile
                     </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                     <Link href="/dashboard?tab=saved_properties">
                        <Bookmark strokeWidth={1.7} className="size-4 text-muted-foreground" />
                        Saved Properties
                     </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild >
                     <button onClick={handleLogout} className=" text-red-500 hover:text-red-500 cursor-pointer w-full">
                        <LogOut className="size-4" />
                        Logout
                     </button>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         ) : (
            <>
               <button onClick={() => setIsOpen(prev => !prev)}>
                  {isOpen ? <X /> : <AlignJustify />}
               </button>

               {isOpen && (
                  <div className="fixed top-16 left-0 border-b border-t w-full bg-white">
                     <div className="container px-6 mx-auto py-6">
                        <nav className="flex flex-col space-y-4">
                           <Link href="/properties" className="text-sm text-muted-foreground hover:text-primary duration-300">Properties</Link>
                           <Link href="/estate-agents" className="text-sm text-muted-foreground hover:text-primary duration-300">Estate Agents</Link>
                           <Link href="/property-developers" className="text-sm text-muted-foreground hover:text-primary duration-300">Property Developers</Link>
                        </nav>

                        <div className="mt-8 space-y-4 flex flex-col">
                           <Button className="flex-1" asChild>
                              <Link href="/register">
                                 Register
                              </Link>
                           </Button>
                           <Button className="flex-1" variant="outline">
                              <Link href="/sign-in">
                                 Login
                              </Link>
                           </Button>
                        </div>
                     </div>
                  </div>
               )}
            </>
         )}
      </div>
   )
}
