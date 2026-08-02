import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { categoryMix, widgetState } from "../overview/dashboardData";

const tones = ["bg-slate-900", "bg-slate-700", "bg-slate-500", "bg-slate-400"];

const CategoryChart = ({ status = widgetState.populated, items = categoryMix }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="Categories" title="Asset mix" />

    {status === widgetState.loading ? <div className="mt-6 h-40 animate-pulse rounded-2xl bg-slate-100" /> : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load category mix.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">No categorized assets yet.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 space-y-4">
        {items.map((category, index) => (
          <div key={category.id}>
            <div className="flex items-center justify-between gap-4 text-[14px]">
              <span className="font-medium text-slate-900">{category.label}</span>
              <span className="font-medium text-slate-500">{category.value}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${tones[index % tones.length]}`} style={{ width: `${Math.min(Math.max(category.value, 0), 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    ) : null}
  </DashboardPanel>
);

export default CategoryChart;
