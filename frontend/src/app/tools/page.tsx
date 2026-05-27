import HeaderPage from "@/components/header-page";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/app/tools/column";
import { getAllTools } from "@/services/tools.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { StatusFilter } from "@/components/tools/status-filter";
import { DepartmentFilter } from "@/components/tools/department-filter";
import { ResetFiltersButton } from "@/components/tools/reset-filters-button";
import { ActiveFilters } from "@/components/tools/active-filters";
export const metadata: Metadata = {
  title: "Tools Management",
  description: "Manage your organization's internal tools and subscriptions",
};

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    department?: string;
    page?: string;
  }>;
};

const ToolsPage = async ({ searchParams }: Props) => {
  const { q, status, department, page } = await searchParams;
  const data = await getAllTools({
    query: q,
    status,
    department,
  });
  const initialPage = Math.max(Number(page ?? 1), 1);
  return (
    <div className="flex flex-col items-start justify-center gap-4 w-full mb-10">
      <HeaderPage
        title="Tools"
        subtitle="Manage your tools and subscriptions"
      />
      {q && (
        <div className="flex flex-row items-center justify-start">
          <p className="text-muted-foreground">
            Search results for{" "}
            <span className="font-medium text-foreground">“{q}”</span>
          </p>
          <Button asChild variant="outline" size="sm" className="ml-2">
            <Link href="/tools">Clear search</Link>
          </Button>
        </div>
      )}

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <h1 className="text-2xl font-bold">Tools List</h1>
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusFilter />
            <DepartmentFilter />
            <ResetFiltersButton />
            <Button
              size="sm"
              className="gradient-green text-white hover:bg-blue-400 transition"
            >
              <Link href="/tools/create">Add New Tool</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <>
              <ActiveFilters />
              <DataTable
                data={data}
                columns={columns}
                initialPage={initialPage}
              />
            </>
          ) : (
            <EmptyState
              title="No tools found"
              description="Try another search term or clear the search."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsPage;
