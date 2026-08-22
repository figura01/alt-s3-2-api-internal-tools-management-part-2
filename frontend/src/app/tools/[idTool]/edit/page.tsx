import { getToolById } from "@/services/tools.service";
import { ToolEditForm } from "@/components/tools/tool-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Tool",
  description:
    "Update the details of your tool to keep your dashboard up-to-date",
};

type Props = {
  params: Promise<{
    idTool: string;
  }>;
};

export default async function EditToolPage({ params }: Props) {
  const { idTool } = await params;

  const tool = await getToolById(idTool);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <HeaderPage
        title="Edit Tool"
        subtitle="Update the details of your tool to keep your dashboard up-to-date"
      />

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Edit Tool</CardTitle>

          <Button
            asChild
            size="sm"
            className="ml-auto gradient-green text-white hover:bg-blue-400 transition"
          >
            <Link href="/tools" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Tools List
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <ToolEditForm tool={tool} />
        </CardContent>
      </Card>
    </main>
  );
}
