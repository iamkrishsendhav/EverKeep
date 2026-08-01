// src/pages/Dashboard/Dashboard.jsx

import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";

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
    <DashboardLayout>
      <div className="space-y-6">

        {/* Welcome */}
        <WelcomeSection />

        {/* Stats */}
        <StatsGrid />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RenewalChart />
          <CategoryChart />
        </div>

        {/* Expense + Health */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ExpenseChart />
          <HealthScore />
        </div>

        {/* Renewals + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <UpcomingRenewals />
          <RecentActivity />
        </div>

        {/* AI + Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIInsights />
          <QuickActions />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;