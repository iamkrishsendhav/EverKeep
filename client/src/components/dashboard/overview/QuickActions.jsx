import { ArrowRight } from "lucide-react";
import DashboardPanel from "../widgets/DashboardPanel";
import WidgetHeader from "../widgets/WidgetHeader";
import { quickActions, widgetState } from "./dashboardData";

const QuickActions = ({ status = widgetState.populated, items = quickActions }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="Actions" title="Quick actions" />

    {status === widgetState.loading ? (
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((skeleton) => (
          <div key={skeleton} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    ) : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load actions.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">No actions available.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-white"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="truncate text-[15px] font-medium text-slate-950">{action.label}</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    ) : null}
  </DashboardPanel>
);

export default QuickActions;
