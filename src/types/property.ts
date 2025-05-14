import { Prisma } from "@prisma/client"

export type TPropertyType = "sale" | "rent" | "shortlet"

export type PropertyWithImage = Prisma.PropertyGetPayload<{
   include:{
      images: true
   }
}>

export type PropertyWithFavoritesAndImages = Prisma.PropertyGetPayload<{
   include: {
      images: true;
      user: true;
      favoredByUsers: true;
   }
}>

export type PropertyWithUser = Prisma.PropertyGetPayload<{
   include:{
      user: true;
      images: true;
   }
}>