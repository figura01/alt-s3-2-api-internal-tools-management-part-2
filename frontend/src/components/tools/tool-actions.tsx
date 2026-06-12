"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteToolAction } from "@/components/tools/delete-tool-action";
import { canDeleteTool, canEditTool } from "@/lib/permissions";
import { useCurrentUser } from "@/store/store";
import { MoreHorizontal } from "lucide-react";

type Props = {
  toolId: number;
};

export function ToolActions({ toolId }: Props) {
  const user = useCurrentUser();

  const canEdit = canEditTool(user);
  const canDelete = canDeleteTool(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link href={`/tools/${toolId}`} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            <span>View details</span>
          </Link>
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem asChild>
            <Link href={`/tools/${toolId}/edit`} className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DeleteToolAction toolId={toolId} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
