
import {
    Bell,
    BellRing,
    CheckCheck,
    ShieldAlert,
} from "lucide-react";

import { motion, useReducedMotion } from "framer-motion";

const STAT_CONFIG = [
    {
        key: "total",
        label: "Total notifications",
        detail: "Your notification inbox",
        icon: Bell,
        tone: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    {
        key: "unread",
        label: "Unread",
        detail: "Need your attention",
        icon: BellRing,
        tone: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },
    {
        key: "important",
        label: "Important",
        detail: "High-priority updates",
        icon: ShieldAlert,
        tone: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    },
    {
        key: "read",
        label: "Read",
        detail: "Already reviewed",
        icon: CheckCheck,
        tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
];

function StatCard({ stat, value, index, reduceMotion }) {
    const Icon = stat.icon;

    return (
        <motion.article
            initial={
                reduceMotion
                    ? false
                    : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: reduceMotion ? 0 : 0.22,
                delay: reduceMotion ? 0 : index * 0.05,
            }}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}
            >
                <Icon size={20} aria-hidden="true" />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                </p>

                <p
                    className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
                    aria-label={`${stat.label}: ${value}`}
                >
                    {value}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {stat.detail}
                </p>
            </div>
        </motion.article>
    );
}

export default function NotificationStats({
    total = 0,
    unread = 0,
    important = 0,
    read = 0,
}) {
    const reduceMotion = useReducedMotion();

    const values = {
        total,
        unread,
        important,
        read,
    };

    return (
        <section
            aria-label="Notification statistics"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
            {STAT_CONFIG.map((stat, index) => (
                <StatCard
                    key={stat.key}
                    stat={stat}
                    value={values[stat.key]}
                    index={index}
                    reduceMotion={reduceMotion}
                />
            ))}
        </section>
    );
}
