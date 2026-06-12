// src/components/tools/add-tool-button.tsx

"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { canCreateTool } from "@/lib/permissions";
import { useCurrentUser } from "@/store/store";

export function AddToolButton() {
  const user = useCurrentUser();

  if (!canCreateTool(user)) {
    return null;
  }

  return (
    <Button
      size="sm"
      className="gradient-green text-white hover:bg-blue-400 transition"
      asChild
    >
      <Link href="/tools/create">Add New Tool</Link>
    </Button>
  );
}
