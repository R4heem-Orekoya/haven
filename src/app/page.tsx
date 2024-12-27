import Heading from "@/components/Heading"
import SearchForm from "@/components/hero-search/SearchForm"
import { cn } from "@/lib/utils"
import Image from "next/image"
import image from "../../public/image.jpg"
import { ArrowUpRight } from "lucide-react"
import { PropertyGrid } from "@/components/property/property-grid"
import { property } from "@/types/property"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
   {
      figure: "17k",
      title: "Satisfied Customers",
      figureColor: "text-foreground",
      titleColor: "text-foreground",
      background: "bg-zinc-50 border-zinc-100 border",
   },
   {
      figure: "25",
      title: "Years of Experience",
      figureColor: "text-background",
      titleColor: "text-muted",
      background: "bg-foreground"
   },
   {
      figure: "150",
      title: "Award Winning",
      figureColor: "text-foreground",
      titleColor: "text-foreground",
      background: "bg-[#FDF9F6]"
   },
   {
      figure: "25",
      title: "Property Collections",
      figureColor: "text-foreground",
      titleColor: "text-foreground",
      background: "bg-[#F9EFEF]"
   },
]
const properties: property[] = [
   {
      id: 1,
      name: "Oceanfront Villa",
      price: 7500000,
      location: "Malibu, CA",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      beds: 5,
      baths: 6,
      sqft: 6800,
      type: "sale"
   },
   {
      id: 2,
      name: "Penthouse Suite",
      price: 12000000,
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      beds: 4,
      baths: 4.5,
      sqft: 5200,
      type: "sale"
   },
   {
      id: 3,
      name: "Mountain Retreat",
      price: 4900000,
      location: "Aspen, CO",
      image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2503&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      beds: 6,
      baths: 7,
      sqft: 7500,
      type: "sale"
   },
]

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
            
            <PropertyGrid data={properties} className="mt-12"/>
            
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
























         {/* <section className="py-8 lg:py-12 xl:py-16 px-4 lg:px-8">
            <div className="flex max-sm:flex-wrap justify-between items-center gap-4 md:gap-8">
               <Heading>
                  Your Trusted Real Estate Advisor
               </Heading>
               
               <p className="w-full max-w-lg lg:text-lg font-extralight text-muted-foreground">
                  A cutting-edge real estate agent that offers a seamless
                  and immersive experience for finding your dream home in
                  the heart of the city
               </p>
            </div>
            
            <div className="grid xl:grid-cols-2 gap-6 mt-8 lg:mt-12">
               <div className="grid sm:grid-cols-2 gap-6">
                  {stats.map((stat) => (
                     <div key={stat.title} className={cn("flex flex-col justify-center gap-4 p-6 h-[170px] rounded-lg", stat.background)}>
                        <h3 className={cn("text-3xl md:text-5xl font-bold", stat.figureColor)}>
                           {stat.figure + "+"}
                        </h3>
                        <p className={cn("text-lg text-muted-foreground", stat.titleColor)}>
                           {stat.title}
                        </p>
                     </div>
                     
                  ))}
               </div>
               
               <div className="bg-zinc-100 rounded-lg flex items-start gap-6 p-6">
                  <div className="flex-1 h-full flex flex-col justify-between gap-12">
                     <p className="text-lg">
                        We have witnessed the ever-evolving landscape of the real 
                        estate market and become a trusted partner by thousands of 
                        clients.
                     </p>
                     
                     <button className="size-20 rounded-full bg-[#D0A77A] grid place-items-center relative">
                        <div className="circular-text">
                           <span>Contact Us</span>
                        </div>
                        <ArrowUpRight className="w-10 h-10 text-background"/>
                     </button>
                  </div>
                  
                  <div className="relative h-[360px] xl:h-full flex-1 rounded-md overflow-hidden max-sm:hidden">
                     <Image src={image} alt="image" fill className="object-cover "/>
                  </div>
               </div>
            </div>
         </section> */}
