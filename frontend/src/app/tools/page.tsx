import HeaderPage from "@/components/header-page";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/app/tools/column";
import { getAllTools } from "@/services/tools.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools Management",
  description: "Manage your organization's internal tools and subscriptions",
};

const ToolsPage = async () => {
  const data = await getAllTools();
  console.log("Tools data for table:", data);

  return (
    <div className="flex flex-col items-start justify-center gap-4 w-full mb-10">
      <HeaderPage
        title="Tools"
        subtitle="Manage your tools and subscriptions"
      />

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <h1 className="text-2xl font-bold">Tools List</h1>
          </CardTitle>
          <Button
            size="sm"
            className="gradient-green text-white hover:bg-blue-400 transition"
          >
            <Link href="/tools/create">Add New Tool</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable data={data} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsPage;
