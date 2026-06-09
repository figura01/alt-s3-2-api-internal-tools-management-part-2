"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTool,
  deleteTool,
  getAllTools,
  getToolById,
  updateTool,
} from "@/services/tools.service";
import { Tool } from "@/types/tool";
import { toast } from "sonner";

export const toolsQueryKey = ["tools"] as const;

export function useTools(initialData?: Tool[]) {
  return useQuery({
    queryKey: toolsQueryKey,
    queryFn: () => getAllTools(),
    initialData,
  });
}

export function useTool(id: number) {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: () => getToolById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTool,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: toolsQueryKey,
      });
    },
  });
}

export function useUpdateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTool,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: toolsQueryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: ["tool", variables.id],
      });
    },
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTool,

    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({
        queryKey: toolsQueryKey,
      });

      await queryClient.invalidateQueries({
        queryKey: ["tool", id],
      });

      toast.success("Tool deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete tool");
    },
  });
}
