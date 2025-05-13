import { Image, Prisma, Property, User } from "@prisma/client"

export type TPropertyType = "sale" | "rent" | "shortlet"

export type TProperty = Property & { images: Image[] }

export type PropertyWithFavoritesAndImages = Prisma.PropertyGetPayload<{
   include: {
      images: true;
      user: true;
      favoredByUsers: true;
   };
}>;

export type PropertyWithUser = Prisma.PropertyGetPayload<{
   include:{
      user: true;
      images: true
   }
}>