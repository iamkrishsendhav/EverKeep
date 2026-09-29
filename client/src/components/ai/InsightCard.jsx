import React from "react";
import {
    Lightbulb,
    ArrowUpRight,
    AlertCircle,
    CheckCircle2,
    Info,
    Sparkles,
} from "lucide-react";


// ============================================================================
// ICON MAP
// ============================================================================

const ICONS = {
    insight: Lightbulb,
    recommendation: Sparkles,
    warning: AlertCircle,
    success: CheckCircle2,
    info: Info,
};


// ============================================================================
// INSIGHT CARD
// ============================================================================
//
// Reusable AI insight component.
//
// Props:
//
// title
// description
// type
// actionLabel
// onAction
//
// Example:
//
// <InsightCard
//     title="Warranty expiring soon"
//     description="Your MacBook Pro warranty expires in 12 days."
//     type="warning"
// />
//
// ============================================================================

const InsightCard = ({
    title,
    description,
    type = "insight",
    actionLabel = "",
    onAction,
    className = "",
}) => {

    const Icon =
        ICONS[type] || Lightbulb;


    // ------------------------------------------------------------------------
    // VISUAL CONFIGURATION
    // ------------------------------------------------------------------------

    const config = {

        insight: {
            icon: "text-amber-600",
            iconBackground: "bg-amber-50",
        },

        recommendation: {
            icon: "text-violet-600",
            iconBackground: "bg-violet-50",
        },

        warning: {
            icon: "text-orange-600",
            iconBackground: "bg-orange-50",
        },

        success: {
            icon: "text-emerald-600",
            iconBackground: "bg-emerald-50",
        },

        info: {
            icon: "text-blue-600",
            iconBackground: "bg-blue-50",
        },

    }[type] || {
        icon: "text-amber-600",
        iconBackground: "bg-amber-50",
    };


    // ------------------------------------------------------------------------
    // EMPTY STATE
    // ------------------------------------------------------------------------

    if (!title && !description) {
        return null;
    }


    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------

    return (

        <article
            className={`
                group
                relative
                w-full
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                px-4
                py-4
                transition-all
                duration-200
                hover:border-slate-300
                hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                ${className}
            `}
        >

            <div className="flex items-start gap-3">


                {/* ==========================================================
                    ICON
                ========================================================== */}

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${config.iconBackground}
                    `}
                >

                    <Icon
                        size={17}
                        strokeWidth={1.8}
                        className={config.icon}
                    />

                </div>


                {/* ==========================================================
                    CONTENT
                ========================================================== */}

                <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                        <h3
                            className="
                                text-sm
                                font-semibold
                                leading-5
                                text-slate-900
                            "
                        >
                            {title}
                        </h3>

                    </div>


                    {description && (

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            {description}
                        </p>

                    )}


                    {/* ======================================================
                        OPTIONAL ACTION
                    ====================================================== */}

                    {actionLabel && typeof onAction === "function" && (

                        <button
                            type="button"
                            onClick={onAction}
                            className="
                                mt-3
                                inline-flex
                                items-center
                                gap-1.5
                                text-xs
                                font-semibold
                                text-slate-900
                                transition-colors
                                hover:text-slate-600
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-slate-300
                                focus-visible:ring-offset-2
                                rounded-md
                            "
                        >

                            {actionLabel}

                            <ArrowUpRight
                                size={13}
                                strokeWidth={2}
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-0.5
                                    group-hover:-translate-y-0.5
                                "
                            />

                        </button>

                    )}

                </div>

            </div>

        </article>

    );
};


export default React.memo(InsightCard);