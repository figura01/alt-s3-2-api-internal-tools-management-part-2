//

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/data-table/sortable-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type T = {
  id: string;
  tool: string;
  department: string;
  users: number;
  monthlyCost: number;
  status: "active" | "exiring" | "unused";
  actions: () => void;
};

export const columns: ColumnDef<T>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Status" />;
    },
  },
  {
    accessorKey: "tool",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Tool" />;
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Department" />;
    },
  },
  {
    accessorKey: "users",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Users" />;
    },
  },
  {
    accessorKey: "monthlyCost",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Monthly Cost" />;
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Amount" />;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
