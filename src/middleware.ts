import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
import { isMatchingPublicRoute } from "./lib/utils";

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req) => {
   const { nextUrl, auth } = req
   const isLoggedIn = !!auth
   
   if(nextUrl.pathname === "/api/uploadthing") {
      return
   }
   
   if(nextUrl.pathname === "/api/property/count") {
      return
   }
   
   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
   const isPublicRoute = isMatchingPublicRoute(nextUrl.pathname)
   const isAuthRoute = authRoutes.includes(nextUrl.pathname)
   
   if(isApiAuthRoute){
      return 
   } 
   
   if(isAuthRoute) {
      if (isLoggedIn) {
         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      return
   }
   
   if(!isLoggedIn && !isPublicRoute){
      return Response.redirect(new URL("/sign-in", nextUrl))
   }
   
   return
})

//don't invoke middleware on some routes
export const config = {
   matcher: [
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', 
      '/(api|trpc)(.*)', '/api/uploadthing'
   ]
}