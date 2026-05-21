import HeaderPage from "@/components/header-page";
import SectionKPIs from "@/components/kpis/section-kpis";
import RecentsTools from "@/components/tools/table-recent-tools";
import { getRecentToolsForTable } from "@/services/tools.service";

export default async function Home() {
  const recentTools = (await getRecentToolsForTable()).slice(1, 8);
  console.log("data recentTools: ", recentTools);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <HeaderPage
        title="Internal Tools Dashboard"
        subtitle="Monitor and manage tour organization's software tools and expenses"
      />
      <section className="flex flex-row max-w-7xl px-0 py-2 w-full">
        <SectionKPIs />
      </section>

      <section className="w-full max-w-7xl px-0 py-2">
        <RecentsTools tools={recentTools} />
      </section>
    </div>
  );
}
