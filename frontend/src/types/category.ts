import type { Tool } from "./tool";

export type Category = {
  id: number;
  name: string;
  description: string | null;
  color_hex: string | null;
  created_at?: string;
};

export type CategoryWithTools = Category & {
  tools: Tool[];
};
