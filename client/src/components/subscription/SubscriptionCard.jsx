import {
    CalendarDays,
    CheckCircle2,
    CreditCard,
    MoreHorizontal,
    Pencil,
    RefreshCw,
    Trash2,
} from "lucide-react";

import {
    formatCurrency,
    formatSubscriptionDate,
    getBillingCycleLabel,
    getBillingStatus,
    getBillingStatusClasses,
    getBillingText,
    getCategoryClasses,
    getCategoryLabel,
    getProviderName,
    getStatusClasses,
    getStatusLabel,
    getSubscriptionInitials,
    getSubscriptionName,
} from "./subscriptionHelpers";

// ============================================================================
// SUBSCRIPTION CARD
// ============================================================================
//
// Responsible for displaying one subscription.
//
// Actions:
// - Open details
// - Edit
// - Delete
//
// No API calls are made here.
// ============================================================================

const SubscriptionCard = ({ subscription, onClick, onEdit, onDelete }) => {
    if (!subscription) {
        return null;
    }

    // =========================================================================
    // DATA
    // =========================================================================

    const name = getSubscriptionName(subscription);

    const provider = getProviderName(subscription);

    const initials = getSubscriptionInitials(name);

    const category = getCategoryLabel(subscription.category);

    const billingCycle = getBillingCycleLabel(subscription.billingCycle);

    const status = getStatusLabel(subscription.status);

    const statusClasses = getStatusClasses(subscription.status);

    const billingStatus = getBillingStatus(
        subscription.nextBillingDate,
        subscription.status,
    );

    const billingStatusClasses = getBillingStatusClasses(billingStatus.key);

    const billingText = getBillingText(
        subscription.nextBillingDate,
        subscription.status,
    );

    const categoryClasses = getCategoryClasses(subscription.category);

    // =========================================================================
    // HANDLERS
    // =========================================================================

    const handleCardClick = () => {
        onClick?.(subscription);
    };

    const handleEdit = (event) => {
        event.stopPropagation();

        onEdit?.(subscription);
    };

    const handleDelete = (event) => {
        event.stopPropagation();

        onDelete?.(subscription);
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <article
            className="
                group
                relative
                flex
                min-w-0
                cursor-pointer
                flex-col
                overflow-hidden
                rounded-[1.35rem]
                border
                border-slate-200/80
                bg-white
                p-4
                shadow-[0_8px_30px_rgba(15,23,42,0.045)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-slate-300
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]

                focus-within:border-indigo-200
            "
            onClick={handleCardClick}
        >
            {/* =================================================================
                TOP ACCENT
            ================================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-300/70
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* =================================================================
                HEADER
            ================================================================= */}

            <div
                className="
                    flex
                    min-w-0
                    items-start
                    justify-between
                    gap-3
                "
            >
                {/* -------------------------------------------------------------
                    PROVIDER / ICON
                ------------------------------------------------------------- */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    <div
                        className={`
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            text-sm
                            font-extrabold
                            ring-1
                            ${categoryClasses.icon}
                        `}
                    >
                        {initials}
                    </div>

                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h3
                            className="
                                truncate
                                text-[14px]
                                font-bold
                                tracking-tight
                                text-slate-950
                            "
                            title={name}
                        >
                            {name}
                        </h3>

                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[11px]
                                font-medium
                                text-slate-400
                            "
                            title={provider}
                        >
                            {provider}
                        </p>
                    </div>
                </div>

                {/* -------------------------------------------------------------
                    MENU
                ------------------------------------------------------------- */}

                <button
                    type="button"
                    onClick={handleCardClick}
                    aria-label={`Open ${name}`}
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-400
                        opacity-70
                        transition-all
                        duration-200

                        hover:bg-slate-100
                        hover:text-slate-700

                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-50

                        sm:opacity-0
                        sm:group-hover:opacity-100
                    "
                >
                    <MoreHorizontal size={17} />
                </button>
            </div>

            {/* =================================================================
                STATUS ROW
            ================================================================= */}

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                "
            >
                {/* STATUS */}

                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        ring-1
                        ${statusClasses.badge}
                    `}
                >
                    <span
                        className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${statusClasses.dot}
                        `}
                    />

                    {status}
                </span>

                {/* CATEGORY */}

                <span
                    className="
                        rounded-full
                        bg-slate-50
                        px-2.5
                        py-1
                        text-[9px]
                        font-bold
                        text-slate-500
                        ring-1
                        ring-slate-200
                    "
                >
                    {category}
                </span>
            </div>

            {/* =================================================================
                PRICE
            ================================================================= */}

            <div
                className="
                    mt-5
                    flex
                    items-end
                    justify-between
                    gap-3
                "
            >
                <div>
                    <p
                        className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-slate-400
                        "
                    >
                        Billing
                    </p>

                    <div
                        className="
                            mt-1
                            flex
                            items-baseline
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                text-xl
                                font-extrabold
                                tracking-tight
                                text-slate-950
                            "
                        >
                            {formatCurrency(
                                subscription.amount,
                                subscription.currency || "INR",
                            )}
                        </span>

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                text-slate-400
                            "
                        >
                            / {billingCycle.toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* PAYMENT */}

                {subscription.paymentMethod && (
                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-slate-50
                            px-2
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-slate-500
                            ring-1
                            ring-slate-100
                        "
                    >
                        <CreditCard size={11} />

                        <span className="max-w-[70px] truncate">
                            {subscription.paymentMethod}
                        </span>
                    </div>
                )}
            </div>

            {/* =================================================================
                BILLING INFORMATION
            ================================================================= */}

            <div
                className="
                    mt-4
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-3
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
                        <div
                            className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-slate-500
                                shadow-sm
                            "
                        >
                            <CalendarDays size={13} />
                        </div>

                        <div
                            className="
                                min-w-0
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.1em]
                                    text-slate-400
                                "
                            >
                                Next billing
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-[11px]
                                    font-bold
                                    text-slate-700
                                "
                            >
                                {formatSubscriptionDate(subscription.nextBillingDate)}
                            </p>
                        </div>
                    </div>

                    {/* BILLING STATUS */}

                    <span
                        className={`
                            shrink-0
                            rounded-full
                            px-2
                            py-1
                            text-[9px]
                            font-bold
                            ring-1
                            ${billingStatusClasses.badge}
                        `}
                    >
                        {billingStatus.label}
                    </span>
                </div>

                <div
                    className="
                        mt-2.5
                        flex
                        items-center
                        justify-between
                        gap-2
                        border-t
                        border-slate-200/60
                        pt-2.5
                    "
                >
                    <span
                        className="
                            text-[10px]
                            font-medium
                            text-slate-400
                        "
                    >
                        {billingText}
                    </span>

                    {subscription.autoRenew ? (
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                                text-[9px]
                                font-bold
                                text-emerald-600
                            "
                        >
                            <RefreshCw size={10} />
                            Auto-renew
                        </span>
                    ) : (
                        <span
                            className="
                                text-[9px]
                                font-bold
                                text-slate-400
                            "
                        >
                            Manual renewal
                        </span>
                    )}
                </div>
            </div>

            {/* =================================================================
                ACTIONS
            ================================================================= */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-2
                    border-t
                    border-slate-100
                    pt-3
                "
            >
                {/* ACTIVE INDICATOR */}

                <div
                    className="
                        flex
                        items-center
                        gap-1.5
                        text-[9px]
                        font-semibold
                        text-slate-400
                    "
                >
                    <CheckCircle2
                        size={12}
                        className="
                            text-emerald-500
                        "
                    />

                    <span>Subscription tracked</span>
                </div>

                {/* ACTION BUTTONS */}

                <div
                    className="
                        flex
                        items-center
                        gap-1
                    "
                >
                    <button
                        type="button"
                        onClick={handleEdit}
                        aria-label={`Edit ${name}`}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition-all
                            duration-200

                            hover:bg-indigo-50
                            hover:text-indigo-600

                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-50
                        "
                    >
                        <Pencil size={13} />
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        aria-label={`Delete ${name}`}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition-all
                            duration-200

                            hover:bg-rose-50
                            hover:text-rose-600

                            focus:outline-none
                            focus:ring-4
                            focus:ring-rose-50
                        "
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default SubscriptionCard;
