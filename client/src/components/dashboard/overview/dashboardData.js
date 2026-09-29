import {
  Activity,
  Bell,
  Clock3,
  FileCheck2,
  Package,
  Plus,
  ShieldCheck,
  TriangleAlert,
  Users,
  Upload,
} from "lucide-react";

export const widgetState = {
  loading: "loading",
  empty: "empty",
  populated: "populated",
  error: "error",
};

export const dashboardSummary = {
  greeting: "Good morning, Avery",
  title: "Everything is protected.",
  subtitle: "Critical items are healthy.",
  score: 94,
  scoreLabel: "Health score",
};

export const stats = [
  {
    icon: Package,
    label: "Total Assets",
    value: "128",
    detail: "Active records",
    tone: "text-slate-700 bg-slate-100 border-slate-200",
  },
  {
    icon: ShieldCheck,
    label: "Coverage",
    value: "92%",
    detail: "Verified this month",
    tone: "text-slate-700 bg-slate-100 border-slate-200",
  },
  {
    icon: Clock3,
    label: "Renewals",
    value: "7",
    detail: "Due soon",
    tone: "text-slate-700 bg-slate-100 border-slate-200",
  },
  {
    icon: Activity,
    label: "Automation",
    value: "94",
    detail: "AI confidence",
    tone: "text-slate-700 bg-slate-100 border-slate-200",
  },
];

export const activityItems = [
  { icon: Upload, title: "Invoice attached", meta: "MacBook Pro", time: "12m" },
  { icon: ShieldCheck, title: "Policy verified", meta: "Home insurance", time: "2h" },
  { icon: FileCheck2, title: "Document matched", meta: "Warranty receipt", time: "Yesterday" },
  { icon: TriangleAlert, title: "Review pending", meta: "2 renewals", time: "Mon" },
];

export const renewalItems = [
  { id: "r1", title: "Home Insurance", date: "Aug 12", amount: "$1,420", status: "Review", tone: "text-amber-700 bg-amber-50 border-amber-100" },
  { id: "r2", title: "Tesla Warranty", date: "Aug 19", amount: "Expires", status: "Prepare", tone: "text-rose-700 bg-rose-50 border-rose-100" },
  { id: "r3", title: "iCloud Family", date: "Sep 03", amount: "$9.99", status: "Auto", tone: "text-emerald-700 bg-emerald-50 border-emerald-100" },
];

export const renewalTrend = [
  { month: "Aug", value: 68 },
  { month: "Sep", value: 42 },
  { month: "Oct", value: 76 },
  { month: "Nov", value: 54 },
  { month: "Dec", value: 88 },
  { month: "Jan", value: 63 },
];

export const categoryMix = [
  { id: "electronics", label: "Electronics", value: 38 },
  { id: "home", label: "Home", value: 27 },
  { id: "insurance", label: "Insurance", value: 19 },
  { id: "subscriptions", label: "Subscriptions", value: 16 },
];

export const expenseSeries = [
  { id: "warranty", label: "Warranty", amount: "$420", value: 34 },
  { id: "insurance", label: "Insurance", amount: "$1,420", value: 82 },
  { id: "subscriptions", label: "Subscriptions", amount: "$186", value: 22 },
  { id: "service", label: "Service", amount: "$640", value: 48 },
];

export const insights = [
  "Add serial numbers to 6 assets.",
  "Attach proof for 2 high-value items.",
  "Merge 1 duplicated subscription.",
];

export const quickActions = [
  { id: "add-asset", icon: Plus, label: "Add asset" },
  { id: "upload-document", icon: Upload, label: "Upload document" },
  { id: "create-reminder", icon: Bell, label: "Create reminder" },
  { id: "invite-family", icon: Users, label: "Invite family" },
];
