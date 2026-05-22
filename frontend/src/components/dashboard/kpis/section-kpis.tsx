import SingleKpi from "@/components/kpis/single-kpi";

const SectionKPIs = () => {
  const dataKpis = [
    {
      title: "Monthly Budget",
      value: 28.75,
      change: "+10%",
      icon: "TrendingUp",
      type: "cost",
    },

    {
      title: "Active Tools",
      value: 147,
      change: "+8",
      icon: "Wrench",
      type: "tools",
    },
    {
      title: "Departments",
      value: 1.2,
      change: "+2",
      icon: "Building2",
      type: "departments",
    },
    {
      title: "Cost/User",
      value: 156,
      change: "5%",
      icon: "Users",
      type: "users",
    },
  ];

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {dataKpis.map((kpi) => (
        <SingleKpi
          className="span-1"
          key={kpi.title}
          type={kpi.type}
          title={kpi.title}
          value={typeof kpi.value === "number" ? `$${kpi.value}K` : kpi.value}
          progress={typeof kpi.change === "string" ? parseFloat(kpi.change) : 0}
        />
      ))}
    </div>
  );
};

export default SectionKPIs;
