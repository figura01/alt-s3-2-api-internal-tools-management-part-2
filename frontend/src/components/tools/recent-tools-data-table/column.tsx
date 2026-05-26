//

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
    header: "Status",
  },
  {
    accessorKey: "tool",
    header: "Tool",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "users",
    header: "Users",
  },
  {
    accessorKey: "monthlyCost",
    header: "Monthly Cost",
  },

  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
