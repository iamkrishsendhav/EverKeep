import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.png";
import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  ChevronRight,
  FileText,
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

const navigationSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Assets", href: "/dashboard/assets", icon: Package },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
      { label: "Warranty", href: "/dashboard/warranty", icon: ShieldCheck },
      { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { label: "Family", href: "/dashboard/family", icon: Users },
    ],
  },
  {
    title: "SMART",
    items: [
      { label: "AI Assistant", href: "/dashboard/ai", icon: Bot, badge: "Live" },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    title: "ACCOUNT",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.24, ease: "easeOut", staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const LogoMark = () => (
  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm">
    <img src={logo} alt="EverKeep Logo" className="h-full w-full object-contain" draggable={false} />
  </div>
);

const BrandHeader = () => (
  <NavLink to="/dashboard" className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/70">
    <LogoMark />
    <div className="min-w-0">
      <h1 className="text-[15px] font-semibold tracking-tight text-slate-950">EverKeep</h1>
      <p className="truncate text-xs text-slate-500">Keep What Matters.</p>
    </div>
  </NavLink>
);

const SectionLabel = ({ children }) => (
  <h2 className="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{children}</h2>
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
            "group relative flex min-h-10 items-center gap-2.5 rounded-xl px-2.5 text-[15px] font-medium outline-none transition duration-200",
            "focus-visible:ring-2 focus-visible:ring-slate-950/15",
            isActive
              ? "bg-slate-950/8 text-slate-950 ring-1 ring-slate-950/10 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
              : "text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
          )
        }
        aria-label={`Open ${item.label}`}
      >
        {({ isActive }) => (
          <>
            <span className={cn("h-5 w-1 shrink-0 rounded-full bg-emerald-400 transition-opacity duration-200", isActive ? "opacity-100" : "opacity-0")} aria-hidden="true" />
            <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition duration-200", isActive ? "border-slate-900/10 bg-white text-slate-900" : "border-transparent bg-slate-100 text-slate-500 group-hover:bg-slate-950 group-hover:text-white") }>
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-normal", isActive ? "bg-slate-900/5 text-slate-700 ring-1 ring-slate-900/8" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100")}>{item.badge}</span>
            ) : null}
            <ChevronRight size={15} className={cn("shrink-0 transition duration-200", isActive ? "opacity-40" : "opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-60")} aria-hidden="true" />
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

const UserProfileCard = () => (
  <motion.section variants={itemVariants} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)]" aria-label="Current user">
    <div className="flex items-center gap-3">
      <Avatar name={user.name} size="lg" className="shadow-[0_8px_20px_rgba(15,23,42,0.12)]" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
            <Gem size={10} strokeWidth={2.4} aria-hidden="true" />
            {user.plan}
          </span>
        </div>
        <p className="truncate text-xs font-medium text-slate-500">{user.email}</p>
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
      className="group flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-[15px] font-semibold text-slate-500 outline-none transition duration-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500/20"
      aria-label="Log out of EverKeep"
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-500 transition duration-200 group-hover:bg-rose-100 group-hover:text-rose-700">
        <LogOut size={16} strokeWidth={2} aria-hidden="true" />
      </span>
      <span>Log out</span>
    </motion.button>
  );
};

const SidebarContent = () => (
  <motion.div variants={sidebarVariants} initial="hidden" animate="visible" className="flex min-h-0 flex-1 flex-col">
    <BrandHeader />

    <nav className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1" aria-label="Primary navigation">
      <div className="space-y-4">
        {navigationSections.map((section) => (
          <NavigationSection key={section.title} section={section} />
        ))}
      </div>
    </nav>

    <div className="mt-4 space-y-3 border-t border-slate-200/80 pt-3">
      <UserProfileCard />
      <LogoutButton />
    </div>
  </motion.div>
);

const Sidebar = () => (
  <aside className="flex h-screen w-[272px] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-slate-50/90 px-3 py-4 text-[15px] text-slate-950 shadow-[8px_0_32px_rgba(15,23,42,0.04)] backdrop-blur-xl" aria-label="EverKeep sidebar">
    <SidebarContent />
  </aside>
);

export { SidebarContent };
export default Sidebar;
