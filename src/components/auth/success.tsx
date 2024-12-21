import { CircleCheck } from "lucide-react";

export default function AuthSuccess({ message }: { message: string | undefined }) {
   if (!message) return null

   return (
      <div className="rounded-lg bg-emerald-200/40 border border-emerald-300 px-4 py-3 text-emerald-500">
         <p className="text-sm">
            <CircleCheck
               className="-mt-0.5 me-3 inline-flex opacity-60"
               size={16}
               strokeWidth={2}
               aria-hidden="true"
            />
            {message}
         </p>
      </div>
   );
}