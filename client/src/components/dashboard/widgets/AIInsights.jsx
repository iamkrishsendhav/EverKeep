import { Sparkles } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { insights, widgetState } from "../overview/dashboardData";

const AIInsights = ({ status = widgetState.populated, items = insights }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="AI" title="Recommended actions" />

    {status === widgetState.loading ? <div className="mt-6 h-40 animate-pulse rounded-2xl bg-slate-100" /> : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load AI actions.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">No actions recommended right now.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 space-y-3">
        {items.map((insight) => (
          <div key={insight} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <Sparkles size={15} aria-hidden="true" />
            </div>
            <p className="text-[14px] font-medium leading-6 text-slate-700">{insight}</p>
          </div>
        ))}
      </div>
    ) : null}
  </DashboardPanel>
);

export default AIInsights;
