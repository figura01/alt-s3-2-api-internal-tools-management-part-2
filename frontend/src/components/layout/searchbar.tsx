// src/components/layout/navbar-search.tsx

"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";

export function Searchbar() {
  const q = useAppStore((state) => state.q);
  const setQuery = useAppStore((state) => state.setQuery);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleClear() {
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={q}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools, metrics..."
        className="h-10 rounded-full pl-9 pr-10"
      />

      {q && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
