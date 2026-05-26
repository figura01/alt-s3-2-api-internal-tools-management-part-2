"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToolForm } from "@/components/tools/tool-form";
import { useCreateTool } from "@/hooks/use-tools";
import type { CreateToolValues } from "@/schemas/tool.schema";

export function ToolCreateForm() {
  const router = useRouter();
  const createToolMutation = useCreateTool();

  async function handleSubmit(values: CreateToolValues) {
    await createToolMutation.mutateAsync(values);
    toast.success("Tool created successfully");
    router.push("/tools");
  }

  return (
    <ToolForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={createToolMutation.isPending}
    />
  );
}
