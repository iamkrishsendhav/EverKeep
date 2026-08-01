import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.png";
import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  ChevronRight,
  Database,
  FileText,
  Gauge,
  Gem,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import Avatar from "../../ui/Avatar";
import { cn } from "../../../lib/cn";

const user = {
  name: "Avery Kim",
  email: "avery@everkeep.app",
  plan: "Premium",
};

const storage = {
  used: 76.8,
  total: 100,
  unit: "GB",
};

const navigationSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Assets", href: "/assets", icon: Package },
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Warranty", href: "/warranty", icon: ShieldCheck },
      { label: "Calendar", href: "/calendar", icon: CalendarDays },
      { label: "Family", href: "/family", icon: Users },
    ],
  },
  {
    title: "SMART",
    items: [
      { label: "AI Assistant", href: "/ai", icon: Bot, badge: "Live" },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    title: "ACCOUNT",
    items: [{ label: "Settings", href: "/settings", icon: Settings }],
  },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut", staggerChildren: 0.035 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

const storagePercentage = Math.min(Math.round((storage.used / storage.total) * 100), 100);
const remainingStorage = Math.max(storage.total - storage.used, 0).toFixed(1);

const LogoMark = () => (
  <div className="flex h-18 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
    <img
      src={logo}
      alt="EverKeep Logo"
      className="h-full w-full object-contain"
      draggable={false}
    />
  </div>
);

const BrandHeader = () => (
  <NavLink
    to="/dashboard"
    className="group flex items-center gap-4 rounded-2xl px-2 py-2"
  >
    <LogoMark />

    <div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        EverKeep
      </h1>

      <p className="text-sm text-slate-500">
        Keep What Matters.
      </p>
    </div>
  </NavLink>
);

const SectionLabel = ({ children }) => (
  <h2 className="px-3 text-xs font-semibold uppercase tracking-normal text-slate-400 dark:text-slate-500">
    {children}
  </h2>
);

const NavItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <motion.li variants={itemVariants}>
      <NavLink
        to={item.href}
        end={item.href === "/dashboard"}
        className={({ isActive }) =>
          cn(
            "group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium outline-none transition duration-200",
            "focus-visible:ring-2 focus-visible:ring-slate-950/15 dark:focus-visible:ring-white/25",
            isActive
              ? "bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] dark:bg-white dark:text-slate-950 dark:shadow-[0_14px_34px_rgba(255,255,255,0.08)]"
              : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white"
          )
        }
        aria-label={`Open ${item.label}`}
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                "h-6 w-1 shrink-0 rounded-full bg-emerald-400 transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-0"
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-xl transition duration-200",
                isActive
                  ? "bg-white/12 text-white dark:bg-slate-950/8 dark:text-slate-950"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-950 group-hover:text-white dark:bg-white/8 dark:text-slate-400 dark:group-hover:bg-white dark:group-hover:text-slate-950"
              )}
            >
              <Icon size={17} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-normal",
                  isActive
                    ? "bg-white/14 text-white dark:bg-slate-950/8 dark:text-slate-700"
                    : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20"
                )}
              >
                {item.badge}
              </span>
            ) : null}
            <ChevronRight
              size={15}
              className={cn(
                "shrink-0 transition duration-200",
                isActive ? "opacity-80" : "opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-60"
              )}
              aria-hidden="true"
            />
          </>
        )}
      </NavLink>
    </motion.li>
  );
};

const NavigationSection = ({ section }) => (
  <section className="space-y-2" aria-labelledby={`sidebar-section-${section.title.toLowerCase()}`}>
    <SectionLabel>
      <span id={`sidebar-section-${section.title.toLowerCase()}`}>{section.title}</span>
    </SectionLabel>
    <ul className="space-y-1">
      {section.items.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}
    </ul>
  </section>
);

const StorageUsageCard = () => (
  <motion.section
    variants={itemVariants}
    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6 dark:shadow-none"
    aria-labelledby="storage-usage-title"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <Database size={17} strokeWidth={2.1} aria-hidden="true" />
        </span>
        <div>
          <h2 id="storage-usage-title" className="text-sm font-semibold text-slate-950 dark:text-white">
            Storage
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{storagePercentage}% used</p>
        </div>
      </div>
      <Gauge size={18} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
    </div>

    <div
      className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
      role="progressbar"
      aria-label="Storage usage"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={storagePercentage}
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-slate-950 via-slate-700 to-emerald-500 dark:from-white dark:via-slate-300 dark:to-emerald-300"
        initial={{ width: 0 }}
        animate={{ width: `${storagePercentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>

    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
      <div>
        <p className="font-semibold text-slate-950 dark:text-white">
          {storage.used}
          {storage.unit}
        </p>
        <p className="font-medium text-slate-500 dark:text-slate-400">Used space</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-slate-950 dark:text-white">
          {remainingStorage}
          {storage.unit}
        </p>
        <p className="font-medium text-slate-500 dark:text-slate-400">Remaining</p>
      </div>
    </div>
  </motion.section>
);

const UserProfileCard = () => (
  <motion.section
    variants={itemVariants}
    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6 dark:shadow-none"
    aria-label="Current user"
  >
    <div className="flex items-center gap-3">
      <Avatar name={user.name} size="lg" className="shadow-[0_10px_24px_rgba(15,23,42,0.16)]" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{user.name}</p>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold uppercase tracking-normal text-amber-700 ring-1 ring-amber-100 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
            <Gem size={10} strokeWidth={2.4} aria-hidden="true" />
            {user.plan}
          </span>
        </div>
        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>
    </div>
  </motion.section>
);

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("everkeep:auth");
    sessionStorage.removeItem("everkeep:auth");
    navigate("/login", { replace: true });
  };

  return (
    <motion.button
      variants={itemVariants}
      type="button"
      onClick={handleLogout}
      className="group flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-slate-500 outline-none transition duration-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500/20 dark:text-slate-400 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
      aria-label="Log out of EverKeep"
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-500 transition duration-200 group-hover:bg-rose-100 group-hover:text-rose-700 dark:bg-white/8 dark:text-slate-400 dark:group-hover:bg-rose-400/15 dark:group-hover:text-rose-300">
        <LogOut size={17} strokeWidth={2} aria-hidden="true" />
      </span>
      <span>Log out</span>
    </motion.button>
  );
};

const SidebarContent = () => (
  <motion.div
    variants={sidebarVariants}
    initial="hidden"
    animate="visible"
    className="flex min-h-0 flex-1 flex-col"
  >
    <BrandHeader />

    <nav className="mt-8 min-h-0 flex-1 space-y-6 overflow-hidden pr-1" aria-label="Primary navigation">
      {navigationSections.map((section) => (
        <NavigationSection key={section.title} section={section} />
      ))}
    </nav>

    <div className="mt-6 space-y-4 border-t border-slate-200/80 pt-4 dark:border-white/10">
      <StorageUsageCard />
      <UserProfileCard />
      <LogoutButton />
    </div>
  </motion.div>
);

const Sidebar = () => (
  <aside
    className="flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-slate-50/95 px-4 py-6 text-base text-slate-950 shadow-[8px_0_32px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 dark:text-white"
    aria-label="EverKeep sidebar"
  >
    <SidebarContent />
  </aside>
);

export { SidebarContent };
export default Sidebar;
