// src/components/layout/navbar-search.tsx

"use client";

import { Search, X } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

export function Searchbar() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function updateSearch(query: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    params.delete("page");

    startTransition(() => {
      router.push(`/tools?${params.toString()}`);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateSearch(value);
  }

  function handleClear() {
    setValue("");

    updateSearch("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search tools, metrics..."
        className={cn(
          "h-10 rounded-full pl-9 pr-10",
          isPending && "opacity-70",
        )}
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="
            absolute
            right-1
            top-1/2
            h-8
            w-8
            -translate-y-1/2
            rounded-full
          "
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
