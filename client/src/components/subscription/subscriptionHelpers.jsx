// ============================================================================
// SUBSCRIPTION HELPERS
// ============================================================================
//
// Pure utility functions for subscription UI/business formatting.
//
// No React.
// No API calls.
// No component state.
// No side effects.
// ============================================================================

// ============================================================================
// CONSTANTS
// ============================================================================

export const SUBSCRIPTION_CATEGORIES = [
    {
        value: "streaming",
        label: "Streaming",
    },
    {
        value: "software",
        label: "Software",
    },
    {
        value: "cloud",
        label: "Cloud",
    },
    {
        value: "gaming",
        label: "Gaming",
    },
    {
        value: "music",
        label: "Music",
    },
    {
        value: "education",
        label: "Education",
    },
    {
        value: "fitness",
        label: "Fitness",
    },
    {
        value: "news",
        label: "News",
    },
    {
        value: "shopping",
        label: "Shopping",
    },
    {
        value: "utilities",
        label: "Utilities",
    },
    {
        value: "other",
        label: "Other",
    },
];

export const BILLING_CYCLES = [
    {
        value: "weekly",
        label: "Weekly",
    },
    {
        value: "monthly",
        label: "Monthly",
    },
    {
        value: "quarterly",
        label: "Quarterly",
    },
    {
        value: "half-yearly",
        label: "Half-yearly",
    },
    {
        value: "yearly",
        label: "Yearly",
    },
    {
        value: "custom",
        label: "Custom",
    },
];

export const SUBSCRIPTION_STATUSES = [
    {
        value: "active",
        label: "Active",
    },
    {
        value: "paused",
        label: "Paused",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
    {
        value: "expired",
        label: "Expired",
    },
];

// ============================================================================
// CATEGORY LABEL
// ============================================================================

export const getCategoryLabel = (category) => {
    const option = SUBSCRIPTION_CATEGORIES.find(
        (item) => item.value === category,
    );

    return option?.label || "Other";
};

// ============================================================================
// BILLING CYCLE LABEL
// ============================================================================

export const getBillingCycleLabel = (billingCycle) => {
    const option = BILLING_CYCLES.find((item) => item.value === billingCycle);

    return option?.label || "Custom";
};

// ============================================================================
// STATUS LABEL
// ============================================================================

export const getStatusLabel = (status) => {
    const option = SUBSCRIPTION_STATUSES.find((item) => item.value === status);

    return option?.label || "Unknown";
};

// ============================================================================
// CURRENCY FORMATTER
// ============================================================================

export const formatCurrency = (amount, currency = "INR") => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
        return "—";
    }

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(numericAmount);
    } catch {
        return `${currency} ${numericAmount.toFixed(2)}`;
    }
};

// ============================================================================
// DATE FORMATTER
// ============================================================================

