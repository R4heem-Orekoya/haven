import { CircleAlert } from "lucide-react";

export default function AuthError({ message } : { message: string | undefined }) {
   if(!message) return null
   
   return (
      <div className="rounded-lg bg-red-200/50 border border-red-300 px-4 py-3 text-red-500">
         <p className="text-sm">
         <CircleAlert
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
