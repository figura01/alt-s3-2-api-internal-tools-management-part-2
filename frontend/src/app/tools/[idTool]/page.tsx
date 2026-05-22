import { getToolById } from "@/services/tools.service";
import HeaderPage from "@/components/header-page";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";
import { ChevronLeft } from "lucide-react";
import { ApiJsonTool } from "@/types/tool";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Tool Details`,
  description: `View details of a specific tool`,
};

const DetailToolPage = async ({ params }: { params: { idTool: string } }) => {
  const { idTool } = await params;
  const tool = await getToolById(idTool);

  console.log("tool:", tool);
  return (
    <div className="flex flex-col items-start justify-center gap-6 w-full mb-10">
      <HeaderPage
        title={tool.name}
        subtitle={`Details and management for ${tool.name}`}
      />
      <div className="flex flex-row items-center justify-between gap-6 w-full">
        <h1 className="text-2xl font-bold">Tool Detail {tool.name}</h1>
        <Button
          asChild
          size="sm"
          className="ml-auto bg-blue-500 text-white hover:bg-blue-400 transition"
        >
          <Link href="/tools" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Tools List
          </Link>
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p>
            <strong>ID:</strong> {tool.id}
          </p>
          <p>
            <strong>Name:</strong> {tool.name}
          </p>
          <p>
            <strong>Icon:</strong>{" "}
            {tool?.icon_url ? (
              <Image
                width={32}
                height={32}
                src={tool.icon_url}
                alt={tool.name}
                className="h-10 w-10"
              />
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Category:</strong> {tool.category || "N/A"}
          </p>
          <p>
            <strong>Vendor:</strong> {tool.vendor || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {tool.description}
          </p>
          <p>
            <strong>Monthly Cost:</strong> €
            {tool.monthly_cost?.toLocaleString()}
          </p>

          <p>
            <strong>Department:</strong> {tool.owner_department}
          </p>
          <p>
            <strong>Users:</strong>{" "}
            {tool?.active_users_count?.toLocaleString() || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {tool.status}
          </p>
          <p>
            <strong>Last Update:</strong>{" "}
            {tool?.last_update
              ? new Date(tool?.last_update).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {tool?.updated_at
              ? new Date(tool?.updated_at).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {tool?.created_at
              ? new Date(tool?.created_at).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            {tool.website_url ? (
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {tool.website_url}
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailToolPage;
