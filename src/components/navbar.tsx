import Link from "next/link"
import Logo from "./Logo"
import { Button } from "./ui/button"
import MobileNav from "./MobileNav"
import { currentUser } from "@/lib/db/queries/user"
import ProfilePicture from "./profile-picture"

const Navbar = async () => {
   const signedInuser = await currentUser()
   return (
      <div className="sticky top-0 z-[999] bg-white">
         <header className="h-16 flex justify-between items-center container mx-auto px-4 md:px-6 lg:px-8">
            <Link href="/">
               <Logo className="w-16 h-16 max-sm:w-12 max-sm:h-12" />
            </Link>

            <MobileNav />
            <div className="hidden md:flex items-center gap-10">
               <nav className="flex items-center gap-6">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">Properties</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">Estate Agents</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">Property Developers</Link>
               </nav>

               <div className="flex space-x-4">
                  {signedInuser ? (
                     <ProfilePicture image={signedInuser.image!} name={signedInuser.name!} />
                  ): (
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
