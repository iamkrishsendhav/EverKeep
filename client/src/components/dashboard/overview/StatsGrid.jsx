import StatsCard from "./StatsCard";
import { stats } from "./dashboardData";

const StatsGrid = () => (
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => (
      <StatsCard key={stat.label} stat={stat} />
    ))}
  </section>
);

export default StatsGrid;
