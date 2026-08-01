import DashboardPanel from "./DashboardPanel";
import WidgetHeader from "./WidgetHeader";

const expenses = [
  { label: "Warranty", amount: "$420", value: 34 },
  { label: "Insurance", amount: "$1,420", value: 82 },
  { label: "Subscriptions", amount: "$186", value: 22 },
  { label: "Service", amount: "$640", value: 48 },
];

const ExpenseChart = () => (
  <DashboardPanel className="p-5 sm:p-6">
    <WidgetHeader eyebrow="Expenses" title="Lifecycle cost snapshot" />

    <div className="mt-6 space-y-4">
      {expenses.map((expense) => (
        <div key={expense.label} className="grid grid-cols-[7rem_minmax(0,1fr)_4rem] items-center gap-3">
          <span className="truncate text-sm font-bold text-slate-700">{expense.label}</span>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${expense.value}%` }} />
          </div>
          <span className="text-right text-sm font-bold text-slate-950">{expense.amount}</span>
        </div>
      ))}
    </div>
  </DashboardPanel>
);

export default ExpenseChart;
