import { AccessGate } from "@/components/auth/access-gate";
import type { Metadata } from "next";
import HeaderPage from "@/components/header-page";
import { ToolCreateForm } from "@/components/tools/tool-create-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Tool",
};

export default function NewToolPage() {
  return (
    <AccessGate roles={["ADMIN"]}><main className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <HeaderPage
          title="Create New Tool"
          subtitle="Add a new tool to the catalog."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <ToolCreateForm />
        </CardContent>
      </Card>
    </main></AccessGate>
  );
}
