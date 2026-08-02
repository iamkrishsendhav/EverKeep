import StatsCard from "./StatsCard";
import { stats, widgetState } from "./dashboardData";

const StatsGrid = ({ status = widgetState.populated, items = stats }) => {
  if (status === widgetState.error) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6">
        <p className="text-[14px] font-medium text-rose-700">Could not load key metrics.</p>
      </section>
    );
  }

  if (status === widgetState.empty) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-[14px] font-medium text-slate-600">Metrics will appear when records are added.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((stat) => (
        <StatsCard key={stat.label} status={status} stat={stat} />
      ))}
    </section>
  );
};

export default StatsGrid;
