import { Info } from "lucide-react";

export default function AuthInfo({ message } : { message: string | undefined }) {
   if(!message) return null
   
   return (
      <div className="rounded-lg bg-amber-200/50 border border-amber-300 px-4 py-3 text-amber-600">
         <p className="text-sm">
         <Info
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