"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AnalyticsInfo({ label, children }: { label: string; children: React.ReactNode }) {
  return <Popover>
    <PopoverTrigger asChild>
      <button type="button" aria-label={label} className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Info className="size-4" aria-hidden="true" />
      </button>
    </PopoverTrigger>
    <PopoverContent align="end" className="max-w-[calc(100vw-2rem)] text-sm leading-relaxed" aria-label={label}>
      {children}
    </PopoverContent>
  </Popover>;
}
