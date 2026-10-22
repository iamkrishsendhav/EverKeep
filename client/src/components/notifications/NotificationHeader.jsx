
import {
    BellRing,
    CheckCheck,
    RefreshCw,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function NotificationHeader({
    unreadCount = 0,
    loading = false,
    actionLoading = false,
    onRefresh,
    onMarkAllRead,
}) {
    const reduceMotion = useReducedMotion();

    const busy = loading || actionLoading;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 dark:border-indigo-950 dark:from-indigo-950/50 dark:via-slate-900 dark:to-violet-950/30 sm:p-7">
            <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />

            <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">
                        Workspace
                    </p>

                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: reduceMotion ? 0 : 0.2,
                            }}
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                        >
                            <BellRing size={23} aria-hidden="true" />
                        </motion.div>

                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                Notifications
                            </h1>

                            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                Stay on top of important updates and reminders.
                            </p>

                            <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                {unreadCount} unread notification
                                {unreadCount === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={busy || !onRefresh}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                            aria-hidden="true"
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={onMarkAllRead}
                        disabled={
                            unreadCount === 0 ||
                            busy ||
                            !onMarkAllRead
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800"
                    >
                        <CheckCheck size={16} aria-hidden="true" />
                        Mark all read
                    </button>
                </div>
            </div>
        </section>
    );
}
