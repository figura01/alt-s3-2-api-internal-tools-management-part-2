"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToolForm } from "@/components/tools/tool-form";
import type { Tool } from "@/types/tool";
import type { UpdateToolValues } from "@/schemas/tool.schema";
import { useUpdateTool } from "@/hooks/use-tools";

type Props = {
  tool: Tool;
};

export function ToolEditForm({ tool }: Props) {
  const router = useRouter();
  const updateToolMutation = useUpdateTool();

  async function handleSubmit(values: UpdateToolValues) {
    await updateToolMutation.mutateAsync(values);

    toast.success("Tool updated successfully");

    router.push("/tools");
    router.refresh();
  }

  return (
    <ToolForm
      mode="edit"
      initialData={tool}
      onSubmit={handleSubmit}
      isSubmitting={updateToolMutation.isPending}
    />
  );
}
