import { CheckCircle2 } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { dashboardSummary, widgetState } from "../overview/dashboardData";

const HealthScore = ({ status = widgetState.populated, summary = dashboardSummary }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="Health" title="Protection status" />

    {status === widgetState.loading ? <div className="mt-6 h-40 animate-pulse rounded-3xl bg-slate-100" /> : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load score.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">Score appears after first records are verified.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-white text-emerald-600 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
          <CheckCircle2 size={24} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[36px] font-semibold tracking-tight text-slate-950">{summary.score}</p>
          <p className="mt-1 text-[14px] text-slate-600">Everything is protected.</p>
        </div>
      </div>
    ) : null}
  </DashboardPanel>
);

export default HealthScore;
