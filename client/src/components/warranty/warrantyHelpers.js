// ============================================================
// WARRANTY HELPERS
// ============================================================
//
// This file contains small, reusable helpers used by warranty
// components.
//
// IMPORTANT:
// - No API calls here
// - No React state here
// - No UI components here
// - No database logic here
//
// ============================================================


// ============================================================
// SAFE VALUE
// ============================================================

const firstValue = (...values) => {

    for (const value of values) {

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return value;
        }

    }

    return "";
};


// ============================================================
// WARRANTY NAME
// ============================================================

export const getWarrantyName = (warranty) => {

    return (
        firstValue(
            warranty?.title,
            warranty?.name,
            warranty?.warrantyName
        ) ||
        "Untitled Warranty"
    );
};


// ============================================================
// PROVIDER
// ============================================================

export const getProviderName = (warranty) => {

    return (
        firstValue(
            warranty?.provider,
            warranty?.brand,
            warranty?.company,
            warranty?.warrantyProvider
        ) ||
        "Unknown provider"
    );
};


// ============================================================
// ASSET NAME
// ============================================================

export const getAssetName = (warranty) => {

    const asset = warranty?.asset;

    if (asset && typeof asset === "object") {

        return (
            firstValue(
                asset?.name,
                asset?.title,
                asset?.assetName
            ) ||
            "No asset linked"
        );
    }


    return (
        firstValue(
            warranty?.assetName
        ) ||
        "No asset linked"
    );
};


// ============================================================
// WARRANTY ID
// ============================================================

export const getWarrantyId = (warranty) => {

    return (
        warranty?._id ||
        warranty?.id ||
        ""
    );
};


// ============================================================
// DATE PARSER
// ============================================================

export const parseWarrantyDate = (value) => {

    if (!value) {
        return null;
    }


    const date = new Date(value);


    if (Number.isNaN(date.getTime())) {
        return null;
    }


    return date;
};


// ============================================================
// FORMAT DATE
// ============================================================

export const formatWarrantyDate = (
    value,
    options = {}
) => {

    const date =
        parseWarrantyDate(value);


    if (!date) {
        return "—";
    }


    const defaultOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    };


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            ...defaultOptions,
            ...options,
        }
    ).format(date);
};


// ============================================================
// FORMAT SHORT DATE
// ============================================================

export const formatShortWarrantyDate = (
    value
) => {

    return formatWarrantyDate(
        value,
        {
            day: "2-digit",
            month: "short",
        }
    );
};


// ============================================================
// START DATE
// ============================================================

export const getStartDate = (warranty) => {

    return parseWarrantyDate(
        firstValue(
            warranty?.startDate,
            warranty?.start,
            warranty?.validFrom
        )
    );
};


// ============================================================
// EXPIRY DATE
// ============================================================

export const getExpiryDate = (warranty) => {

    return parseWarrantyDate(
        firstValue(
            warranty?.expiryDate,
            warranty?.endDate,
            warranty?.expiry,
            warranty?.validUntil
        )
    );
};


// ============================================================
// DAYS BETWEEN
// ============================================================

export const getDaysDifference = (
    fromDate,
    toDate
) => {

    if (
        !fromDate ||
        !toDate
    ) {
        return null;
    }


    const from =
        new Date(fromDate);

    const to =
        new Date(toDate);


    if (
        Number.isNaN(from.getTime()) ||
        Number.isNaN(to.getTime())
    ) {
        return null;
    }


    // Normalize both dates to midnight.
    // This prevents timezone/time-of-day issues.

    from.setHours(
        0,
        0,
        0,
        0
    );

    to.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        to.getTime() -
        from.getTime();


    return Math.round(
        difference /
        (1000 * 60 * 60 * 24)
    );
};


// ============================================================
// TODAY
// ============================================================

export const getToday = () => {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;
};


// ============================================================
// DAYS UNTIL EXPIRY
// ============================================================

export const getDaysUntilExpiry = (
    warranty
) => {

    const expiry =
        getExpiryDate(warranty);


    if (!expiry) {
        return null;
    }


    return getDaysDifference(
        getToday(),
        expiry
    );
};


// ============================================================
// DAYS SINCE START
// ============================================================

export const getDaysSinceStart = (
    warranty
) => {

    const start =
        getStartDate(warranty);


    if (!start) {
        return null;
    }


    return getDaysDifference(
        start,
        getToday()
    );
};


// ============================================================
// WARRANTY STATUS
// ============================================================

export const getWarrantyStatus = (
    warranty
) => {

    const start =
        getStartDate(warranty);

    const expiry =
        getExpiryDate(warranty);


    if (!expiry) {
        return "Unknown";
    }


    const today =
        getToday();


    // --------------------------------------------------------
    // Expired
    // --------------------------------------------------------

    if (expiry < today) {
        return "Expired";
    }


    // --------------------------------------------------------
    // Upcoming
    // --------------------------------------------------------
    //
    // Start date is in the future.
    //

    if (
        start &&
        start > today
    ) {
        return "Upcoming";
    }


    // --------------------------------------------------------
    // Expiring Soon
    // --------------------------------------------------------
    //
    // Warranty expires within next 30 days.
    //

    const daysLeft =
        getDaysDifference(
            today,
            expiry
        );


    if (
        daysLeft !== null &&
        daysLeft >= 0 &&
        daysLeft <= 30
    ) {
        return "Expiring Soon";
    }


    // --------------------------------------------------------
    // Active
    // --------------------------------------------------------

    return "Active";
};


// ============================================================
// WARRANTY META
// ============================================================

