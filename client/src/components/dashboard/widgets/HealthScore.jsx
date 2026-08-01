import { CheckCircle2 } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";

const HealthScore = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="Health Score" title="Workspace protection status" />

    <div className="mt-7 flex items-center gap-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white text-emerald-600 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <CheckCircle2 size={30} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-4xl font-bold tracking-tight text-slate-950">94</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Excellent coverage across warranties, documents and policies.
        </p>
      </div>
    </div>
  </DashboardPanel>
);

export default HealthScore;
