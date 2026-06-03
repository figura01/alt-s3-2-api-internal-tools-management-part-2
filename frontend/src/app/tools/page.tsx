import HeaderPage from "@/components/header-page";
import { ToolsTable } from "@/components/tools/tools-table";
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
import { SearchResultLabel } from "@/components/tools/search-result-label";
import { CategoryFilter } from "@/components/tools/category-filter";
import {
  getUniqueToolCategories,
  getUniqueToolDepartments,
} from "@/utils/tools-filters";

export const metadata: Metadata = {
  title: "Tools Management",
  description: "Manage your organization's internal tools and subscriptions",
};

const ToolsPage = async () => {
  const data = await getAllTools();
  const departments = getUniqueToolDepartments(data);
  const categories = getUniqueToolCategories(data);

  return (
    <div className="flex flex-col items-start justify-center gap-4 w-full mb-10">
      <HeaderPage
        title="Tools"
        subtitle="Manage your tools and subscriptions"
      />
      <SearchResultLabel />

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <h1 className="text-2xl font-bold">Tools List</h1>
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusFilter />
            <DepartmentFilter departments={departments} />
            <CategoryFilter categories={categories} />
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
              <ToolsTable data={data} columns={columns} />
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
