"use client"

import { Heart } from "lucide-react"
import { Button } from "../ui/button"

interface SavePropertyButtonProps {
   propertyId: string
}

const SavePropertyButton = ({ propertyId }: SavePropertyButtonProps) => {
   return (
      <Button size="icon" variant="secondary" className="rounded-full">
         <Heart strokeWidth={1.7}/>
      </Button>
   )
}

export default SavePropertyButton