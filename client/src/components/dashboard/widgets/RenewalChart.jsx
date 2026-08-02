import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { renewalTrend, widgetState } from "../overview/dashboardData";

const RenewalChart = ({ status = widgetState.populated, series = renewalTrend }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="Renewals" title="Renewal trend" />

    {status === widgetState.loading ? <div className="mt-6 h-56 animate-pulse rounded-3xl bg-slate-100" /> : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load renewal trend.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">No renewal history yet.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 flex h-56 items-end gap-3 rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
        {series.map((item) => (
          <div key={item.month} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
            <div className="flex flex-1 items-end rounded-full bg-white p-1">
              <div className="w-full rounded-full bg-slate-900" style={{ height: `${Math.min(Math.max(item.value, 0), 100)}%` }} aria-hidden="true" />
            </div>
            <span className="text-center text-[12px] font-medium text-slate-500">{item.month}</span>
          </div>
        ))}
      </div>
    ) : null}
  </DashboardPanel>
);

export default RenewalChart;
