import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Menu, MoonStar, Plus, Search, Sparkles } from "lucide-react";
import Avatar from "../../ui/Avatar";
import { cn } from "../../../lib/cn";

const user = {
  name: "Rishi",
  fullName: "Rishi Sharma",
  email: "rishi@everkeep.app",
};

const unreadNotifications = 3;

const headerMotion = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

const getGreeting = (date) => {
  const hour = date.getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const formatCurrentDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

const IconButton = ({ children, className = "", label, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    aria-label={label}
    className={cn(
      "relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.06)] outline-none backdrop-blur-xl transition duration-200 hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-950/15 dark:border-white/10 dark:bg-white/8 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/12 dark:hover:text-white dark:focus-visible:ring-white/25",
      className
    )}
  >
    {children}
  </motion.button>
);

const GreetingBlock = ({ greeting, currentDate, currentIsoDate }) => (
  <div className="min-w-0">
    <div className="flex min-w-0 items-center gap-2">
      <p className="hidden text-sm font-semibold text-slate-500 dark:text-slate-400 sm:block">{greeting}</p>
      <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" aria-hidden="true" />
      <p className="truncate text-base font-semibold tracking-normal text-slate-950 dark:text-white sm:text-lg">
        Hello, {user.name} <span aria-hidden="true">&#128075;</span>
      </p>
    </div>
    <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
      <span className="truncate">Keep What Matters.</span>
      <span className="hidden h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-700 md:block" aria-hidden="true" />
      <time className="hidden truncate md:block" dateTime={currentIsoDate}>
        {currentDate}
      </time>
    </div>
  </div>
);

const GlobalSearch = () => (
  <form className="hidden min-w-0 max-w-xl flex-1 md:block" role="search" aria-label="Global search">
    <label htmlFor="global-search" className="sr-only">
      Search assets, warranties, documents
    </label>
    <div className="group flex h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-200 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[0_12px_32px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/8 dark:shadow-none dark:focus-within:bg-white/12">
      <Search
        size={18}
        strokeWidth={2}
        className="shrink-0 text-slate-400 transition group-focus-within:text-slate-700 dark:text-slate-500 dark:group-focus-within:text-white"
        aria-hidden="true"
      />
      <input
        id="global-search"
        type="search"
        placeholder="Search assets, warranties, documents..."
        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
        autoComplete="off"
      />
      <kbd className="hidden rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold leading-none text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/8 dark:text-slate-400 lg:inline-flex">
        Ctrl + K
      </kbd>
    </div>
  </form>
);

const NotificationButton = () => (
  <IconButton label={`${unreadNotifications} unread notifications`}>
    <span className="flex items-center justify-center gap-1" aria-hidden="true">
      <Bell size={19} strokeWidth={2} />
      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
    </span>
  </IconButton>
);

const AddAssetButton = () => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.98 }}
    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(16,185,129,0.24)] outline-none transition duration-200 hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:bg-emerald-400 dark:text-emerald-950 dark:shadow-[0_12px_32px_rgba(52,211,153,0.14)] dark:hover:bg-emerald-300 dark:focus-visible:ring-offset-slate-950 sm:px-4"
    aria-label="Add a new asset"
  >
    <Plus size={18} strokeWidth={2.3} aria-hidden="true" />
    <span className="hidden sm:inline">Add Asset</span>
  </motion.button>
);

const UserProfileButton = () => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    className="hidden h-12 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 py-1.5 pl-1.5 pr-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] outline-none backdrop-blur-xl transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-950/15 dark:border-white/10 dark:bg-white/8 dark:shadow-none dark:hover:bg-white/12 dark:focus-visible:ring-white/25 xl:flex"
    aria-label="Open user profile menu"
  >
    <Avatar name={user.fullName} size="md" />
    <span className="min-w-0">
      <span className="block max-w-28 truncate text-sm font-semibold text-slate-950 dark:text-white">{user.fullName}</span>
      <span className="block max-w-28 truncate text-xs font-medium text-slate-500 dark:text-slate-400">{user.email}</span>
    </span>
    <ChevronDown size={16} className="shrink-0 text-slate-400" strokeWidth={2.2} aria-hidden="true" />
  </motion.button>
);

const DashboardHeader = ({ onMenu }) => {
  const today = useMemo(() => new Date(), []);
  const greeting = useMemo(() => getGreeting(today), [today]);
  const currentDate = useMemo(() => formatCurrentDate(today), [today]);
  const currentIsoDate = useMemo(() => today.toISOString(), [today]);

  return (
    <motion.header
      {...headerMotion}
      className="sticky top-0 z-30 w-full min-w-0 border-b border-slate-200/70 bg-slate-100/85 px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-4 rounded-3xl border border-white/70 bg-white/70 px-4 py-2 shadow-[0_16px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/6 dark:shadow-none sm:px-6">
        {/* Left: navigation trigger and greeting */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <IconButton label="Open navigation" onClick={onMenu} className="lg:hidden">
            <Menu size={20} strokeWidth={2.2} aria-hidden="true" />
          </IconButton>
          <GreetingBlock greeting={greeting} currentDate={currentDate} currentIsoDate={currentIsoDate} />
        </div>

        {/* Center: global search */}
        <GlobalSearch />

        {/* Right: actions and profile */}
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Open search" className="md:hidden">
            <Search size={19} strokeWidth={2.1} aria-hidden="true" />
          </IconButton>
          <NotificationButton />
          <IconButton label="Toggle theme">
            <MoonStar size={19} strokeWidth={2} aria-hidden="true" />
          </IconButton>
          <AddAssetButton />
          <UserProfileButton />
          <IconButton label="Open user profile menu" className="xl:hidden">
            <Avatar name={user.fullName} size="sm" />
          </IconButton>
        </div>

        <Sparkles className="hidden text-emerald-400/80 2xl:block" size={18} strokeWidth={2.1} aria-hidden="true" />
      </div>
    </motion.header>
  );
};

export default memo(DashboardHeader);
