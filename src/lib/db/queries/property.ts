import { redis } from "@/lib/redis";
import { PropertyWithFavoritesAndImages } from "@/types/property";
import { db } from "@/lib/db";

import { PAGINATIONITEMSTODISPLAY } from "@/consts";
import { FilterOptions } from "@/types";
import { getRedisPropertyFilterKey } from "@/lib/utils";

export async function getHeroProperties() {
   const redisProperties = await redis.get("properties:hero")

   if (redisProperties) return redisProperties as PropertyWithFavoritesAndImages[]

   const properties = await db.property.findMany({
      where: {
         status: "published"
      },
      include: {
         images: {
            orderBy: {
               order: "asc"
            }
         },
         user: true,
         favoredByUsers: true
      },
      orderBy: {
         createdAt: "desc"
      },
      take: 4
   })

   await redis.set("properties:hero", JSON.stringify(properties), { ex: 18000 })

   return properties
}

interface getPropertiesWithFilterOpts {
   filterOptions: FilterOptions | [];
   page: number
}

export async function getPropertiesWithFilter({ filterOptions, page }: getPropertiesWithFilterOpts) {
   if (filterOptions.length === 0) {
      const redisProperties = await redis.get(`properties:all:${page}`)

      if (redisProperties) return redisProperties as PropertyWithFavoritesAndImages[]

      const properties = await db.property.findMany({
         where: {
            status: "published"
         },
         include: {
            images: {
               orderBy: {
                  order: "asc"
               }
            },
            favoredByUsers: true,
            user: true
         },
         orderBy: {
            createdAt: "desc"
         },
         take: PAGINATIONITEMSTODISPLAY,
         skip: (page - 1) * PAGINATIONITEMSTODISPLAY
      })

      await redis.set(`properties:all:${page}`, JSON.stringify(properties), { ex: 18000 })

      return properties
   }

   const cacheKey = getRedisPropertyFilterKey({ filterOptions, page })
   const redisProperties = await redis.get(cacheKey)

   if (redisProperties) return redisProperties as PropertyWithFavoritesAndImages[]

   const mergedFilters = Object.assign({}, ...filterOptions)
   
   const whereClause = {
      status: 'published',
      ...(mergedFilters.type && { type: mergedFilters.type }),
      ...(mergedFilters.category && { category: mergedFilters.category }),
      ...(mergedFilters.state && { state: mergedFilters.state }),
   }

   const properties = await db.property.findMany({
      where: whereClause,
      include: {
         images: {
            orderBy: {
               order: "asc"
            }
         },
         favoredByUsers: true,
         user: true
      },
      orderBy: {
         createdAt: "desc"
      },
      take: PAGINATIONITEMSTODISPLAY,
      skip: (page - 1) * PAGINATIONITEMSTODISPLAY
   })

   await redis.set(cacheKey, JSON.stringify(properties), { ex: 18000 })

   return properties
}