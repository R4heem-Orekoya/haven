"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from 'next/navigation'

const routes = [
   { label: "Profile", path: "profile" },
   { label: "Change Password", path: "password" },
   { label: "Change Account Type", path: "account-type" },
]

const EditProfileSidebar = () => {
   const pathname = usePathname()
   const extractedPath = pathname.replace('/dashboard/account/', '');

   return (
      <aside>
         <ul className='flex gap-4 sm:flex-col sm:gap-2 overflow-x-auto'>
            {routes.map((route) => (
               <li className={cn("text-muted-foreground max-sm:text-sm hover:text-primary transition-colors duration-300", { "text-primary font-semibold": extractedPath === route.path })}>
                  <Link href={`${route.path}`}>
                     {route.label}
                  </Link>
               </li>
            ))}
         </ul>
      </aside>
   )
}

export default EditProfileSidebar
