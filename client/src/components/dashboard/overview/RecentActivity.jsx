import { MoreHorizontal } from "lucide-react";
import DashboardPanel from "../widgets/DashboardPanel";
import WidgetHeader from "../widgets/WidgetHeader";
import { activityItems } from "./dashboardData";

const RecentActivity = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader
      eyebrow="Recent Activity"
      title="Latest changes across your workspace"
      action={
        <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">
          <MoreHorizontal size={19} />
          <span className="sr-only">Activity options</span>
        </button>
      }
    />
    <div className="mt-6 divide-y divide-slate-100">
      {activityItems.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600">
              <Icon size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold tracking-tight text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.meta}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-slate-400">{item.time}</span>
          </div>
        );
      })}
    </div>
  </DashboardPanel>
);

export default RecentActivity;
