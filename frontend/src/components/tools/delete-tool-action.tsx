// src/components/tools/delete-tool-action.tsx

"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteTool } from "@/hooks/use-tools";

type Props = {
  toolId: number;
};

export function DeleteToolAction({ toolId }: Props) {
  const [open, setOpen] = useState(false);

  const deleteToolMutation = useDeleteTool();

  async function handleDelete() {
    await deleteToolMutation.mutateAsync(toolId);
    setOpen(false);
  }

  return (
    <>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          console.log("DELETE CLICKED");
          setOpen(true);
        }}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>

      <DeleteDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete tool"
        description="Are you sure you want to delete this tool? This action cannot be undone."
        isPending={deleteToolMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
