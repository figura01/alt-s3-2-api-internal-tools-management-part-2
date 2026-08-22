import type { Metadata } from "next";

import HeaderPage from "@/components/header-page";

import { ToolsTable } from "@/components/tools/tools-table";
import { columns } from "@/app/tools/column";

import { getTools } from "@/services/tools.service";
import { getCategories } from "@/services/categories.service";
import { getDepartments } from "@/services/departments.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { EmptyState } from "@/components/empty-state";

import { StatusFilter } from "@/components/tools/status-filter";
import { DepartmentFilter } from "@/components/tools/department-filter";
import { CategoryFilter } from "@/components/tools/category-filter";
import { ResetFiltersButton } from "@/components/tools/reset-filters-button";
import { ActiveFilters } from "@/components/tools/active-filters";
import { SearchResultLabel } from "@/components/tools/search-result-label";
import { AddToolButton } from "@/components/tools/add-tool-button";

export const metadata: Metadata = {
  title: "Tools Management",
  description: "Manage your organization's internal tools and subscriptions",
};

const ToolsPage = async () => {
  const [toolsResponse, departments, categories] = await Promise.all([
    getTools(),
    getDepartments(),
    getCategories(),
  ]);

  return (
    <div className="flex w-full flex-col items-start justify-center gap-4 mb-10">
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

            <AddToolButton />
          </div>
        </CardHeader>

        <CardContent>
          {toolsResponse.data.length > 0 ? (
            <>
              <ActiveFilters />

              <ToolsTable initialData={toolsResponse} columns={columns} />
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