export const formatSubscriptionDate = (date) => {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// ============================================================================
// SHORT DATE FORMATTER
// ============================================================================

export const formatShortDate = (date) => {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
};

// ============================================================================
// DAYS UNTIL BILLING
// ============================================================================

export const getDaysUntilBilling = (billingDate) => {
    if (!billingDate) {
        return null;
    }

    const target = new Date(billingDate);

    if (Number.isNaN(target.getTime())) {
        return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    target.setHours(0, 0, 0, 0);

    const difference = target.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

// ============================================================================
// BILLING STATUS
// ============================================================================

export const getBillingStatus = (billingDate, status = "active") => {
    if (status !== "active") {
        return {
            key: status,
            label: getStatusLabel(status),
        };
    }

    const days = getDaysUntilBilling(billingDate);

    if (days === null) {
        return {
            key: "unknown",
            label: "No billing date",
        };
    }

    if (days < 0) {
        return {
            key: "overdue",
            label: "Overdue",
        };
    }

    if (days === 0) {
        return {
            key: "today",
            label: "Due today",
        };
    }

    if (days <= 3) {
        return {
            key: "soon",
            label: "Due soon",
        };
    }

    if (days <= 30) {
        return {
            key: "upcoming",
            label: "Upcoming",
        };
    }

    return {
        key: "scheduled",
        label: "Scheduled",
    };
};

// ============================================================================
// BILLING TEXT
// ============================================================================

export const getBillingText = (billingDate, status = "active") => {
    if (status !== "active") {
        return getStatusLabel(status);
    }

    const days = getDaysUntilBilling(billingDate);

    if (days === null) {
        return "Billing date unavailable";
    }

    if (days < 0) {
        const overdueDays = Math.abs(days);

        return `${overdueDays} ${overdueDays === 1 ? "day" : "days"} overdue`;
    }

    if (days === 0) {
        return "Due today";
    }

    if (days === 1) {
        return "Due tomorrow";
    }

    return `Due in ${days} days`;
};

// ============================================================================
// MONTHLY COST
// ============================================================================

export const getMonthlyCost = (amount, billingCycle) => {
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
        return 0;
    }

    switch (billingCycle) {
        case "weekly":
            return numericAmount * 4.345;

        case "monthly":
            return numericAmount;

        case "quarterly":
            return numericAmount / 3;

        case "half-yearly":
            return numericAmount / 6;

        case "yearly":
            return numericAmount / 12;

        default:
            return 0;
    }
};

// ============================================================================
// YEARLY COST
// ============================================================================

export const getYearlyCost = (amount, billingCycle) => {
    return getMonthlyCost(amount, billingCycle) * 12;
};

// ============================================================================
// SUBSCRIPTION MONTHLY DISPLAY
// ============================================================================

export const getMonthlyCostDisplay = (subscription) => {
    if (!subscription) {
        return "—";
    }

    const monthlyCost = getMonthlyCost(
        subscription.amount,
        subscription.billingCycle,
    );

    return formatCurrency(monthlyCost, subscription.currency || "INR");
};

// ============================================================================
// SUBSCRIPTION YEARLY DISPLAY
// ============================================================================

export const getYearlyCostDisplay = (subscription) => {
    if (!subscription) {
        return "—";
    }

    const yearlyCost = getYearlyCost(
        subscription.amount,
        subscription.billingCycle,
    );

    return formatCurrency(yearlyCost, subscription.currency || "INR");
};

// ============================================================================
// AUTO RENEWAL LABEL
// ============================================================================

export const getAutoRenewLabel = (autoRenew) => {
    return autoRenew ? "Auto-renew" : "Manual renewal";
};

// ============================================================================
// STATUS COLOR CLASSES
// ============================================================================

export const getStatusClasses = (status) => {
    switch (status) {
        case "active":
            return {
                badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
                dot: "bg-emerald-500",
            };

        case "paused":
            return {
                badge: "bg-amber-50 text-amber-700 ring-amber-100",
                dot: "bg-amber-500",
            };

        case "cancelled":
            return {
                badge: "bg-slate-100 text-slate-600 ring-slate-200",
                dot: "bg-slate-400",
            };

        case "expired":
            return {
                badge: "bg-rose-50 text-rose-700 ring-rose-100",
                dot: "bg-rose-500",
            };

        default:
            return {
                badge: "bg-slate-100 text-slate-600 ring-slate-200",
                dot: "bg-slate-400",
            };
    }
};

// ============================================================================
// BILLING STATUS COLOR CLASSES
// ============================================================================

export const getBillingStatusClasses = (billingStatus) => {
    switch (billingStatus) {
        case "today":

        case "soon":
            return {
                badge: "bg-rose-50 text-rose-700 ring-rose-100",
                dot: "bg-rose-500",
            };

        case "upcoming":
            return {
                badge: "bg-indigo-50 text-indigo-700 ring-indigo-100",
                dot: "bg-indigo-500",
            };

        case "overdue":
            return {
                badge: "bg-red-50 text-red-700 ring-red-100",
                dot: "bg-red-500",
            };

        case "scheduled":
            return {
                badge: "bg-slate-50 text-slate-600 ring-slate-200",
                dot: "bg-slate-400",
            };

        default:
            return {
                badge: "bg-slate-50 text-slate-600 ring-slate-200",
                dot: "bg-slate-400",
            };
    }
};

// ============================================================================
// CATEGORY ICON COLOR
// ============================================================================

export const getCategoryClasses = (category) => {
    switch (category) {
        case "streaming":
            return {
                icon: "bg-rose-50 text-rose-600",
            };

        case "software":
            return {
                icon: "bg-indigo-50 text-indigo-600",
            };

        case "cloud":
            return {
                icon: "bg-sky-50 text-sky-600",
            };

        case "gaming":
            return {
                icon: "bg-violet-50 text-violet-600",
            };

        case "music":
            return {
                icon: "bg-pink-50 text-pink-600",
            };

        case "education":
            return {
                icon: "bg-amber-50 text-amber-600",
            };

        case "fitness":
            return {
                icon: "bg-emerald-50 text-emerald-600",
            };

        case "news":
            return {
                icon: "bg-cyan-50 text-cyan-600",
            };

        case "shopping":
            return {
                icon: "bg-orange-50 text-orange-600",
            };

        case "utilities":
            return {
                icon: "bg-teal-50 text-teal-600",
            };

        default:
            return {
                icon: "bg-slate-100 text-slate-600",
            };
    }
};

// ============================================================================
// SAFE SUBSCRIPTION NAME
// ============================================================================

export const getSubscriptionName = (subscription) => {
    return subscription?.name?.trim() || "Untitled subscription";
};

// ============================================================================
// SAFE PROVIDER NAME
// ============================================================================

export const getProviderName = (subscription) => {
    return subscription?.provider?.trim() || "Unknown provider";
};

// ============================================================================
// INITIALS
// ============================================================================

export const getSubscriptionInitials = (name) => {
    if (!name) {
        return "S";
    }

    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// ============================================================================
// SORT SUBSCRIPTIONS BY BILLING DATE
// ============================================================================

export const sortByBillingDate = (subscriptions = []) => {
    return [...subscriptions].sort((a, b) => {
        const dateA = new Date(a?.nextBillingDate).getTime();

        const dateB = new Date(b?.nextBillingDate).getTime();

        return dateA - dateB;
    });
};

// ============================================================================
// FILTER ACTIVE SUBSCRIPTIONS
// ============================================================================

export const getActiveSubscriptions = (subscriptions = []) => {
    return subscriptions.filter(
        (subscription) => subscription?.status === "active",
    );
};

// ============================================================================
// UPCOMING SUBSCRIPTIONS
// ============================================================================

export const getUpcomingSubscriptionsLocal = (
    subscriptions = [],
    days = 30,
) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);

    futureDate.setDate(futureDate.getDate() + Number(days));

    return subscriptions
        .filter((subscription) => {
            if (subscription?.status !== "active") {
                return false;
            }

            if (!subscription?.nextBillingDate) {
                return false;
            }

            const billingDate = new Date(subscription.nextBillingDate);

            billingDate.setHours(0, 0, 0, 0);

            return billingDate >= today && billingDate <= futureDate;
        })
        .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate));
};

// ============================================================================
// TOTAL MONTHLY COST
// ============================================================================

export const calculateTotalMonthlyCost = (subscriptions = []) => {
    return subscriptions
        .filter((subscription) => subscription?.status === "active")
        .reduce(
            (total, subscription) =>
                total + getMonthlyCost(subscription.amount, subscription.billingCycle),

            0,
        );
};

// ============================================================================
// TOTAL YEARLY COST
// ============================================================================

export const calculateTotalYearlyCost = (subscriptions = []) => {
    return subscriptions
        .filter((subscription) => subscription?.status === "active")
        .reduce(
            (total, subscription) =>
                total + getYearlyCost(subscription.amount, subscription.billingCycle),

            0,
        );
};
