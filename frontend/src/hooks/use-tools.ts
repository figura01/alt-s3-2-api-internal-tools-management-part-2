"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createTool,
  deleteTool,
  getToolById,
  getTools,
  updateTool,
} from "@/services/tools.service";

import type { GetToolsParams } from "@/services/tools.service";

import type { ToolsResponse } from "@/types/tool";

/* -------------------------------------------------------------------------- */
/*                                 QUERY KEYS                                 */
/* -------------------------------------------------------------------------- */

export const toolsQueryKey = ["tools"] as const;

export const toolQueryKey = (id: string) => ["tools", id] as const;

/* -------------------------------------------------------------------------- */
/*                                  GET ALL                                   */
/* -------------------------------------------------------------------------- */

export function useTools(
  params: GetToolsParams = {},
  initialData?: ToolsResponse,
) {
  return useQuery({
    queryKey: [...toolsQueryKey, params],
    queryFn: () => getTools(params),
    initialData,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  GET ONE                                   */
/* -------------------------------------------------------------------------- */

export function useTool(id: string) {
  return useQuery({
    queryKey: toolQueryKey(String(id)),
    queryFn: () => getToolById(String(id)),
    enabled: Boolean(id),
  });
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export function useUpdateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTool,

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: toolsQueryKey,
        }),

        queryClient.invalidateQueries({
          queryKey: toolQueryKey(String(variables.id)),
        }),
      ]);
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTool,

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: toolsQueryKey,
        }),

        queryClient.invalidateQueries({
          queryKey: toolQueryKey(String(id)),
        }),
      ]);

      toast.success("Tool deleted successfully");
    },

    onError: () => {
      toast.error("Failed to delete tool");
    },
  });
}