export const getWarrantyMeta = (
    warranty
) => {

    const status =
        getWarrantyStatus(
            warranty
        );


    const daysLeft =
        getDaysUntilExpiry(
            warranty
        );


    switch (status) {

        case "Active":

            return {
                status,
                daysLeft,
                label:
                    daysLeft === 1
                        ? "1 day remaining"
                        : `${daysLeft} days remaining`,
            };


        case "Expiring Soon":

            return {
                status,
                daysLeft,
                label:
                    daysLeft === 0
                        ? "Expires today"
                        : daysLeft === 1
                            ? "Expires tomorrow"
                            : `${daysLeft} days left`,
            };


        case "Upcoming":

            return {
                status,
                daysLeft,
                label:
                    daysLeft === 1
                        ? "Starts tomorrow"
                        : daysLeft > 1
                            ? `Starts in ${daysLeft} days`
                            : "Starts soon",
            };


        case "Expired": {

            const expiredDays =
                daysLeft === null
                    ? null
                    : Math.abs(daysLeft);


            return {
                status,
                daysLeft,
                label:
                    expiredDays === 0
                        ? "Expired today"
                        : expiredDays === 1
                            ? "Expired 1 day ago"
                            : `Expired ${expiredDays} days ago`,
            };
        }


        default:

            return {
                status: "Unknown",
                daysLeft: null,
                label: "Status unavailable",
            };
    }
};


// ============================================================
// STATUS STYLES
// ============================================================

export const getWarrantyStatusStyles = (
    status
) => {

    switch (status) {

        case "Active":

            return {
                badge:
                    "border-emerald-100 bg-emerald-50 text-emerald-700",

                icon:
                    "bg-emerald-50 text-emerald-600",

                dot:
                    "bg-emerald-500",

                accent:
                    "bg-emerald-400",

                time:
                    "text-emerald-600",

                expiry:
                    "text-slate-700",
            };


        case "Expiring Soon":

            return {
                badge:
                    "border-amber-100 bg-amber-50 text-amber-700",

                icon:
                    "bg-amber-50 text-amber-600",

                dot:
                    "bg-amber-500",

                accent:
                    "bg-amber-400",

                time:
                    "text-amber-600",

                expiry:
                    "text-amber-600",
            };


        case "Upcoming":

            return {
                badge:
                    "border-indigo-100 bg-indigo-50 text-indigo-700",

                icon:
                    "bg-indigo-50 text-indigo-600",

                dot:
                    "bg-indigo-500",

                accent:
                    "bg-indigo-400",

                time:
                    "text-indigo-600",

                expiry:
                    "text-slate-700",
            };


        case "Expired":

            return {
                badge:
                    "border-rose-100 bg-rose-50 text-rose-700",

                icon:
                    "bg-rose-50 text-rose-600",

                dot:
                    "bg-rose-500",

                accent:
                    "bg-rose-400",

                time:
                    "text-rose-600",

                expiry:
                    "text-rose-600",
            };


        default:

            return {
                badge:
                    "border-slate-200 bg-slate-50 text-slate-600",

                icon:
                    "bg-slate-50 text-slate-500",

                dot:
                    "bg-slate-400",

                accent:
                    "bg-slate-300",

                time:
                    "text-slate-500",

                expiry:
                    "text-slate-700",
            };
    }
};


// ============================================================
// WARRANTY TIME LABEL
// ============================================================

export const getWarrantyTimeLabel = (
    warranty
) => {

    return getWarrantyMeta(
        warranty
    ).label;
};


// ============================================================
// WARRANTY DURATION
// ============================================================

export const getWarrantyDuration = (
    warranty
) => {

    const start =
        getStartDate(warranty);

    const expiry =
        getExpiryDate(warranty);


    if (
        !start ||
        !expiry
    ) {
        return null;
    }


    return getDaysDifference(
        start,
        expiry
    );
};


// ============================================================
// HUMAN READABLE DURATION
// ============================================================

export const formatWarrantyDuration = (
    warranty
) => {

    const days =
        getWarrantyDuration(
            warranty
        );


    if (
        days === null ||
        days < 0
    ) {
        return "—";
    }


    if (days === 0) {
        return "1 day";
    }


    if (days < 30) {
        return days === 1
            ? "1 day"
            : `${days} days`;
    }


    const months =
        Math.floor(
            days / 30
        );


    const remainingDays =
        days % 30;


    if (months < 12) {

        if (remainingDays === 0) {
            return months === 1
                ? "1 month"
                : `${months} months`;
        }


        return `${months}m ${remainingDays}d`;
    }


    const years =
        Math.floor(
            months / 12
        );

    const remainingMonths =
        months % 12;


    if (
        remainingMonths === 0 &&
        remainingDays === 0
    ) {
        return years === 1
            ? "1 year"
            : `${years} years`;
    }


    return `${years}y ${remainingMonths}m`;
};


// ============================================================
// VALID DATE RANGE
// ============================================================

export const isValidWarrantyDateRange = (
    startDate,
    expiryDate
) => {

    const start =
        parseWarrantyDate(
            startDate
        );

    const expiry =
        parseWarrantyDate(
            expiryDate
        );


    if (
        !start ||
        !expiry
    ) {
        return false;
    }


    return expiry >= start;
};


// ============================================================
// FORM DATA NORMALIZER
// ============================================================

export const normalizeWarrantyFormData = (
    data = {}
) => {

    return {
        title:
            firstValue(
                data.title,
                data.name
            ),

        provider:
            firstValue(
                data.provider,
                data.brand,
                data.company
            ),

        startDate:
            data.startDate || "",

        expiryDate:
            data.expiryDate || "",

        notes:
            data.notes || "",

        asset:
            data.asset?._id ||
            data.asset?.id ||
            data.asset ||
            null,
    };
};