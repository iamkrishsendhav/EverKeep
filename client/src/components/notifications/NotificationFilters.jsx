
import { Search, X } from "lucide-react";

import { NOTIFICATION_FILTERS } from "./notificationConfig.js";

export default function NotificationFilters({
    notifications = [],
    counts = {},
    filter = "all",
    onFilterChange,
    search = "",
    onSearchChange,
    onClearFilters,
    disabled = false,
}) {
    const getFilterCount = (filterValue) => {
        if (filterValue === "all") {
            return counts.total ?? notifications.length;
        }

        if (filterValue === "unread") {
            return counts.unread ?? notifications.filter(
                (item) => !item.readAt
            ).length;
        }

        return counts.categories?.[filterValue] ?? notifications.filter(
            (item) => item.category === filterValue
        ).length;
    };

    const handleClear = () => {
        onSearchChange?.("");
        onClearFilters?.();
    };

    return (
        <section className="border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Activity inbox
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Search and manage your notification feed.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-0 sm:min-w-64">
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                onSearchChange?.(event.target.value)
                            }
                            disabled={disabled}
                            placeholder="Search notifications..."
                            aria-label="Search notifications"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => onSearchChange?.("")}
                                disabled={disabled}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 disabled:opacity-50 dark:hover:text-white"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {(search || filter !== "all") && (
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={disabled}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <X size={15} />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <div
                className="mt-4 flex gap-2 overflow-x-auto pb-1"
                role="group"
                aria-label="Filter notifications by category"
            >
                {NOTIFICATION_FILTERS.map((item) => {
                    const active = filter === item.value;
                    const count = getFilterCount(item.value);

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => onFilterChange?.(item.value)}
                            disabled={disabled}
                            aria-pressed={active}
                            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                                active
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                        >
                            {item.label}

                            <span
                                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                                    active
                                        ? "bg-white/20 text-white"
                                        : "bg-white/80 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                                }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
