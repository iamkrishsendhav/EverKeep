import { Sparkles } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { insights } from "../overview/dashboardData";

const AIInsights = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="AI Insights" title="Recommended next steps" />

    <div className="mt-6 space-y-3">
      {insights.map((insight) => (
        <div key={insight} className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-indigo-600">
            <Sparkles size={16} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold leading-6 text-slate-700">{insight}</p>
        </div>
      ))}
    </div>
  </DashboardPanel>
);

export default AIInsights;
