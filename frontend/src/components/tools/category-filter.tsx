// src/components/tools/category-filter.tsx

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppStore } from "@/store/store";

import type { Category } from "@/types/category";

type CategoryFilterProps = {
  categories: Category[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const category = useAppStore((state) => state.category);

  const setCategory = useAppStore((state) => state.setCategory);

  return (
    <Select value={category} onValueChange={setCategory}>
      <SelectTrigger className="h-9 w-44">
        <SelectValue placeholder="Category" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>

        {categories.map((category) => (
          <SelectItem key={category.id} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
