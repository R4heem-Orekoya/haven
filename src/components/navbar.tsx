"use client"

import Link from "next/link"
import Logo from "./Logo"
import { Button } from "./ui/button"
import MobileNav from "./MobileNav"
import ProfilePicture from "./profile-picture"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bookmark, LayoutDashboard, LogOut, UserRoundPen } from "lucide-react"
import { logoutAction } from "@/actions/auth"
import { toast } from "sonner"
import { User } from "@prisma/client"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavbarProps {
	signedInuser: User | null
}

const Navbar = ({ signedInuser }: NavbarProps) => {
   const pathname = usePathname()
   
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
      <div className="sticky top-0 z-[999] bg-white">
         <header className="h-16 flex justify-between items-center container mx-auto px-4 md:px-6 lg:px-8">
            <Link href="/">
               <Logo className="w-16 h-16 max-sm:w-12 max-sm:h-12" />
            </Link>

            <MobileNav />
            <div className="hidden md:flex items-center gap-10">
               <nav className="flex items-center gap-6">
                  <Link href="/properties" className={cn("text-sm text-muted-foreground hover:text-primary duration-300", { "text-primary font-semibold": pathname === "/properties" })}>Properties</Link>
                  <Link href="/estate-agents" className={cn("text-sm text-muted-foreground hover:text-primary duration-300", { "text-primary font-semibold": pathname === "/estate-agents" })}>Estate Agents</Link>
                  <Link href="/property-developers" className={cn("text-sm text-muted-foreground hover:text-primary duration-300", { "text-primary font-semibold": pathname === "/property-developers" })}>Property Developers</Link>
               </nav>

               <div className="flex space-x-4">
                  {signedInuser ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full focus:outline-offset-4">
                           <ProfilePicture image={signedInuser.image} name={signedInuser.name} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[250px] mt-3 border z-[999]">
                           <DropdownMenuLabel>My Account</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href="/dashboard">
                                 <LayoutDashboard strokeWidth={1.7} className="size-4 text-muted-foreground"/>
                                 Dashboard
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href="/dashboard/account/profile">
                                 <UserRoundPen strokeWidth={1.7} className="size-4 text-muted-foreground"/>
                                 Edit Profile
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href="/dashboard?tab=saved_properties">
                                 <Bookmark strokeWidth={1.7} className="size-4 text-muted-foreground"/>
                                 Saved Properties
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild >
                              <button onClick={handleLogout} className=" text-red-500 hover:text-red-500 cursor-pointer w-full">
                                 <LogOut className="size-4"/>
                                 Logout 
                              </button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : (
                     <>
                        <Button variant="outline" asChild>
                           <Link href="/sign-in">
                              Login
                           </Link>
                        </Button>
                        <Button asChild>
                           <Link href="/register">
                              Register
                           </Link>
                        </Button>
                     </>
                  )}
               </div>
            </div>
         </header>
      </div>
   )
}

export default Navbar
