"use client"

import { AlignJustify, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

const MobileNav = () => {
   const [isOpen, setIsOpen] = useState(false)
   
   return (
      <div className="block md:hidden">
         <button onClick={() => setIsOpen(prev => !prev)}>
            {isOpen ? <X /> : <AlignJustify />}
         </button>
         
         <div className="fixed top-16 left-0 border-b border-t w-full bg-white hidden">
            <div className="container px-6 mx-auto py-6">
               <nav className="flex flex-col space-y-4">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">For Sale</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">For Rent</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">Estate Agents</Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary duration-300">Property Developers</Link>
               </nav>
               
               <div className="mt-8 space-y-4 flex flex-col">
                  <Button className="flex-1">Register</Button>
                  <Button className="flex-1" variant="outline">Login</Button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default MobileNav
