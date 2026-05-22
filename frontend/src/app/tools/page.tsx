import HeaderPage from "@/components/header-page";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/app/tools/column";
import { getAllTools } from "@/services/tools.service";

const ToolsPage = async () => {
  const data = await getAllTools();
  console.log("Tools data for table:", data);

  return (
    <div>
      <HeaderPage
        title="Tools"
        subtitle="Manage your tools and subscriptions"
      />
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default ToolsPage;
