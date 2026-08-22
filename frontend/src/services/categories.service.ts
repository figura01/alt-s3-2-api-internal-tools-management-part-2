import { api } from "@/lib/api";

import type { Category } from "@/types/category";

/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  return api<Category[]>("/categories", {
    cache: "no-store",
  });
}

/* -------------------------------------------------------------------------- */
/*                              GET WITH TOOLS                                */
/* -------------------------------------------------------------------------- */

// export async function getCategoriesWithTools(): Promise<CategoryWithTools[]> {
//   return api<CategoryWithTools[]>("/categories?include_tools=true", {
//     cache: "no-store",
//   });
// }
