import SignUpForm from "@/components/auth/signup-form"
import { TAccountType } from "@/types"

interface Props {
   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: Props) {
   const role = (await searchParams)?.role as TAccountType || undefined
   
   return <SignUpForm role={role} />
}
