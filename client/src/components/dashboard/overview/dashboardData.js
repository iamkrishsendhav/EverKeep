import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  Clock3,
  CreditCard,
  FileText,
  Home,
  Package,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Wrench,
} from "lucide-react";

export const navItems = [
  { icon: Home, label: "Overview", active: true },
  { icon: Package, label: "Assets" },
  { icon: FileText, label: "Documents" },
  { icon: CalendarDays, label: "Renewals" },
  { icon: ShieldCheck, label: "Insurance" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: BarChart3, label: "Reports" },
  { icon: Users, label: "Family" },
];

export const stats = [
  {
    icon: Package,
    label: "Total Assets",
    value: "128",
    detail: "$84.6k tracked value",
    tone: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    icon: ShieldCheck,
    label: "Protected Assets",
    value: "92%",
    detail: "18 records verified this month",
    tone: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: Clock3,
    label: "Upcoming Renewals",
    value: "7",
    detail: "3 need attention this week",
    tone: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    icon: Activity,
    label: "AI Health Score",
    value: "94",
    detail: "Excellent household coverage",
    tone: "text-violet-600 bg-violet-50 border-violet-100",
  },
];

export const activityItems = [
  { icon: Upload, title: "Invoice added", meta: "MacBook Pro receipt attached", time: "12 min ago" },
  { icon: ShieldCheck, title: "Policy verified", meta: "Home insurance matched to 14 assets", time: "2h ago" },
  { icon: Wrench, title: "Service logged", meta: "HVAC annual maintenance completed", time: "Yesterday" },
  { icon: CreditCard, title: "Subscription reviewed", meta: "Adobe plan marked as shared", time: "Mon" },
];

export const renewalItems = [
  { title: "Home Insurance", date: "Aug 12", amount: "$1,420", status: "Review", tone: "text-amber-700 bg-amber-50 border-amber-100" },
  { title: "Tesla Warranty", date: "Aug 19", amount: "Expires", status: "Prepare", tone: "text-rose-700 bg-rose-50 border-rose-100" },
  { title: "iCloud Family", date: "Sep 03", amount: "$9.99", status: "Auto", tone: "text-emerald-700 bg-emerald-50 border-emerald-100" },
];

export const calendarDays = [
  { day: "M", date: "29", active: false, marked: false },
  { day: "T", date: "30", active: true, marked: true },
  { day: "W", date: "31", active: false, marked: false },
  { day: "T", date: "01", active: false, marked: true },
  { day: "F", date: "02", active: false, marked: false },
  { day: "S", date: "03", active: false, marked: false },
  { day: "S", date: "04", active: false, marked: true },
];

export const insights = [
  "Add serial numbers to 6 electronics for stronger warranty recovery.",
  "Home insurance coverage is missing proof for two high-value items.",
  "One subscription appears duplicated across family members.",
];

export const documentItems = [
  { title: "Home Insurance Policy", meta: "PDF synced from email", status: "Verified" },
  { title: "MacBook Pro Invoice", meta: "Attached to asset record", status: "Complete" },
  { title: "HVAC Service Receipt", meta: "Needs category review", status: "Review" },
];

export const quickActions = [
  { icon: Plus, label: "Add asset" },
  { icon: Upload, label: "Upload document" },
  { icon: Bell, label: "Create reminder" },
  { icon: Users, label: "Invite family" },
];
