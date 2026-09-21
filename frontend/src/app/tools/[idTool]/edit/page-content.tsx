"use client";
import { useQuery } from "@tanstack/react-query";
import { AccessGate } from "@/components/auth/access-gate";
import { use } from "react";
import { getToolById } from "@/services/tools.service";
import { ToolEditForm } from "@/components/tools/tool-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";





type Props = {
  params: Promise<{
    idTool: string;
  }>;
};

function PageContent({ params }: Props) {
  const { idTool } = use(params);
  const query = useQuery({ queryKey: ["tools", idTool], queryFn: () => getToolById(idTool) });
  if (query.isPending) return <p role="status">Loading…</p>;
  if (query.isError) return <p role="alert">Unable to load this page. <button onClick={() => query.refetch()}>Retry</button></p>;
  const tool = query.data;

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

export default function EditToolPage(props: { params: Promise<{ idTool: string }> }) { return <AccessGate roles={["ADMIN"]}><PageContent {...props} /></AccessGate>; }
