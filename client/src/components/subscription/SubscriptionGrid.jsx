import { CreditCard, Plus, Search } from "lucide-react";

import SubscriptionCard from "./SubscriptionCard";

// ============================================================================
// SUBSCRIPTION GRID
// ============================================================================
//
// Responsible for:
// - Rendering subscription cards
// - Empty state
// - Search/filter empty state
// - Add subscription CTA
// - Responsive grid layout
//
// No API calls are made here.
// ============================================================================

const SubscriptionGrid = ({
    subscriptions = [],

    loading = false,

    searchQuery = "",

    onSubscriptionClick,
    onEdit,
    onDelete,
    onAdd,

    emptyTitle = "No subscriptions yet",
    emptyDescription = "Start tracking your recurring subscriptions to keep renewals and spending under control.",
}) => {
    // =========================================================================
    // LOADING STATE
    // =========================================================================

    if (loading) {
        return (
            <div
                className="
                    grid
                    grid-cols-1
                    gap-4

                    sm:grid-cols-2

                    xl:grid-cols-3
                "
                aria-label="Loading subscriptions"
            >
                {Array.from({ length: 6 }).map((_, index) => (
                    <SubscriptionSkeleton key={index} />
                ))}
            </div>
        );
    }

    // =========================================================================
    // EMPTY STATE
    // =========================================================================

    if (!subscriptions.length) {
        const hasSearch = Boolean(searchQuery?.trim());

        return (
            <EmptyState
                hasSearch={hasSearch}
                title={hasSearch ? "No subscriptions found" : emptyTitle}
                description={
                    hasSearch
                        ? `No subscriptions match "${searchQuery.trim()}". Try a different search or clear your filters.`
                        : emptyDescription
                }
                onAdd={hasSearch ? undefined : onAdd}
            />
        );
    }

    // =========================================================================
    // GRID
    // =========================================================================

    return (
        <div
            className="
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2

                xl:grid-cols-3
            "
        >
            {subscriptions.map((subscription) => (
                <SubscriptionCard
                    key={subscription._id}
                    subscription={subscription}
                    onClick={onSubscriptionClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

// ============================================================================
// SKELETON
// ============================================================================

const SubscriptionSkeleton = () => {
    return (
        <div
            className="
                overflow-hidden
                rounded-[1.35rem]
                border
                border-slate-200/80
                bg-white
                p-4
                shadow-[0_8px_30px_rgba(15,23,42,0.035)]
            "
            aria-hidden="true"
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >
                <div
                    className="
                        h-11
                        w-11
                        shrink-0
                        animate-pulse
                        rounded-2xl
                        bg-slate-100
                    "
                />

                <div
                    className="
                        min-w-0
                        flex-1
                        space-y-2
                    "
                >
                    <div
                        className="
                            h-3
                            w-28
                            animate-pulse
                            rounded-full
                            bg-slate-100
                        "
                    />

                    <div
                        className="
                            h-2.5
                            w-20
                            animate-pulse
                            rounded-full
                            bg-slate-100
                        "
                    />
                </div>
            </div>

            {/* BADGES */}

            <div
                className="
                    mt-4
                    flex
                    gap-2
                "
            >
                <div
                    className="
                        h-5
                        w-14
                        animate-pulse
                        rounded-full
                        bg-slate-100
                    "
                />

                <div
                    className="
                        h-5
                        w-20
                        animate-pulse
                        rounded-full
                        bg-slate-100
                    "
                />
            </div>

            {/* PRICE */}

            <div
                className="
                    mt-5
                    space-y-2
                "
            >
                <div
                    className="
                        h-2
                        w-16
                        animate-pulse
                        rounded-full
                        bg-slate-100
                    "
                />

                <div
                    className="
                        h-6
                        w-32
                        animate-pulse
                        rounded-lg
                        bg-slate-100
                    "
                />
            </div>

            {/* BILLING BOX */}

            <div
                className="
                    mt-4
                    h-[86px]
                    animate-pulse
                    rounded-xl
                    bg-slate-50
                "
            />

            {/* FOOTER */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-100
                    pt-3
                "
            >
                <div
                    className="
                        h-2.5
                        w-28
                        animate-pulse
                        rounded-full
                        bg-slate-100
                    "
                />

                <div
                    className="
                        flex
                        gap-1
                    "
                >
                    <div
                        className="
                            h-8
                            w-8
                            animate-pulse
                            rounded-lg
                            bg-slate-100
                        "
                    />

                    <div
                        className="
                            h-8
                            w-8
                            animate-pulse
                            rounded-lg
                            bg-slate-100
                        "
                    />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyState = ({ hasSearch, title, description, onAdd }) => {
    return (
        <div
            className="
                flex
                min-h-[360px]
                items-center
                justify-center
                rounded-[1.5rem]
                border
                border-dashed
                border-slate-200
                bg-white
                px-6
                py-12
            "
        >
            <div
                className="
                    mx-auto
                    max-w-md
                    text-center
                "
            >
                {/* ICON */}

                <div
                    className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-indigo-50
                        text-indigo-600
                        ring-1
                        ring-indigo-100
                    "
                >
                    {hasSearch ? (
                        <Search size={23} strokeWidth={1.9} />
                    ) : (
                        <CreditCard size={23} strokeWidth={1.9} />
                    )}
                </div>

                {/* TITLE */}

                <h3
                    className="
                        mt-5
                        text-base
                        font-bold
                        tracking-tight
                        text-slate-950
                    "
                >
                    {title}
                </h3>

                {/* DESCRIPTION */}

                <p
                    className="
                        mx-auto
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    {description}
                </p>

                {/* CTA */}

                {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="
                            mt-5
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-slate-950
                            px-4
                            text-xs
                            font-bold
                            text-white
                            shadow-[0_8px_20px_rgba(15,23,42,0.12)]
                            transition-all
                            duration-200

                            hover:-translate-y-0.5
                            hover:bg-slate-800
                            hover:shadow-[0_12px_25px_rgba(15,23,42,0.16)]

                            focus:outline-none
                            focus:ring-4
                            focus:ring-slate-200
                        "
                    >
                        <Plus size={15} strokeWidth={2.4} />
                        Add subscription
                    </button>
                )}
            </div>
        </div>
    );
};

export default SubscriptionGrid;
