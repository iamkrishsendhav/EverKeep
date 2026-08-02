import { MoreHorizontal } from "lucide-react";
import DashboardPanel from "../widgets/DashboardPanel";
import WidgetHeader from "../widgets/WidgetHeader";
import { activityItems, widgetState } from "./dashboardData";

const RecentActivity = ({ status = widgetState.populated, items = activityItems }) => {
  return (
    <DashboardPanel>
      <WidgetHeader
        eyebrow="Activity"
        title="Recent changes"
        action={
          <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">
            <MoreHorizontal size={18} />
            <span className="sr-only">Activity options</span>
          </button>
        }
      />

      {status === widgetState.loading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : null}

      {status === widgetState.error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
          <p className="text-[14px] font-medium text-rose-700">Unable to load activity.</p>
        </div>
      ) : null}

      {status === widgetState.empty ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[14px] font-medium text-slate-600">No activity yet.</p>
        </div>
      ) : null}

      {status === widgetState.populated ? (
        <div className="mt-6 divide-y divide-slate-100">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div key={`${item.title}-${item.time}`} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium tracking-tight text-slate-950">{item.title}</p>
                  <p className="mt-1 text-[12px] text-slate-500">{item.meta}</p>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-slate-400">{item.time}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </DashboardPanel>
  );
};

export default RecentActivity;
