import { motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  Car,
  CreditCard,
  FileText,
  Home,
  Laptop,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Home, label: "Assets" },
  { icon: FileText, label: "Documents" },
  { icon: CalendarClock, label: "Renewals" },
  { icon: Sparkles, label: "AI Insights" },
  { icon: Users, label: "Family" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { icon: Home, label: "Assets", value: "47", note: "+3 this month", color: "blue" },
  { icon: FileText, label: "Documents", value: "186", note: "99% indexed", color: "violet" },
  { icon: Bell, label: "Renewals", value: "03", note: "Next 30 days", color: "orange" },
  { icon: ShieldCheck, label: "Health Score", value: "94%", note: "Excellent", color: "emerald" },
];

const renewals = [
  { icon: FileText, name: "Passport renewal", date: "May 12, 2027", tag: "In 15 days" },
  { icon: Laptop, name: "MacBook Pro warranty", date: "June 02, 2027", tag: "In 36 days" },
  { icon: Car, name: "Vehicle insurance", date: "June 18, 2027", tag: "In 52 days" },
];

const activities = [
  { icon: CreditCard, title: "Netflix subscription renewed", time: "18 minutes ago", tone: "blue" },
  { icon: FileText, title: "Bike insurance document uploaded", time: "Yesterday", tone: "emerald" },
  { icon: Wrench, title: "AC service reminder scheduled", time: "2 days ago", tone: "orange" },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const DashboardPreview = () => {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto w-full max-w-[760px]"
    >
      <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-tr from-blue-600/14 via-violet-500/12 to-cyan-300/16 blur-3xl sm:-inset-8" />
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-[156px_minmax(0,1fr)]">
          <aside className="hidden border-r border-slate-200/80 bg-slate-50/70 p-5 md:block">
            <div className="mb-7 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck size={17} />
              </div>
              <span className="text-sm font-black text-slate-950">EverKeep</span>
            </div>

            <div className="space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-xs font-bold ${
                      item.active ? "bg-blue-50 text-blue-600" : "text-slate-500"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-slate-950">Go Premium</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Unlock unlimited storage and advanced AI.
              </p>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400">Personal command center</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Good evening, Rishi
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-400 shadow-sm sm:flex">
                  <Search size={15} />
                  Search anything...
                </div>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <Bell size={16} className="text-slate-600" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-blue-600 text-xs font-black text-white">
                  RK
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
                  >
                    <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-2xl ${colorClasses[item.color]}`}>
                      <Icon size={18} />
                    </div>
                    <p className="truncate text-xs font-semibold text-slate-500">{item.label}</p>
                    <div className="mt-1 text-3xl font-black tracking-tight text-slate-950">{item.value}</div>
                    <p className="truncate text-xs font-medium text-slate-400">{item.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
              <Panel title="Upcoming Renewals" action="View all">
                <div className="space-y-3">
                  {renewals.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Icon size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-black text-slate-900">{item.name}</p>
                          <p className="mt-1 text-[11px] font-medium text-slate-400">{item.date}</p>
                        </div>
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black text-orange-600">
                          {item.tag}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Recent Activity" action="View all">
                <div className="space-y-3">
                  {activities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-white p-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${colorClasses[item.tone]}`}>
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black text-slate-900">{item.title}</p>
                          <p className="mt-1 text-[11px] font-medium text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>

            <div className="mt-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">AI health score</p>
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    Your document coverage improved after adding two invoices.
                  </p>
                </div>
                <div className="text-4xl font-black tracking-tight text-slate-950">94%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Panel = ({ title, action, children }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
    <div className="mb-4 flex items-center justify-between">
      <h4 className="text-sm font-black text-slate-950">{title}</h4>
      <button className="text-xs font-black text-blue-600">{action}</button>
    </div>
    {children}
  </div>
);

export default DashboardPreview;
