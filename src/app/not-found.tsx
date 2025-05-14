import NotFoundIllustration from "@/components/svgs/404";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
   return (
      <section className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
         <NotFoundIllustration className="w-60 aspect-square"/>
         <h2 className="text-3xl md:text-4xl font-semibold mt-4">Not Found</h2>
         
         <p className="sm:text-lg pt-2 pb-4 text-muted-foreground">Page you requested does not exist!</p>
      
         <Button asChild className="rounded-3xl">
            <Link href="/">Return Home</Link>
         </Button>
      </section>
   )
}