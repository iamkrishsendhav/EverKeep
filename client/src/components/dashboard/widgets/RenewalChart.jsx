import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";

const renewalBars = [
  { label: "Aug", value: 68 },
  { label: "Sep", value: 42 },
  { label: "Oct", value: 76 },
  { label: "Nov", value: 54 },
  { label: "Dec", value: 88 },
  { label: "Jan", value: 63 },
];

const RenewalChart = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="Renewals" title="Upcoming lifecycle events" />

    <div className="mt-7 flex h-56 items-end gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4">
      {renewalBars.map((item) => (
        <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3">
          <div className="flex flex-1 items-end rounded-full bg-white p-1">
            <div
              className="w-full rounded-full bg-slate-950"
              style={{ height: `${item.value}%` }}
              aria-hidden="true"
            />
          </div>
          <span className="text-center text-xs font-bold text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  </DashboardPanel>
);

export default RenewalChart;
