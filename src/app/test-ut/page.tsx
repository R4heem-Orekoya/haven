"use client"

import TestAction from "@/actions/test-ut"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { toast } from "sonner"

export default function Page() {
   const [file, setFile] = useState<File | null>(null)
   
   
   return (
      <div>
         <input type="file" onChange={(e) => {
            if(!e.target.files) return
            
            setFile(e.target.files[0])
         }} />
         
         <Button onClick={async() => {
            if(!file) return
            await TestAction(file)
            toast.success("file uploaded")
         }}>send</Button>
      </div>
   )
}
