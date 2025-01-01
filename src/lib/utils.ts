import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const wait = async (duration: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), duration)
  })
}

export const sluggify = (text: string) => 
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

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