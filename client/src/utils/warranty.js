// ============================================================
// EverKeep - Warranty Utilities
// ============================================================

const DAY_MS = 24 * 60 * 60 * 1000;

export const EXPIRING_SOON_DAYS = 30;


// ============================================================
// DATE HELPERS
// ============================================================

const normalizeDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
};


export const getToday = () => {
    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
};


const differenceInDays = (from, to) => {
    return Math.round(
        (to.getTime() - from.getTime()) / DAY_MS
    );
};


// ============================================================
// WARRANTY CALCULATION
// ============================================================

export const getWarrantyMeta = (warranty) => {

    const today = getToday();

    const startDate = normalizeDate(
        warranty?.startDate
    );

    const expiryDate = normalizeDate(
        warranty?.expiryDate
    );


    // --------------------------------------------------------
    // Missing / invalid dates
    // --------------------------------------------------------

    if (!startDate || !expiryDate) {

        return {
            status: "Unknown",
            daysRemaining: null,
            daysUntilStart: null,
            daysExpired: null,

            isUpcoming: false,
            isActive: false,
            isExpiringSoon: false,
            isExpired: false,
            isInvalid: false,
        };
    }


    // --------------------------------------------------------
    // Invalid date range
    // --------------------------------------------------------

    if (expiryDate < startDate) {

        return {
            status: "Invalid",
            daysRemaining: null,
            daysUntilStart: null,
            daysExpired: null,

            isUpcoming: false,
            isActive: false,
            isExpiringSoon: false,
            isExpired: false,
            isInvalid: true,
        };
    }


    // --------------------------------------------------------
    // UPCOMING
    // Warranty has not started yet
    // --------------------------------------------------------

    if (today < startDate) {

        const daysUntilStart =
            differenceInDays(
                today,
                startDate
            );

        return {
            status: "Upcoming",

            daysRemaining: null,

            daysUntilStart,

            daysExpired: null,

            isUpcoming: true,
            isActive: false,
            isExpiringSoon: false,
            isExpired: false,
            isInvalid: false,
        };
    }


    // --------------------------------------------------------
    // EXPIRED
    // Warranty expiry date has passed
    // --------------------------------------------------------

    if (today > expiryDate) {

        const daysExpired =
            differenceInDays(
                expiryDate,
                today
            );

        return {
            status: "Expired",

            daysRemaining: 0,

            daysUntilStart: 0,

            daysExpired,

            isUpcoming: false,
            isActive: false,
            isExpiringSoon: false,
            isExpired: true,
            isInvalid: false,
        };
    }


    // --------------------------------------------------------
    // ACTIVE / EXPIRING SOON
    // Warranty is currently running
    // --------------------------------------------------------

    const daysRemaining =
        differenceInDays(
            today,
            expiryDate
        );


    // --------------------------------------------------------
    // EXPIRING SOON
    // --------------------------------------------------------

    if (
        daysRemaining <= EXPIRING_SOON_DAYS
    ) {

        return {
            status: "Expiring Soon",

            daysRemaining,

            daysUntilStart: 0,

            daysExpired: null,

            isUpcoming: false,
            isActive: false,
            isExpiringSoon: true,
            isExpired: false,
            isInvalid: false,
        };
    }


    // --------------------------------------------------------
    // ACTIVE
    // --------------------------------------------------------

    return {
        status: "Active",

        daysRemaining,

        daysUntilStart: 0,

        daysExpired: null,

        isUpcoming: false,
        isActive: true,
        isExpiringSoon: false,
        isExpired: false,
        isInvalid: false,
    };
};


// ============================================================
// SIMPLE STATUS
// ============================================================

export const getWarrantyStatus = (warranty) => {
    return getWarrantyMeta(warranty).status;
};


// ============================================================
// STATISTICS
// ============================================================

export const calculateWarrantyStats = (
    warranties = []
) => {

    const stats = {
        total: warranties.length,
        active: 0,
        upcoming: 0,
        expiringSoon: 0,
        expired: 0,
        unknown: 0,
        invalid: 0,
    };


    warranties.forEach((warranty) => {

        const status =
            getWarrantyStatus(warranty);


        switch (status) {

            case "Active":
                stats.active++;
                break;

            case "Upcoming":
                stats.upcoming++;
                break;

            case "Expiring Soon":
                stats.expiringSoon++;
                break;

            case "Expired":
                stats.expired++;
                break;

            case "Invalid":
                stats.invalid++;
                break;

            default:
                stats.unknown++;
        }
    });


    return stats;
};


// ============================================================
// DATE FORMATTER
// ============================================================

export const formatWarrantyDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};


// ============================================================
// HUMAN READABLE REMAINING TEXT
// ============================================================

export const getWarrantyTimeLabel = (warranty) => {

    const meta =
        getWarrantyMeta(warranty);


    switch (meta.status) {

        case "Upcoming":
            return meta.daysUntilStart === 0
                ? "Starts today"
                : `${meta.daysUntilStart} days until start`;


        case "Active":
            return meta.daysRemaining === 0
                ? "Expires today"
                : `${meta.daysRemaining} days remaining`;


        case "Expiring Soon":
            return meta.daysRemaining === 0
                ? "Expires today"
                : `${meta.daysRemaining} days remaining`;


        case "Expired":
            return meta.daysExpired === 1
                ? "Expired 1 day ago"
                : `Expired ${meta.daysExpired} days ago`;


        case "Invalid":
            return "Invalid date range";


        default:
            return "Date unavailable";
    }
};