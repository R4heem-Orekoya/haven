import Heading from "@/components/Heading"
import SearchForm from "@/components/property/hero-search/SearchForm"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { PropertyGrid } from "@/components/property/property-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const LandingPage = async () => {
   
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         <section className="background text-background my-4 rounded-xl pb-12 pt-8 md:pb-16 md:pt-12 lg:py-32 px-6 md:px-8 xl:px-10">
            <div className="max-w-[50rem] mx-auto text-left md:text-center space-y-6">
               <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] text-balance font-semibold">Journey To Your Perfect Home</h1>
               <p className="sm:text-base md:text-lg text-balance font-light">
                  Let our expert team guide you through the magic of real estate and helping you find
                  the perfect home where your dreams take flight
               </p>
            </div>
            <SearchForm />
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
            
            {/* <PropertyGrid data={properties} className="mt-12"/> */}
            
            <div className="mt-8 md:mt-12 mx-auto flex justify-center">
               <Button asChild className="group">
                  <Link href="#">
                     See all Properties
                     <ArrowUpRight className="group-hover:rotate-45 transition duration-300"/>
                  </Link>
               </Button>
            </div>
         </section>
      </main>
   )
}

export default LandingPage