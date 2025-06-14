import { accountTypes } from "@/consts/account-type";
import { PropertyCategory, PropertyType } from "@prisma/client";

export type TAccountType = typeof accountTypes[number]["value"]

export type FilterOptions = (
  | { type: PropertyType }
  | { category: PropertyCategory }
  | { state: string }
)[]