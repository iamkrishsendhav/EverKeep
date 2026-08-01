import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";

const categories = [
  { label: "Electronics", value: 38, tone: "bg-indigo-500" },
  { label: "Home", value: 27, tone: "bg-emerald-500" },
  { label: "Insurance", value: 19, tone: "bg-amber-500" },
  { label: "Subscriptions", value: 16, tone: "bg-slate-900" },
];

const CategoryChart = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="Categories" title="Tracked asset mix" />

    <div className="mt-7 space-y-5">
      {categories.map((category) => (
        <div key={category.label}>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-bold text-slate-950">{category.label}</span>
            <span className="font-semibold text-slate-500">{category.value}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${category.tone}`} style={{ width: `${category.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  </DashboardPanel>
);

export default CategoryChart;
