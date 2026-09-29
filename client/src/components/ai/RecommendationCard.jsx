import React from "react";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    ExternalLink,
    Lightbulb,
    ShieldCheck,
    Sparkles,
} from "lucide-react";


// ============================================================================
// ICONS
// ============================================================================

const ICONS = {
    default: Sparkles,
    insight: Lightbulb,
    warranty: ShieldCheck,
    reminder: Clock3,
    success: CheckCircle2,
};


// ============================================================================
// RECOMMENDATION CARD
// ============================================================================
//
// Reusable AI recommendation component.
//
// Props:
//
// title
// description
// reason
// type
// actionLabel
// onAction
// secondaryLabel
// onSecondaryAction
//
// ============================================================================

const RecommendationCard = ({
    title,
    description,
    reason = "",
    type = "default",

    actionLabel = "",
    onAction,

    secondaryLabel = "",
    onSecondaryAction,

    className = "",
}) => {

    const Icon =
        ICONS[type] || ICONS.default;


    // ------------------------------------------------------------------------
    // ICON CONFIG
    // ------------------------------------------------------------------------

    const iconConfig = {

        default: {
            wrapper: "bg-violet-50",
            icon: "text-violet-600",
        },

        insight: {
            wrapper: "bg-amber-50",
            icon: "text-amber-600",
        },

        warranty: {
            wrapper: "bg-blue-50",
            icon: "text-blue-600",
        },

        reminder: {
            wrapper: "bg-orange-50",
            icon: "text-orange-600",
        },

        success: {
            wrapper: "bg-emerald-50",
            icon: "text-emerald-600",
        },

    }[type] || {
        wrapper: "bg-violet-50",
        icon: "text-violet-600",
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
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                transition-all
                duration-200
                hover:border-slate-300
                hover:shadow-[0_10px_35px_rgba(15,23,42,0.06)]
                ${className}
            `}
        >

            {/* ================================================================
                MAIN CONTENT
            ================================================================ */}

            <div className="p-5">


                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className="flex items-start gap-3">


                    {/* --------------------------------------------------------
                        ICON
                    -------------------------------------------------------- */}

                    <div
                        className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${iconConfig.wrapper}
                        `}
                    >

                        <Icon
                            size={17}
                            strokeWidth={1.8}
                            className={iconConfig.icon}
                        />

                    </div>


                    {/* --------------------------------------------------------
                        TITLE
                    -------------------------------------------------------- */}

                    <div className="min-w-0 flex-1">

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


                        {description && (

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    leading-6
                                    text-slate-600
                                "
                            >
                                {description}
                            </p>

                        )}

                    </div>

                </div>


                {/* ============================================================
                    AI REASON
                ============================================================ */}

                {reason && (

                    <div
                        className="
                            mt-4
                            rounded-xl
                            bg-slate-50
                            px-3.5
                            py-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                gap-2.5
                            "
                        >

                            <Sparkles
                                size={14}
                                strokeWidth={1.8}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-slate-500
                                "
                            />


                            <p
                                className="
                                    text-xs
                                    leading-5
                                    text-slate-600
                                "
                            >
                                {reason}
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* ================================================================
                ACTION FOOTER
            ================================================================ */}

            {(actionLabel || secondaryLabel) && (

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-slate-100
                        px-5
                        py-3.5
                    "
                >

                    {/* --------------------------------------------------------
                        SECONDARY ACTION
                    -------------------------------------------------------- */}

                    <div>

                        {secondaryLabel &&
                            typeof onSecondaryAction === "function" && (

                                <button
                                    type="button"
                                    onClick={onSecondaryAction}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        px-2
                                        py-1.5
                                        text-xs
                                        font-medium
                                        text-slate-500
                                        transition-colors
                                        hover:bg-slate-50
                                        hover:text-slate-900
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-slate-300
                                    "
                                >

                                    {secondaryLabel}

                                </button>

                            )}

                    </div>


                    {/* --------------------------------------------------------
                        PRIMARY ACTION
                    -------------------------------------------------------- */}

                    {actionLabel &&
                        typeof onAction === "function" && (

                            <button
                                type="button"
                                onClick={onAction}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-slate-900
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-200
                                    hover:bg-slate-800
                                    active:scale-[0.98]
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-slate-400
                                    focus-visible:ring-offset-2
                                "
                            >

                                {actionLabel}

                                <ArrowRight
                                    size={13}
                                    strokeWidth={2}
                                    className="
                                        transition-transform
                                        duration-200
                                        group-hover:translate-x-0.5
                                    "
                                />

                            </button>

                        )}

                </div>

            )}

        </article>

    );
};


export default React.memo(
    RecommendationCard
);