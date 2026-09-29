import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CreditCard,
  FileText,
  Package,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getAssets } from "../../services/asset.service";
import { getDocuments } from "../../services/document.service";
import { getSubscriptions } from "../../services/subscription.service";
import { getWarranties } from "../../services/warranty.service";
import { getEvents } from "../../services/calendar.service";
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
import { widgetState } from "../../components/dashboard/overview/dashboardData";

const emptyDashboardData = {
  assets: [],
  documents: [],
  subscriptions: [],
  warranties: [],
  events: [],
};

const getResponseList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const getDaysUntil = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
};

const getMonthlySubscriptionCost = (subscription) => {
  const amount = Number(subscription?.amount) || 0;

  switch (subscription?.billingCycle) {
    case "weekly":
      return amount * 4.345;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "half-yearly":
      return amount / 6;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
};

const formatShortDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const buildRecentActivity = ({
  assets,
  documents,
  subscriptions,
  warranties,
  events,
}) => {
  return [
    ...assets.map((asset) => ({
      icon: Package,
      title: "Asset saved",
      meta: asset.name || "Untitled asset",
      time: formatShortDate(asset.createdAt),
      createdAt: asset.createdAt,
    })),
    ...documents.map((document) => ({
      icon: FileText,
      title: "Document uploaded",
      meta: document.name || document.originalName || "Untitled document",
      time: formatShortDate(document.createdAt),
      createdAt: document.createdAt,
    })),
    ...subscriptions.map((subscription) => ({
      icon: CreditCard,
      title: "Subscription tracked",
      meta: subscription.name || "Untitled subscription",
      time: formatShortDate(subscription.createdAt),
      createdAt: subscription.createdAt,
    })),
    ...warranties.map((warranty) => ({
      icon: ShieldCheck,
      title: "Warranty saved",
      meta: warranty.title || "Untitled warranty",
      time: formatShortDate(warranty.createdAt),
      createdAt: warranty.createdAt,
    })),
    ...events.map((event) => ({
      icon: CalendarClock,
      title: "Calendar event added",
      meta: event.title || "Untitled event",
      time: formatShortDate(event.createdAt),
      createdAt: event.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);
};

const getWidgetStatus = (pageStatus, hasData) => {
  if (pageStatus === widgetState.loading || pageStatus === widgetState.error) {
    return pageStatus;
  }

  return hasData ? widgetState.populated : widgetState.empty;
};

const Dashboard = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [status, setStatus] = useState(widgetState.loading);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setStatus(widgetState.loading);

      const results = await Promise.allSettled([
        getAssets(),
        getDocuments(),
        getSubscriptions(),
        getWarranties(),
        getEvents(),
      ]);

      if (!isMounted) {
        return;
      }

      const [
        assetsResult,
        documentsResult,
        subscriptionsResult,
        warrantiesResult,
        eventsResult,
      ] = results;

      const nextData = {
        assets:
          assetsResult.status === "fulfilled"
            ? getResponseList(assetsResult.value)
            : [],
        documents:
          documentsResult.status === "fulfilled"
            ? getResponseList(documentsResult.value)
            : [],
        subscriptions:
          subscriptionsResult.status === "fulfilled"
            ? getResponseList(subscriptionsResult.value)
            : [],
        warranties:
          warrantiesResult.status === "fulfilled"
            ? getResponseList(warrantiesResult.value)
            : [],
        events:
          eventsResult.status === "fulfilled"
            ? getResponseList(eventsResult.value)
            : [],
      };

      setDashboardData(nextData);

      const hasError = results.some((result) => result.status === "rejected");
      const hasData = Object.values(nextData).some((list) => list.length > 0);

      setStatus(
        hasError && !hasData
          ? widgetState.error
          : hasData
            ? widgetState.populated
            : widgetState.empty,
      );
    };

    loadDashboard();

    const handleAssetChange = () => {
      loadDashboard();
    };

    window.addEventListener("everkeep:assets:changed", handleAssetChange);

    return () => {
      isMounted = false;
      window.removeEventListener("everkeep:assets:changed", handleAssetChange);
    };
  }, []);

  const summary = useMemo(() => {
    const firstName = user?.name?.trim()?.split(/\s+/)[0] || "there";

    return {
      greeting: `Welcome back, ${firstName}`,
      title:
        status === widgetState.empty
          ? "Start building your workspace."
          : "Everything is organized.",
      subtitle:
        status === widgetState.empty
          ? "Your dashboard will fill in as you add assets, documents, renewals and events."
          : "Your EverKeep records are scoped to your account.",
      score: status === widgetState.empty ? 0 : 94,
      scoreLabel: "Workspace health",
    };
  }, [status, user]);

  const stats = useMemo(() => {
    const { assets, documents, subscriptions, warranties, events } =
      dashboardData;

    const upcomingRenewals = [
      ...assets.map((asset) => asset.warrantyExpiry),
      ...warranties.map((warranty) => warranty.expiryDate),
      ...subscriptions.map((subscription) => subscription.nextBillingDate),
      ...events.map((event) => event.startDate),
    ].filter((date) => {
      const days = getDaysUntil(date);
      return days !== null && days >= 0 && days <= 30;
    }).length;

    return [
      {
        icon: Package,
        label: "Assets",
        value: String(assets.length),
        detail: "Active records",
        tone: "text-slate-700 bg-slate-100 border-slate-200",
      },
      {
        icon: FileText,
        label: "Documents",
        value: String(documents.length),
        detail: "Uploaded files",
        tone: "text-slate-700 bg-slate-100 border-slate-200",
      },
      {
        icon: CalendarClock,
        label: "Due Soon",
        value: String(upcomingRenewals),
        detail: "Next 30 days",
        tone: "text-slate-700 bg-slate-100 border-slate-200",
      },
      {
        icon: CreditCard,
        label: "Subscriptions",
        value: String(subscriptions.length),
        detail: "Tracked renewals",
        tone: "text-slate-700 bg-slate-100 border-slate-200",
      },
    ];
  }, [dashboardData]);

  const categoryMix = useMemo(() => {
    const counts = dashboardData.assets.reduce((accumulator, asset) => {
      const category = asset?.category || "Other";
      accumulator[category] = (accumulator[category] || 0) + 1;
      return accumulator;
    }, {});

    const total = dashboardData.assets.length || 1;

    return Object.entries(counts)
      .map(([label, count]) => ({
        id: label,
        label,
        value: Math.round((count / total) * 100),
      }))
      .slice(0, 4);
  }, [dashboardData.assets]);

  const expenseSeries = useMemo(() => {
    const monthly = dashboardData.subscriptions
      .filter((subscription) => subscription?.status === "active")
      .reduce(
        (total, subscription) => total + getMonthlySubscriptionCost(subscription),
        0,
      );

    return [
      {
        id: "subscriptions",
        label: "Subscriptions",
        amount: formatCurrency(monthly),
        value: Math.min(Math.round(monthly / 10), 100),
      },
    ];
  }, [dashboardData.subscriptions]);

  const upcomingItems = useMemo(() => {
    return [
      ...dashboardData.subscriptions.map((subscription) => ({
        id: subscription._id || subscription.id,
        title: subscription.name || "Subscription",
        date: formatShortDate(subscription.nextBillingDate),
        amount: formatCurrency(subscription.amount),
        status: "Renewal",
        tone: "text-indigo-700 bg-indigo-50 border-indigo-100",
        dueDate: subscription.nextBillingDate,
      })),
      ...dashboardData.warranties.map((warranty) => ({
        id: warranty._id || warranty.id,
        title: warranty.title || "Warranty",
        date: formatShortDate(warranty.expiryDate),
        amount: "Expires",
        status: "Warranty",
        tone: "text-amber-700 bg-amber-50 border-amber-100",
        dueDate: warranty.expiryDate,
      })),
    ]
      .filter((item) => {
        const days = getDaysUntil(item.dueDate);
        return days !== null && days >= 0;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  }, [dashboardData.subscriptions, dashboardData.warranties]);

  const recentActivity = useMemo(
    () => buildRecentActivity(dashboardData),
    [dashboardData],
  );

  const hasCategories = categoryMix.length > 0;
  const hasExpenses = expenseSeries.some((item) => item.value > 0);
  const hasUpcoming = upcomingItems.length > 0;
  const hasActivity = recentActivity.length > 0;

  return (
    <div className="space-y-12">
      <WelcomeSection status={status} data={summary} />
      <StatsGrid status={status} items={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <RenewalChart status={status} />
        </div>
        <div className="xl:col-span-5">
          <CategoryChart
            status={getWidgetStatus(status, hasCategories)}
            items={categoryMix}
          />
        </div>

        <div className="xl:col-span-7">
          <ExpenseChart
            status={getWidgetStatus(status, hasExpenses)}
            series={expenseSeries}
          />
        </div>
        <div className="xl:col-span-5">
          <HealthScore />
        </div>

        <div className="xl:col-span-6">
          <UpcomingRenewals
            status={getWidgetStatus(status, hasUpcoming)}
            items={upcomingItems}
          />
        </div>
        <div className="xl:col-span-6">
          <RecentActivity
            status={getWidgetStatus(status, hasActivity)}
            items={recentActivity}
          />
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
