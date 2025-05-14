import UnauthorizedIllustration from "@/components/svgs/401";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
   return (
      <section className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
         <UnauthorizedIllustration className="w-60 aspect-square"/>
         <h2 className="text-3xl md:text-4xl font-semibold mt-4">Unauthorized</h2>
         
         <p className="sm:text-lg pt-2 pb-4 text-muted-foreground">You are not authorized to be on this page!</p>
      
         <Button asChild className="rounded-3xl">
            <Link href="/sign-in">Sign in</Link>
         </Button>
      </section>
   )
}