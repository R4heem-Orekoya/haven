import { publicRoutes } from "@/routes"
import { FilterOptions } from "@/types"
import { User } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const wait = async (duration: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), duration)
  })
}

export function isMatchingPublicRoute(pathname: string) {
  return publicRoutes.some((route) => {
    if (route.endsWith("/*")) {
      const base = route.replace("/*", "")
      return pathname.startsWith(base)
    }
    return pathname === route
  })
}

export const sluggify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>
    (obj: T, ...keys: K): {
      [K2 in Exclude<keyof T, K[number]>]: T[K2]
    }
}

export const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K]
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!(keys.includes(key))) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

export function formatPrice(price: number | string, options: {
  currency?: 'USD' | 'EUR' | 'GBP' | 'BDT' | 'NGN'
  notation?: Intl.NumberFormatOptions['notation']
} = {}
) {
  const { currency = 'NGN', notation = 'compact' } = options

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation,
    currencySign: "standard",
    maximumFractionDigits: 0
  }).format(numericPrice)

  if (currency === 'NGN') {
    return formatted.replace('NGN', '₦')
  }

  return formatted
}

export const formatPriceWithSuffix = (price: number | undefined, category: string | undefined, notation: Intl.NumberFormatOptions['notation'] = "compact") => {
  if (!price) return "-";
  const suffix = category === "shortlet" ? "/day" : category === "rent" ? "/year" : "";
  return `${formatPrice(price, { notation })}${suffix}`;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length).toLowerCase()
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getRandomColor = () => {
  const colors = [
    '#FF5733', // Bright Orange/Red-Orange
    '#33FF57', // Lime Green
    '#5733FF', // Vivid Blue/Violet Blue
    '#FFC300', // Bright Yellow
    '#FF33A8', // Hot Pink/Fuchsia
    '#33FFF2', // Aqua/Teal
    '#FF6F61', // Coral
    '#6A33FF', // Deep Purple
    '#33FFBD', // Mint Green
    '#FFD700', // Gold
    '#FF4500', // Orange Red
    '#40E0D0'  // Turquoise
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

type Result<T> = {
  data: T | null;
  error: Error | null
}

export async function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getProertyCount() {
  const res = await fetch('http://localhost:3000/api/property/count', {
    next: {
      tags: ["get_proerty_count"]
    }
  })

  if (!res.ok) throw Error("Something went wrong! mmmm")

  const data = await res.json()
  const count: number = data.count

  return count
}

export function isUserVerified(user: User) {
  return (
    user.accountType !== "individual" &&
    !!user.email &&
    !!user.image &&
    !!user.bio &&
    !!user.personalWebsiteUrl &&
    !!user.phoneNumber
  )
}

export function getRedisPropertyFilterKey({
  filterOptions, page }:
  { filterOptions: FilterOptions, page: number }
) {
  // Merge the array of single-key objects into one unified object
  const merged = Object.assign({}, ...filterOptions)

  const type = merged.type?.toLowerCase() ?? 'any'
  const category = merged.category?.toLowerCase() ?? 'any'
  const state = merged.state
    ? merged.state.toLowerCase().replace(/\s+/g, '-')
    : 'any'

  return `properties:filter:${type}:${category}:${state}:page:${page}`
}