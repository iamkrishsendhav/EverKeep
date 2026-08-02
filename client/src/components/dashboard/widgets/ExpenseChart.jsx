import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";
import { expenseSeries, widgetState } from "../overview/dashboardData";

const ExpenseChart = ({ status = widgetState.populated, series = expenseSeries }) => (
  <DashboardPanel>
    <WidgetHeader eyebrow="Expenses" title="Cost snapshot" />

    {status === widgetState.loading ? <div className="mt-6 h-40 animate-pulse rounded-2xl bg-slate-100" /> : null}

    {status === widgetState.error ? (
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <p className="text-[14px] font-medium text-rose-700">Unable to load expense data.</p>
      </div>
    ) : null}

    {status === widgetState.empty ? (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[14px] font-medium text-slate-600">No expense records yet.</p>
      </div>
    ) : null}

    {status === widgetState.populated ? (
      <div className="mt-6 space-y-4">
        {series.map((expense) => (
          <div key={expense.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)_4rem] items-center gap-3">
            <span className="truncate text-[14px] font-medium text-slate-700">{expense.label}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.min(Math.max(expense.value, 0), 100)}%` }} />
            </div>
            <span className="text-right text-[14px] font-semibold text-slate-950">{expense.amount}</span>
          </div>
        ))}
      </div>
    ) : null}
  </DashboardPanel>
);

export default ExpenseChart;
