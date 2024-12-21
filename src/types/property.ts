export type propertyType = "sale" | "rent" | "shortlet"

export type property = {
   id: number,
   name: string,
   price: number,
   location: string,
   image: string,
   beds: number,
   baths: number,
   sqft: number,
   type: propertyType
}