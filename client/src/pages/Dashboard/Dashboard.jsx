// src/pages/Dashboard/Dashboard.jsx

import WelcomeSection from "../../components/dashboard/overview/WelcomeSection";
import StatsGrid from "../../components/dashboard/overview/StatsGrid";
import RecentActivity from "../../components/dashboard/overview/RecentActivity";
import QuickActions from "../../components/dashboard/overview/QuickActions";

import RenewalChart from "../../components/dashboard/widgets/RenewalChart";
import CategoryChart from "../../components/dashboard/widgets/CategoryChart";
import UpcomingRenewals from "../../components/dashboard/widgets/UpcomingRenewals";
import AIInsights from "../../components/dashboard/widgets/AIInsights";
import HealthScore from "../../components/dashboard/widgets/HealthScore";
import ExpenseChart from "../../components/dashboard/widgets/ExpenseChart";

const Dashboard = () => {
  return (
    <div className="space-y-12">
      <WelcomeSection />
      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <RenewalChart />
        </div>
        <div className="xl:col-span-5">
          <CategoryChart />
        </div>

        <div className="xl:col-span-7">
          <ExpenseChart />
        </div>
        <div className="xl:col-span-5">
          <HealthScore />
        </div>

        <div className="xl:col-span-6">
          <UpcomingRenewals />
        </div>
        <div className="xl:col-span-6">
          <RecentActivity />
        </div>

        <div className="xl:col-span-6">
          <AIInsights />
        </div>
        <div className="xl:col-span-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;