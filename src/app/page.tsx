import Heading from "@/components/Heading"
import SearchForm from "@/components/SearchForm"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PropertyHero from "@/components/property-hero"
import { Suspense } from "react"
import { PropertyCardSkeleton } from "@/components/property/property-card-skeleton"

export default function LandingPage() {
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <section className="background text-background my-4 rounded-xl pb-12 pt-8 md:pb-16 md:pt-12 lg:py-32 px-6 md:px-8 xl:px-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
               <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.3rem] text-balance font-semibold">
                  Journey To Your Dream Property
               </h1>
               <p className="sm:text-base md:text-lg text-balance font-light">
                  Find the space where your story begins — from cozy homes to grand estates, 
                  your perfect property is just a search away.
               </p>
               <SearchForm />
            </div>
         </section>

         <section className="py-8 lg:py-12 xl:py-16 px-4 lg:px-8">
            <div className="flex max-sm:flex-wrap justify-between items-center gap-4 md:gap-8">
               <Heading>
                  Discover Your Perfect Property Match
               </Heading>

               <p className="w-full max-w-lg lg:text-lg font-extralight text-muted-foreground">
                  Embark on a journey of discovery through exclusive collections of homes,
                  luxury properties to fulfill your aspirations and inspire your imagination
               </p>
            </div>
            
            <div className="mt-12">
               <Suspense fallback={<PropertyCardSkeleton length={4} />}>
                  <PropertyHero />
               </Suspense>
            </div>

            <div className="mt-8 md:mt-12 mx-auto flex justify-center">
               <Button asChild className="group">
                  <Link href="/properties">
                     See all Properties
                     <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition duration-300" />
                  </Link>
               </Button>
            </div>
         </section>

         <section className="bg-zinc-50 rounded-xl px-6 md:px-8 xl:px-10 py-12 mt-12 text-center">
            <Heading>Are you a Developer or Property Owner?</Heading>
            <p className="max-w-xl mx-auto mt-4 text-muted-foreground">
               Join our platform to list properties, reach potential clients, and grow your real estate business.
            </p>
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
               <Button asChild>
                  <Link href="/register?role=estate_agent">Join as Estate Agent</Link>
               </Button>
               <Button asChild variant="outline">
                  <Link href="/register?role=property_developer">Join as Property Developer</Link>
               </Button>
            </div>
         </section>
         
         <footer className="mt-20 border-t pt-10 pb-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Haven. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-4">
               <Link href="#" className="hover:underline">Privacy Policy</Link>
               <Link href="#" className="hover:underline">Terms of Service</Link>
               <Link href="#" className="hover:underline">Contact</Link>
            </div>
         </footer>
      </main>
   )
}