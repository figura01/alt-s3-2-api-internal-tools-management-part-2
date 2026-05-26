// - Grid cards OU table détaillée (votre choix UX)
// - Tool icon, name, description complète
// - Category, Status (mêmes badges), User count
// - Monthly cost, Last update, Department
// - Quick actions (Edit, View details, Disable/Enable)//

"use client";

import { CustomBadge } from "@/components/ui/custom-badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { CustomImage } from "@/components/custom-image";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Tool } from "@/types/tool";
import { formatDate } from "@/utils/formatDate";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type T = {
//   id: string;
//   icon_url: string;
//   name: string;
//   description: string;
//   category: string;
//   status: "active" | "expired" | "unused";
//   user_count: number;
//   monthly_cost: number;
//   last_update: Date;
//   department: string;
//   quick_actions: string[];
// };

import { gradients } from "@/lib/gradients";

const renderBadge = (status: string) => {
  console.log("Rendering badge for status: ", status); // Debug log
  return status === "active" ? (
    <CustomBadge angle={90} {...gradients.green}>
      {status}
    </CustomBadge>
  ) : status === "unused" ? (
    <CustomBadge angle={90} {...gradients.red}>
      {status}
    </CustomBadge>
  ) : (
    <CustomBadge angle={90} {...gradients.orange}>
      {status}
    </CustomBadge>
  );
};

export const columns: ColumnDef<Tool>[] = [
  {
    accessorKey: "icon_url",
    header: "Tool Icon",
    cell: ({ row }) => {
      const value = row.original.icon_url;
      return value ? (
        <Image
          src={String(value)}
          alt={String(row.original.name)}
          width={32}
          height={32}
          className="rounded"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-200 rounded">N/A</div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.original.status;
      return renderBadge(value);
    },
  },
  {
    accessorKey: "active_users_count",
    header: "User Count",
  },
  {
    accessorKey: "monthly_cost",
    header: "Monthly Cost",
  },
  {
    accessorKey: "last_update",
    header: "Last Update",
    cell: ({ row }) => {
      const value = row.original.last_update;
      return value ? formatDate(String(value)) : "N/A";
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tool = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                console.log("View", tool.id);
              }}
            >
              <Link href={`/tools/${tool.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                <span>View details</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/tools/${tool.id}/edit`}
                className="flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
