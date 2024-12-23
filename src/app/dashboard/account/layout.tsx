import EditProfileSidebar from '@/components/edit-profile-sidebar'
import ProfilePicture from '@/components/profile-picture'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@/lib/db/queries/user'
import React, { ReactNode } from 'react'

interface AccountLayoutProps {
   children: ReactNode
}

const AccountLayout = async ({ children }: AccountLayoutProps) => {
   const signedInUser = await currentUser()
   
   return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center gap-4">
               <ProfilePicture
                  size="lg"
                  image={signedInUser?.image!}
                  name={signedInUser?.name!}
               />
               <div className="grid">
                  <h2 className="text-lg md:text-xl font-semibold">{signedInUser?.name} / Edit Profile</h2>
                  <p className="text-sm text-muted-foreground">Edit your haven profile</p>
               </div>
            </div>
            
            <div className='flex max-sm:flex-col'>
               <EditProfileSidebar />
               <div className='w-[1px] bg-border/50 mx-6 max-sm:hidden'/>
               <div className='flex-1 h-full py-8 sm:py-4'>
                  {children}  
               </div>
            </div>
         </div>
      </main>
   )
}

export default AccountLayout
