import { useCallback, useEffect, useMemo, useState } from "react";

import SubscriptionHeader from "../../components/subscription/SubscriptionHeader";
import SubscriptionStats from "../../components/subscription/SubscriptionStats";
import SubscriptionFilters from "../../components/subscription/SubscriptionFilters";
import SubscriptionGrid from "../../components/subscription/SubscriptionGrid";

import AddSubscriptionModal from "../../components/subscription/AddSubscriptionModal";
import EditSubscriptionModal from "../../components/subscription/EditSubscriptionModal";
import DeleteSubscriptionModal from "../../components/subscription/DeleteSubscriptionModal";

import {
    calculateTotalMonthlyCost,
    getUpcomingSubscriptionsLocal,
} from "../../components/subscription/subscriptionHelpers";

import {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
} from "../../services/subscription.service";

// ============================================================================
// SUBSCRIPTIONS PAGE
// ============================================================================
//
// EverKeep — Subscription Management
//
// Responsibilities:
// - Fetch subscriptions
// - Search subscriptions
// - Filter subscriptions
// - Calculate subscription statistics
// - Create subscription
// - Edit subscription
// - Delete subscription
//
// ============================================================================

const DEFAULT_FILTERS = {
    status: "all",
    category: "all",
    billingCycle: "all",
};

// ============================================================================
// NORMALIZE API RESPONSE
// ============================================================================

const normalizeSubscriptionResponse = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.subscriptions)) {
        return data.subscriptions;
    }

    return [];
};

// ============================================================================
// NORMALIZE SINGLE SUBSCRIPTION
// ============================================================================

const normalizeSingleSubscription = (response) => {
    const data = response?.data;

    if (
        data?.data &&
        typeof data.data === "object" &&
        !Array.isArray(data.data)
    ) {
        return data.data;
    }

    if (data?.subscription && typeof data.subscription === "object") {
        return data.subscription;
    }

    if (data && typeof data === "object" && !Array.isArray(data)) {
        return data;
    }

    return null;
};

// ============================================================================
// COMPONENT
// ============================================================================

