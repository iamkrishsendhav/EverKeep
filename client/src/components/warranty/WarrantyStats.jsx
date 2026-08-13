import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    ShieldCheck,
} from "lucide-react";

import {
    getWarrantyStatus,
} from "./warrantyHelpers";


// ============================================================
// STAT CONFIG
// ============================================================

const STAT_CONFIG = {
    total: {
        label: "Total warranties",
        icon: ShieldCheck,
        iconClass: "bg-indigo-50 text-indigo-600",
        valueClass: "text-slate-950",
    },

    active: {
        label: "Active",
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-600",
        valueClass: "text-emerald-700",
    },

    expiring: {
        label: "Expiring soon",
        icon: Clock3,
        iconClass: "bg-amber-50 text-amber-600",
        valueClass: "text-amber-700",
    },

    expired: {
        label: "Expired",
        icon: AlertTriangle,
        iconClass: "bg-rose-50 text-rose-600",
        valueClass: "text-rose-700",
    },
};


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
    type,
    value,
}) => {

    const config =
        STAT_CONFIG[type];

    const Icon =
        config.icon;


    return (
        <div
            className="
                group
                rounded-[1.35rem]
                border
                border-slate-200/80
                bg-white
                p-4
                shadow-[0_8px_30px_rgba(15,23,42,0.035)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                {/* LABEL */}

                <div>

                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                        "
                    >
                        {config.label}
                    </p>


                    <p
                        className={`
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            ${config.valueClass}
                        `}
                    >
                        {value}
                    </p>

                </div>


                {/* ICON */}

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition-transform
                        duration-300
                        group-hover:scale-105
                        ${config.iconClass}
                    `}
                >

                    <Icon
                        size={18}
                        strokeWidth={2}
                    />

                </div>

            </div>

        </div>
    );
};


// ============================================================
// WARRANTY STATS
// ============================================================

const WarrantyStats = ({
    warranties = [],
}) => {

    // ============================================================
    // SAFE ARRAY
    // ============================================================

    const list =
        Array.isArray(warranties)
            ? warranties
            : [];


    // ============================================================
    // CALCULATE STATUS COUNTS
    // ============================================================

    const stats = list.reduce(
        (result, warranty) => {

            const status =
                getWarrantyStatus(
                    warranty
                );


            result.total += 1;


            switch (status) {

                case "Active":
                    result.active += 1;
                    break;


                case "Expiring Soon":
                    result.expiring += 1;
                    break;


                case "Expired":
                    result.expired += 1;
                    break;


                default:
                    break;
            }


            return result;

        },
        {
            total: 0,
            active: 0,
            expiring: 0,
            expired: 0,
        }
    );


    return (
        <div
            className="
                grid
                grid-cols-2
                gap-3
                xl:grid-cols-4
            "
        >

            <StatCard
                type="total"
                value={stats.total}
            />


            <StatCard
                type="active"
                value={stats.active}
            />


            <StatCard
                type="expiring"
                value={stats.expiring}
            />


            <StatCard
                type="expired"
                value={stats.expired}
            />

        </div>
    );
};


export default WarrantyStats;