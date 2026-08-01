import { CalendarClock } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { renewalItems } from "../overview/dashboardData";

const UpcomingRenewals = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="Upcoming" title="Renewals needing attention" />

    <div className="mt-6 space-y-3">
      {renewalItems.map((item) => (
        <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
            <CalendarClock size={19} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-950">{item.title}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{item.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-950">{item.amount}</p>
            <span className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${item.tone}`}>
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </DashboardPanel>
);

export default UpcomingRenewals;
