// import { memo, useMemo } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, ChevronDown, LogOut, Menu, Plus, Search, Settings as SettingsIcon, Sun, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../ui/Avatar";
import { cn } from "../../../lib/cn";
import AssetModal from "../../asset/AssetModal";
import AssetForm from "../../asset/AssetForm";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import { searchRecords } from "../../../services/search.service";

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

const IconButton = ({ children, className = "", label, onClick, ...buttonProps }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    aria-label={label}
    {...buttonProps}
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

const GlobalSearch = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ assets: [], documents: [] });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [...results.assets, ...results.documents];

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) {
      setResults({ assets: [], documents: [] });
      setError("");
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setResults({ assets: [], documents: [] });
    setActiveIndex(0);
    setError("");
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchRecords(normalized, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setResults({ assets: data?.assets || [], documents: data?.documents || [] });
          setActiveIndex(0);
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause.response?.data?.message || "Search could not be completed.");
          setResults({ assets: [], documents: [] });
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const selectResult = (item) => {
    setOpen(false);
    inputRef.current?.blur();
    navigate(item.type === "asset" ? "/dashboard/assets" : "/dashboard/documents");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!items.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectResult(items[activeIndex]);
    }
  };

  return (
    <form className="relative min-w-0 w-full flex-1" role="search" aria-label="Global search" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="global-search" className="sr-only">Search assets and documents</label>
      <div className="group flex h-11 items-center gap-3 rounded-xl border border-slate-200/85 bg-white/85 px-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-200 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-[0_8px_22px_rgba(15,23,42,0.1)]">
        <Search size={18} strokeWidth={2} className="shrink-0 text-slate-400 transition group-focus-within:text-slate-700" aria-hidden="true" />
        <input ref={inputRef} id="global-search" type="search" role="combobox" aria-expanded={open} aria-controls="global-search-results" aria-autocomplete="list" aria-activedescendant={open && items[activeIndex] ? `global-search-${items[activeIndex].type}-${items[activeIndex].id}` : undefined} value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={handleKeyDown} placeholder="Search assets, documents..." className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400" autoComplete="off" />
        <kbd className="hidden shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold leading-none text-slate-500 shadow-sm sm:inline-flex">Ctrl K</kbd>
      </div>
      {open && query.trim() && <div id="global-search-results" role="listbox" aria-label="Search results" className="absolute left-0 right-0 top-14 z-50 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
        {loading && <p role="status" className="px-3 py-4 text-sm text-slate-500">Searching your records…</p>}
        {!loading && error && <p role="alert" className="px-3 py-4 text-sm text-rose-700">{error}</p>}
        {!loading && !error && items.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">No matching assets or documents.</p>}
        {!loading && !error && items.map((item, index) => <button key={`${item.type}-${item.id}`} id={`global-search-${item.type}-${item.id}`} type="button" role="option" aria-selected={activeIndex === index} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => selectResult(item)} className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${activeIndex === index ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
          <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-500"><Search size={14} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{item.name}</span><span className="block truncate text-xs text-slate-500">{item.type === "asset" ? "Asset" : "Document"}{item.detail ? ` · ${item.detail}` : ""}</span></span>
        </button>)}
      </div>}
    </form>
  );
};

const NotificationButton = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const recent = notifications.slice(0, 5);

  return (
    <div className="relative">
      <IconButton label={`${unreadCount} unread notifications`} onClick={() => {
        const next = !open;
        setOpen(next);
        if (next && notifications.length === 0) fetchNotifications({ page: 1, limit: 5 }).catch(() => {});
      }} aria-expanded={open} aria-haspopup="dialog">
        <Bell size={18} strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1 text-center text-[10px] font-bold leading-5 text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </IconButton>
      {open && <div role="dialog" aria-label="Recent notifications" className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div><p className="text-sm font-bold text-slate-900">Notifications</p><p className="text-xs text-slate-500">{unreadCount} unread</p></div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => markAllAsRead().catch(() => {})} disabled={!unreadCount} aria-label="Mark all notifications as read" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"><Check size={16}/></button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close notifications" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={16}/></button>
          </div>
        </div>
        {loading && recent.length === 0 ? <p role="status" className="p-5 text-sm text-slate-500">Loading notifications…</p> : error && recent.length === 0 ? <div className="p-4 text-sm text-rose-700"><p>{error}</p><button type="button" className="mt-2 font-semibold underline" onClick={() => fetchNotifications({ page: 1, limit: 5 }).catch(() => {})}>Retry</button></div> : recent.length === 0 ? <p className="p-5 text-sm text-slate-500">You’re all caught up.</p> : <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">{recent.map((item) => {
          const destination = typeof item.actionUrl === "string" && item.actionUrl.startsWith("/") && !item.actionUrl.startsWith("//") && !item.actionUrl.includes("\\") ? item.actionUrl : "/dashboard/notifications";
          return <li key={item._id} className={`flex gap-2 px-4 py-3 ${item.readAt ? "" : "bg-indigo-50/60"}`}>
          <Link to={destination} onClick={() => { if (!item.readAt) markAsRead(item._id).catch(() => {}); setOpen(false); }} className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{item.message}</p><time className="mt-1 block text-[11px] text-slate-400" dateTime={item.createdAt}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</time></Link>
          <button type="button" onClick={() => dismissNotification(item._id).catch(() => {})} aria-label={`Dismiss ${item.title}`} className="self-start rounded p-1 text-slate-400 hover:bg-white hover:text-rose-600"><X size={14}/></button>
        </li>})}</ul>}
        <Link to="/dashboard/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-indigo-700 hover:bg-slate-50">View all notifications</Link>
      </div>}
    </div>
  );
};

const AddAssetButton = ({ onClick }) => (
  <motion.button type="button" whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] outline-none transition duration-200 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950/25 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 sm:px-4" aria-label="Create a new asset" onClick={onClick}>
    <Plus size={17} strokeWidth={2.3} aria-hidden="true" />
    <span className="hidden sm:inline">New Asset</span>
  </motion.button>
);

const UserProfileButton = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = getUserDisplay(authUser);

  return (
  <div className="relative">
    <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setOpen((value) => !value)} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/85 px-1.5 pr-2 shadow-[0_2px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-xl transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-950/15 lg:pr-3" aria-label="Open user profile menu" aria-expanded={open} aria-haspopup="menu">
      <Avatar name={user.fullName} size="sm" />
      <span className="hidden max-w-24 truncate text-sm font-semibold text-slate-900 xl:inline">{user.firstName}</span>
      <ChevronDown size={15} className="hidden shrink-0 text-slate-400 xl:block" strokeWidth={2.2} aria-hidden="true" />
      <span className="sr-only">{user.email}</span>
    </motion.button>
    {open && <div role="menu" aria-label="Profile menu" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
      <div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-semibold text-slate-900">{user.fullName}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
      <Link role="menuitem" to="/dashboard/settings" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"><SettingsIcon size={16} aria-hidden="true" />Account settings</Link>
      <button type="button" role="menuitem" onClick={() => { setOpen(false); logout(); navigate("/login", { replace: true }); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50 focus:bg-rose-50 focus:outline-none"><LogOut size={16} aria-hidden="true" />Sign out</button>
    </div>}
  </div>
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