const Subscriptions = () => {
    // =========================================================================
    // SUBSCRIPTIONS
    // =========================================================================

    const [subscriptions, setSubscriptions] = useState([]);

    // =========================================================================
    // LOADING
    // =========================================================================

    const [loading, setLoading] = useState(true);

    // =========================================================================
    // PAGE ERROR
    // =========================================================================

    const [pageError, setPageError] = useState("");

    // =========================================================================
    // ACTION ERROR
    // =========================================================================

    const [actionError, setActionError] = useState("");

    // =========================================================================
    // SEARCH
    // =========================================================================

    const [searchQuery, setSearchQuery] = useState("");

    // =========================================================================
    // FILTERS
    // =========================================================================

    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    // =========================================================================
    // ADD MODAL
    // =========================================================================

    const [addModalOpen, setAddModalOpen] = useState(false);

    // =========================================================================
    // EDIT MODAL
    // =========================================================================

    const [editingSubscription, setEditingSubscription] = useState(null);

    // =========================================================================
    // DELETE MODAL
    // =========================================================================

    const [deletingSubscription, setDeletingSubscription] = useState(null);

    // =========================================================================
    // ACTION LOADING
    // =========================================================================

    const [actionLoading, setActionLoading] = useState(false);

    // =========================================================================
    // FETCH SUBSCRIPTIONS
    // =========================================================================

    const fetchSubscriptions = useCallback(async () => {
        try {
            setLoading(true);
            setPageError("");

            const response = await getSubscriptions();

            const list = normalizeSubscriptionResponse(response);

            setSubscriptions(list);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);

            setPageError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load subscriptions. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // =========================================================================
    // INITIAL LOAD
    // =========================================================================

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    // =========================================================================
    // SEARCH + FILTER
    // =========================================================================

    const filteredSubscriptions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return subscriptions.filter((subscription) => {
            // ---------------------------------------------------------
            // SEARCH
            // ---------------------------------------------------------

            if (query) {
                const searchableText = [
                    subscription?.name,

                    subscription?.provider,

                    subscription?.plan,

                    subscription?.category,

                    subscription?.paymentMethod,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!searchableText.includes(query)) {
                    return false;
                }
            }

            // ---------------------------------------------------------
            // STATUS
            // ---------------------------------------------------------

            if (filters.status !== "all" && subscription?.status !== filters.status) {
                return false;
            }

            // ---------------------------------------------------------
            // CATEGORY
            // ---------------------------------------------------------

            if (
                filters.category !== "all" &&
                subscription?.category !== filters.category
            ) {
                return false;
            }

            // ---------------------------------------------------------
            // BILLING CYCLE
            // ---------------------------------------------------------

            if (
                filters.billingCycle !== "all" &&
                subscription?.billingCycle !== filters.billingCycle
            ) {
                return false;
            }

            return true;
        });
    }, [subscriptions, searchQuery, filters]);

    // =========================================================================
    // STATISTICS
    // =========================================================================

    const stats = useMemo(() => {
        const active = subscriptions.filter(
            (subscription) => subscription?.status === "active",
        ).length;

        const upcoming = getUpcomingSubscriptionsLocal(subscriptions, 30).length;

        const monthlyCost = calculateTotalMonthlyCost(subscriptions);

        return {
            total: subscriptions.length,

            active,

            upcoming,

            monthlyCost,
        };
    }, [subscriptions]);

    // =========================================================================
    // ACTIVE FILTERS
    // =========================================================================

    const hasActiveFilters =
        filters.status !== "all" ||
        filters.category !== "all" ||
        filters.billingCycle !== "all";

    // =========================================================================
    // FILTER CHANGE
    // =========================================================================

    const handleFilterChange = (nextFilters) => {
        setFilters(nextFilters);
    };

    // =========================================================================
    // CLEAR FILTERS
    // =========================================================================

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    // =========================================================================
    // OPEN ADD MODAL
    // =========================================================================

    const handleOpenAdd = () => {
        setActionError("");

        setAddModalOpen(true);
    };

    // =========================================================================
    // CLOSE ADD MODAL
    // =========================================================================

    const handleCloseAdd = () => {
        if (actionLoading) {
            return;
        }

        setAddModalOpen(false);
    };

    // =========================================================================
    // CREATE SUBSCRIPTION
    // =========================================================================

    const handleCreate = async (formData) => {
        try {
            setActionError("");
            setActionLoading(true);

            const response = await createSubscription(formData);

            const created = normalizeSingleSubscription(response);

            if (created?._id) {
                setSubscriptions((previous) => [created, ...previous]);
            } else {
                await fetchSubscriptions();
            }

            setAddModalOpen(false);
        } catch (error) {
            console.error("Failed to create subscription:", error);

            setActionError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to create subscription.",
            );

            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================================================
    // OPEN EDIT
    // =========================================================================

    const handleOpenEdit = (subscription) => {
        setActionError("");

        setEditingSubscription(subscription);
    };

    // =========================================================================
    // CLOSE EDIT
    // =========================================================================

    const handleCloseEdit = () => {
        if (actionLoading) {
            return;
        }

        setEditingSubscription(null);
    };

    // =========================================================================
    // UPDATE SUBSCRIPTION
    // =========================================================================

    const handleUpdate = async (formData) => {
        if (!editingSubscription?._id) {
            return;
        }

        try {
            setActionError("");
            setActionLoading(true);

            const response = await updateSubscription(
                editingSubscription._id,
                formData,
            );

            const updated = normalizeSingleSubscription(response);

            if (updated?._id) {
                setSubscriptions((previous) =>
                    previous.map((subscription) =>
                        subscription._id === updated._id ? updated : subscription,
                    ),
                );
            } else {
                await fetchSubscriptions();
            }

            setEditingSubscription(null);
        } catch (error) {
            console.error("Failed to update subscription:", error);

            setActionError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update subscription.",
            );

            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================================================
    // OPEN DELETE
    // =========================================================================

    const handleOpenDelete = (subscription) => {
        setActionError("");

        setDeletingSubscription(subscription);
    };

    // =========================================================================
    // CLOSE DELETE
    // =========================================================================

    const handleCloseDelete = () => {
        if (actionLoading) {
            return;
        }

        setDeletingSubscription(null);
    };

    // =========================================================================
    // DELETE SUBSCRIPTION
    // =========================================================================

    const handleDelete = async (subscriptionId) => {
        if (!subscriptionId) {
            return;
        }

        try {
            setActionError("");
            setActionLoading(true);

            await deleteSubscription(subscriptionId);

            setSubscriptions((previous) =>
                previous.filter((subscription) => subscription._id !== subscriptionId),
            );

            setDeletingSubscription(null);
        } catch (error) {
            console.error("Failed to delete subscription:", error);

            setActionError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete subscription.",
            );

            throw error;
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================================================
    // CARD CLICK
    // =========================================================================

    const handleSubscriptionClick = (subscription) => {
        handleOpenEdit(subscription);
    };

    // =========================================================================
    // RETRY
    // =========================================================================

    const handleRetry = () => {
        fetchSubscriptions();
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <main
            className="
                min-h-full
                bg-slate-50/60
                px-4
                py-5

                sm:px-6
                sm:py-6

                lg:px-8
                lg:py-7
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1500px]
                "
            >
                {/* =============================================================
                    HEADER
                ============================================================= */}

                <SubscriptionHeader
                    count={subscriptions.length}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAdd={handleOpenAdd}
                    disabled={loading || actionLoading}
                />

                {/* =============================================================
                    GLOBAL ACTION ERROR
                ============================================================= */}

                {actionError && (
                    <div
                        role="alert"
                        className="
                            mt-4
                            flex
                            items-start
                            justify-between
                            gap-3
                            rounded-2xl
                            border
                            border-rose-200
                            bg-rose-50
                            px-4
                            py-3
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-rose-800
                                "
                            >
                                Something went wrong
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    leading-5
                                    text-rose-600
                                "
                            >
                                {actionError}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActionError("")}
                            className="
                                shrink-0
                                text-[10px]
                                font-bold
                                text-rose-500
                                hover:text-rose-700
                            "
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* =============================================================
                    LOAD ERROR
                ============================================================= */}

                {pageError && (
                    <div
                        role="alert"
                        className="
                            mt-4
                            rounded-2xl
                            border
                            border-rose-200
                            bg-rose-50
                            p-4
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-bold
                                text-rose-800
                            "
                        >
                            Unable to load subscriptions
                        </p>

                        <p
                            className="
                                mt-1
                                text-[11px]
                                leading-5
                                text-rose-600
                            "
                        >
                            {pageError}
                        </p>

                        <button
                            type="button"
                            onClick={handleRetry}
                            className="
                                mt-3
                                h-9
                                rounded-xl
                                bg-rose-600
                                px-4
                                text-[10px]
                                font-bold
                                text-white
                                transition-colors

                                hover:bg-rose-700

                                focus:outline-none
                                focus:ring-4
                                focus:ring-rose-100
                            "
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* =============================================================
                    STATS
                ============================================================= */}

                <section
                    className="
                        mt-5
                    "
                >
                    <SubscriptionStats stats={stats} loading={loading} />
                </section>

                {/* =============================================================
                    FILTERS
                ============================================================= */}

                <section
                    className="
                        mt-5
                    "
                >
                    <SubscriptionFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                        resultCount={filteredSubscriptions.length}
                        hasActiveFilters={hasActiveFilters}
                    />
                </section>

                {/* =============================================================
                    LIST HEADER
                ============================================================= */}

                <div
                    className="
                        mt-6
                        mb-3
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
                                tracking-[0.18em]
                                text-indigo-500
                            "
                        >
                            Your subscriptions
                        </p>

                        <h2
                            className="
                                mt-1
                                text-lg
                                font-extrabold
                                tracking-tight
                                text-slate-950
                            "
                        >
                            Recurring payments
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                font-medium
                                text-slate-400
                            "
                        >
                            {filteredSubscriptions.length}{" "}
                            {filteredSubscriptions.length === 1
                                ? "subscription"
                                : "subscriptions"}{" "}
                            displayed
                        </p>
                    </div>

                    {/* FILTER RESULT */}

                    {(searchQuery || hasActiveFilters) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");

                                handleClearFilters();
                            }}
                            className="
                                shrink-0
                                text-[10px]
                                font-bold
                                text-indigo-600
                                transition-colors

                                hover:text-indigo-800
                            "
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* =============================================================
                    GRID
                ============================================================= */}

                <SubscriptionGrid
                    subscriptions={filteredSubscriptions}
                    loading={loading}
                    searchQuery={searchQuery}
                    onSubscriptionClick={handleSubscriptionClick}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                    onAdd={handleOpenAdd}
                />
            </div>

            {/* =================================================================
                ADD MODAL
            ================================================================= */}

            <AddSubscriptionModal
                open={addModalOpen}
                onClose={handleCloseAdd}
                onSubmit={handleCreate}
                submitting={actionLoading}
            />

            {/* =================================================================
                EDIT MODAL
            ================================================================= */}

            <EditSubscriptionModal
                open={Boolean(editingSubscription)}
                subscription={editingSubscription}
                onClose={handleCloseEdit}
                onUpdated={handleUpdate}
            />

            {/* =================================================================
                DELETE MODAL
            ================================================================= */}

            <DeleteSubscriptionModal
                open={Boolean(deletingSubscription)}
                subscription={deletingSubscription}
                onClose={handleCloseDelete}
                onDeleted={handleDelete}
            />
        </main>
    );
};

export default Subscriptions;
