import { CalendarClock } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { renewalItems, widgetState } from "../overview/dashboardData";

const UpcomingRenewals = ({ status = widgetState.populated, items = renewalItems }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="Upcoming" title="Renewals" />

    {status === widgetState.loading ? <div className="mt-6 h-40 animate-pulse rounded-2xl bg-slate-100" /> : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load renewals.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">No renewals due.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <CalendarClock size={16} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-slate-950">{item.title}</p>
              <p className="mt-1 text-[12px] text-slate-500">{item.date}</p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-semibold text-slate-950">{item.amount}</p>
              <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[12px] font-semibold ${item.tone}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : null}
  </DashboardPanel>
);

export default UpcomingRenewals;
