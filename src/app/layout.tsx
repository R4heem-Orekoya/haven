import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Urbanist, Inter_Tight } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/navbar";
import { currentUser } from "@/lib/db/queries/user";
import { SessionProvider } from "next-auth/react"
import NextTopLoader from 'nextjs-toploader';

// fonts: Mulish, Open_Sans, Outfit,

export const metadata: Metadata = {
  title: "Haven - Journey To Your Dream Property",
  description: "Find the space where your story begins — from cozy homes to grand estates, your perfect property is just a search away.",
};

interface RootLayoutProps {
  children: ReactNode
}

const montserrat = Urbanist({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-montserrat"
})

const openSans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-open-sans"
})

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const signedInuser = currentUser()

  return (
    <html lang="en">
      <SessionProvider>
        <body className={`${montserrat.variable} ${openSans.variable} antialiased font-Montserrat`}>
          <NextTopLoader
            color="#0a0a0a"
            initialPosition={0.08}
            crawlSpeed={200}
            showSpinner={false}
            height={5}
            crawl={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #0a0a0a,0 0 5px #0a0a0a"
            zIndex={1600}
            showAtBottom={false}
          />
          <Navbar currentUser={signedInuser} />
          {children}
          <Toaster position="top-center" theme="light" richColors className="font-Montserrat" />
        </body>
      </SessionProvider>
    </html>
  );
}