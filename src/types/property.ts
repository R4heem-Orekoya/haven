import { Image, Property } from "@prisma/client"

export type TPropertyType = "sale" | "rent" | "shortlet"

export type TProperty = Property & { images: Image[] }