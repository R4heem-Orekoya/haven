import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface HeadingProps {
   className?: string
   children: ReactNode
}

const Heading = ({ className, children }: HeadingProps) => {
   return (
      <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl text-balance leading-[1.2] font-semibold text-foreground", className)}>
         {children}
      </h2>
   )
}

export default Heading
