// - Grid cards OU table détaillée (votre choix UX)
// - Tool icon, name, description complète
// - Category, Status (mêmes badges), User count
// - Monthly cost, Last update, Department
// - Quick actions (Edit, View details, Disable/Enable)//

"use client";

import { CustomBadge } from "@/components/ui/custom-badge";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { SortableHeader } from "@/components/data-table/sortable-header";

import type { Tool } from "@/types/tool";

import { gradients } from "@/lib/gradients";
import { ToolActions } from "@/components/tools/tool-actions";

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
    header: ({ column }) => {
      return <SortableHeader column={column} label="Name" />;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Category" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Status" />;
    },
    cell: ({ row }) => {
      const value = row.original.status;
      return renderBadge(String(value));
    },
  },
  {
    accessorKey: "active_users_count",
    header: ({ column }) => {
      return <SortableHeader column={column} label="User Count" />;
    },
  },
  {
    accessorKey: "monthly_cost",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Monthly Cost" />;
    },
  },
  {
    accessorKey: "last_update",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Last Update" />;
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return <SortableHeader column={column} label="Department" />;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tool = row.original;

      return <ToolActions toolId={Number(tool.id)} />;
    },
  },
];
