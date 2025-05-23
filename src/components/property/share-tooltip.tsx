"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RiCodeFill, RiFacebookFill, RiMailLine, RiTwitterXFill } from "@remixicon/react";
import { Check, Copy, Forward } from "lucide-react";
import { useRef, useState } from "react";

export default function ShareToolTip({ propertySlug }: { propertySlug: string }) {
   const [copied, setCopied] = useState<boolean>(false);
   const inputRef = useRef<HTMLInputElement>(null);

   const handleCopy = () => {
      if (inputRef.current) {
         navigator.clipboard.writeText(inputRef.current.value);
         setCopied(true);
         setTimeout(() => setCopied(false), 1500);
      }
   };

   return (
      <div className="flex flex-col gap-4">
         <Popover>
            <PopoverTrigger asChild>
               <Button variant="outline" className="rounded-3xl">
                  Share
                  <Forward strokeWidth={1.6} className="w-4 h-4 text-secondary-foreground"/>
               </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 mt-2 shadow-sm">
               <div className="flex flex-col gap-3 text-center">
                  <div className="text-sm font-medium">Share Property</div>
                  <div className="flex flex-wrap justify-center gap-2">
                     <Button size="icon"  variant="outline" aria-label="Embed">
                        <RiCodeFill className="w-4 h-4" size={16} strokeWidth={2} aria-hidden="true" />
                     </Button>
                     <Button size="icon"  variant="outline" aria-label="Share on Twitter">
                        <RiTwitterXFill className="w-4 h-4" size={16} strokeWidth={2} aria-hidden="true" />
                     </Button>
                     <Button size="icon"  variant="outline" aria-label="Share on Facebook">
                        <RiFacebookFill className="w-4 h-4" size={16} strokeWidth={2} aria-hidden="true" />
                     </Button>
                     <Button size="icon"  variant="outline" aria-label="Share via email">
                        <RiMailLine className="w-4 h-4" size={16} strokeWidth={2} aria-hidden="true" />
                     </Button>
                  </div>
                  <div className="space-y-2">
                     <div className="relative">
                        <Input
                           ref={inputRef}
                           type="text"
                           className="text-ellipsis pr-8"
                           defaultValue={`${process.env.NEXT_PUBLIC_URL!}/properties/${propertySlug}`}
                           aria-label="Share link"
                           readOnly
                        />
                        <TooltipProvider delayDuration={0}>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <button
                                    onClick={handleCopy}
                                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                                    aria-label={copied ? "Copied" : "Copy to clipboard"}
                                    disabled={copied}
                                 >
                                    <div
                                       className={cn(
                                          "transition-all",
                                          copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                                       )}
                                    >
                                       <Check
                                          className="stroke-emerald-500"
                                          size={16}
                                          strokeWidth={2}
                                          aria-hidden="true"
                                       />
                                    </div>
                                    <div
                                       className={cn(
                                          "absolute transition-all",
                                          copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                                       )}
                                    >
                                       <Copy size={16} strokeWidth={2} aria-hidden="true" />
                                    </div>
                                 </button>
                              </TooltipTrigger>
                              <TooltipContent className="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
                           </Tooltip>
                        </TooltipProvider>
                     </div>
                  </div>
               </div>
            </PopoverContent>
         </Popover>
      </div>
   );
}