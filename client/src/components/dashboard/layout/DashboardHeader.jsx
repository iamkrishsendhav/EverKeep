// import { memo, useMemo } from "react";
import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Menu, Plus, Search, Sun } from "lucide-react";
import Avatar from "../../ui/Avatar";
import { cn } from "../../../lib/cn";
import AssetModal from "../../asset/AssetModal";
import AssetForm from "../../asset/AssetForm";
import { useAuth } from "../../../context/AuthContext";

const unreadNotifications = 3;

const headerMotion = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

const formatHeaderDate = (date) => {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date);

  return `${weekday} • ${day} ${month} ${year}`;
};

const IconButton = ({ children, className = "", label, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    aria-label={label}
    className={cn(
      "relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200/80 bg-white/85 text-slate-600 shadow-[0_2px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-xl transition duration-200 hover:border-slate-300 hover:bg-white hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-950/15",
      className
    )}
  >
    {children}
  </motion.button>
);

const getUserDisplay = (user) => {
  const fullName = user?.name?.trim() || "EverKeep User";
  const firstName = fullName.split(/\s+/)[0] || "there";
  const email = user?.email?.trim() || "No email available";

  return {
    firstName,
    fullName,
    email,
  };
};

const GreetingBlock = () => {
  const { user: authUser } = useAuth();
  const user = getUserDisplay(authUser);

  return (
  <div className="min-w-0">
    <p className="truncate text-[15px] font-semibold tracking-tight text-slate-950 sm:text-base">
      Welcome back, {user.firstName} <span aria-hidden="true">👋</span>
    </p>
  </div>
  );
};

const GlobalSearch = () => (
  <form className="min-w-0 w-full flex-1" role="search" aria-label="Global search">
    <label htmlFor="global-search" className="sr-only">Search assets and documents</label>
    <div className="group flex h-11 items-center gap-3 rounded-xl border border-slate-200/85 bg-white/85 px-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-200 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[0_8px_22px_rgba(15,23,42,0.1)]">
      <Search size={18} strokeWidth={2} className="shrink-0 text-slate-400 transition group-focus-within:text-slate-700" aria-hidden="true" />
      <input id="global-search" type="search" placeholder="Search assets, documents..." className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400" autoComplete="off" />
      <kbd className="hidden shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold leading-none text-slate-500 shadow-sm sm:inline-flex">Ctrl K</kbd>
    </div>
  </form>
);

const NotificationButton = () => (
  <IconButton label={`${unreadNotifications} unread notifications`}>
    <span className="flex items-center justify-center gap-1" aria-hidden="true">
      <Bell size={18} strokeWidth={2} />
      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
    </span>
  </IconButton>
);

const AddAssetButton = ({ onClick }) => (
  <motion.button type="button" whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] outline-none transition duration-200 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950/25 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 sm:px-4" aria-label="Create a new asset" onClick={onClick}>
    <Plus size={17} strokeWidth={2.3} aria-hidden="true" />
    <span className="hidden sm:inline">New Asset</span>
  </motion.button>
);

const UserProfileButton = () => {
  const { user: authUser } = useAuth();
  const user = getUserDisplay(authUser);

  return (
  <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/85 px-1.5 pr-2 shadow-[0_2px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-xl transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-950/15 lg:pr-3" aria-label="Open user profile menu">
    <Avatar name={user.fullName} size="sm" />
    <span className="hidden max-w-24 truncate text-sm font-semibold text-slate-900 xl:inline">{user.firstName}</span>
    <ChevronDown size={15} className="hidden shrink-0 text-slate-400 xl:block" strokeWidth={2.2} aria-hidden="true" />
    <span className="sr-only">{user.email}</span>
  </motion.button>
  );
};

const DashboardHeader = ({ onMenu }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const currentDate = useMemo(() => formatHeaderDate(today), [today]);
  const currentIsoDate = useMemo(() => today.toISOString(), [today]);

  return (
    <>
      <motion.header {...headerMotion} className="sticky top-0 z-30 w-full shrink-0 bg-slate-100/80 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px] rounded-xl border border-slate-200/80 bg-white/72 px-3 py-3 shadow-[0_10px_26px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:px-4 lg:px-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
              <IconButton label="Open navigation" onClick={onMenu} className="lg:hidden">
                <Menu size={18} strokeWidth={2.2} aria-hidden="true" />
              </IconButton>
              <GreetingBlock />
            </div>

            <div className="min-w-0 lg:px-2">
              <GlobalSearch />
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <NotificationButton />
              <IconButton label="Switch theme">
                <Sun size={18} strokeWidth={2} aria-hidden="true" />
              </IconButton>
              {/* <AddAssetButton />
             */}
              <AddAssetButton
                onClick={() => setIsModalOpen(true)}
              />
              <UserProfileButton />
            </div>
          </div>

          <time className="mt-2 block text-xs font-medium text-slate-500 sm:text-sm" dateTime={currentIsoDate}>
            {currentDate}
          </time>
        </div>
      </motion.header>
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Add New Asset
          </h2>

          <AssetForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              window.dispatchEvent(
                new Event("everkeep:assets:changed")
              );
            }}
          />
        </div>
      </AssetModal>
    </>
  );
};

export default memo(DashboardHeader);
