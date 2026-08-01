import { ArrowRight } from "lucide-react";
import DashboardPanel from "../widgets/DashboardPanel";
import WidgetHeader from "../widgets/WidgetHeader";
import { quickActions } from "./dashboardData";

const QuickActions = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="Quick Actions" title="Common asset tasks" />

    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {quickActions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.label}
            type="button"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-white"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="truncate text-sm font-bold text-slate-950">{action.label}</span>
            </span>
            <ArrowRight
              size={17}
              className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700"
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  </DashboardPanel>
);

export default QuickActions;
