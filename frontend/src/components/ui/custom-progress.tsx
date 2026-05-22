"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type CustomProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  value: number;
  label?: string;
  from?: string;
  to?: string;
  angle?: number;
};

export function CustomProgress({
  value,
  label,
  from = "#a78bfa",
  to = "#4f46e5",
  angle = 90,
  className,
  ...props
}: CustomProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-6 w-full overflow-hidden rounded-full bg-transparent",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="relative flex h-full items-center rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${safeValue}%`,
          backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`,
        }}
      >
        {label && (
          <span className="absolute left-5 z-10 text-sm text-white">
            {label}
          </span>
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}
