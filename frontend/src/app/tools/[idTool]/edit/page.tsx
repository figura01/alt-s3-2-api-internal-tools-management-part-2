import { getToolById } from "@/services/tools.service";
import { FormTool as EditToolForm } from "@/components/tools/form-tool";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ idTool: string }>;
}) {
  const { idTool } = await params;

  const tool = await getToolById(idTool);

  return (
    <main className="space-y-6 p-6">
      <EditToolForm initialData={tool} />
    </main>
  );
}
