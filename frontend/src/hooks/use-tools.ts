"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTool, updateTool } from "@/services/tools.service";

export function useCreateTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTool,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tools"],
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
        queryKey: ["tools"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["tool", variables.id],
      });
    },
  });
}
