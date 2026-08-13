// ============================================================================
// EVERKEEP — CALENDAR HELPERS
// ============================================================================
//
// Pure utility functions for the Calendar module.
//
// Responsibilities:
// - Date normalization
// - Calendar month calculations
// - Calendar grid generation
// - Event status calculation
// - Event grouping
// - Event sorting
// - Event metadata
// - Upcoming / overdue calculations
// - Form defaults
//
// IMPORTANT:
// This file contains:
// - NO React code
// - NO API calls
// - NO component exports
//
// All exports are named exports.
// ============================================================================


// ============================================================================
// CONSTANTS
// ============================================================================

export const CALENDAR_EVENT_TYPES = [
    "warranty",
    "insurance",
    "subscription",
    "payment",
    "maintenance",
    "custom",
];


export const CALENDAR_PRIORITIES = [
    "low",
    "medium",
    "high",
];


export const CALENDAR_STATUSES = [
    "upcoming",
    "completed",
    "cancelled",
];


export const CALENDAR_VIEWS = [
    "month",
    "agenda",
];


// ============================================================================
// EVENT ID
// ============================================================================

export const getEventId = (event) => {
    return (
        event?._id ||
        event?.id ||
        null
    );
};


// ============================================================================
// DATE NORMALIZATION
// ============================================================================

/**
 * Safely convert a value into a Date.
 *
 * Returns null when the value cannot be converted into a valid date.
 */
export const toDate = (value) => {

    if (!value) {
        return null;
    }


    const date =
        value instanceof Date
            ? new Date(value.getTime())
            : new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }


    return date;
};


// ============================================================================
// DATE VALIDATION
// ============================================================================

export const isValidDate = (value) => {
    return Boolean(
        toDate(value)
    );
};


// ============================================================================
// START / END OF DAY
// ============================================================================

export const startOfDay = (value) => {

    const date =
        toDate(value);


    if (!date) {
        return null;
    }


    date.setHours(
        0,
        0,
        0,
        0
    );


    return date;
};


export const endOfDay = (value) => {

    const date =
        toDate(value);


    if (!date) {
        return null;
    }


    date.setHours(
        23,
        59,
        59,
        999
    );


    return date;
};


// ============================================================================
// START / END OF WEEK
// ============================================================================

/**
 * Sunday is considered the first day of the week.
 */
export const startOfWeek = (value) => {

    const date =
        startOfDay(value);


    if (!date) {
        return null;
    }


    const day =
        date.getDay();


    date.setDate(
        date.getDate() - day
    );


    return date;
};


export const endOfWeek = (value) => {

    const date =
        startOfWeek(value);


    if (!date) {
        return null;
    }


    date.setDate(
        date.getDate() + 6
    );


    return endOfDay(date);
};


// ============================================================================
// START / END OF MONTH
// ============================================================================

export const startOfMonth = (
    value = new Date()
) => {

    const date =
        toDate(value) ||
        new Date();


    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );
};


export const endOfMonth = (
    value = new Date()
) => {

    const date =
        toDate(value) ||
        new Date();


    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    );
};


// ============================================================================
// MONTH NAVIGATION
// ============================================================================

export const addMonth = (
    value
) => {

    const date =
        startOfMonth(value);


    date.setMonth(
        date.getMonth() + 1
    );


    return date;
};


export const subtractMonth = (
    value
) => {

    const date =
        startOfMonth(value);


    date.setMonth(
        date.getMonth() - 1
    );


    return date;
};


// ============================================================================
// YEAR NAVIGATION
// ============================================================================

export const addYear = (
    value
) => {

    const date =
        toDate(value) ||
        new Date();


    date.setFullYear(
        date.getFullYear() + 1
    );


    return date;
};


export const subtractYear = (
    value
) => {

    const date =
        toDate(value) ||
        new Date();


    date.setFullYear(
        date.getFullYear() - 1
    );


    return date;
};


// ============================================================================
// SAME DAY
// ============================================================================

export const isSameDay = (
    first,
    second
) => {

    const firstDate =
        toDate(first);

    const secondDate =
        toDate(second);


    if (
        !firstDate ||
        !secondDate
    ) {
        return false;
    }


    return (
        firstDate.getFullYear() ===
            secondDate.getFullYear() &&

        firstDate.getMonth() ===
            secondDate.getMonth() &&

        firstDate.getDate() ===
            secondDate.getDate()
    );
};


// ============================================================================
// TODAY / PAST / FUTURE
// ============================================================================

export const isToday = (
    value
) => {

    return isSameDay(
        value,
        new Date()
    );
};


export const isBeforeToday = (
    value
) => {

    const date =
        startOfDay(value);

    const today =
        startOfDay(new Date());


    if (
        !date ||
        !today
    ) {
        return false;
    }


    return date < today;
};


export const isAfterToday = (
    value
) => {

    const date =
        startOfDay(value);

    const today =
        startOfDay(new Date());


    if (
        !date ||
        !today
    ) {
        return false;
    }


    return date > today;
};


// ============================================================================
// DATE DIFFERENCE
// ============================================================================

/**
 * Returns difference in calendar days.
 *
 * Example:
 * Tomorrow → 1
 * Today → 0
 * Yesterday → -1
 */
export const getDaysDifference = (
    targetDate,
    fromDate = new Date()
) => {

    const target =
        startOfDay(targetDate);

    const from =
        startOfDay(fromDate);


    if (
        !target ||
        !from
    ) {
        return null;
    }


    const difference =
        target.getTime() -
        from.getTime();


    return Math.round(
        difference /
        (1000 * 60 * 60 * 24)
    );
};


// ============================================================================
// DATE FORMATTING
// ============================================================================

export const formatCalendarDate = (
    value,
    options = {}
) => {

    const date =
        toDate(value);


    if (!date) {
        return "—";
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            ...options,
        }
    ).format(date);
};


export const formatMonthTitle = (
    value
) => {

    const date =
        toDate(value);


    if (!date) {
        return "—";
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            month: "long",
            year: "numeric",
        }
    ).format(date);
};


export const formatWeekday = (
    value
) => {

    const date =
        toDate(value);


    if (!date) {
        return "";
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            weekday: "short",
        }
    ).format(date);
};


export const formatEventTime = (
    value
) => {

    const date =
        toDate(value);


    if (!date) {
        return "";
    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }
    ).format(date);
};


// ============================================================================
// DATE INPUT FORMATTING
// ============================================================================

/**
 * Converts Date → YYYY-MM-DD.
 *
 * Useful for <input type="date" />.
 */
export const formatDateInput = (
    value
) => {

    const date =
        toDate(value);


    if (!date) {
        return "";
    }


    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
};


/**
 * Converts Date → YYYY-MM-DDTHH:mm.
 *
 * Useful for <input type="datetime-local" />.
 */
export const formatDateTimeInput = (
    value
) => {

    const date =
        toDate(value);


    if (!date) {
        return "";
    }


    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    const hours =
        String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );

    const minutes =
        String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}` +
        `T${hours}:${minutes}`
    );
};


// ============================================================================
// CALENDAR GRID
// ============================================================================

/**
 * Generates a complete Sunday → Saturday calendar grid.
 *
 * Usually returns 35 or 42 days depending on the month.
 */
export const getCalendarDays = (
    monthDate
) => {

    const month =
        startOfMonth(
            monthDate
        );


    const firstDay =
        month.getDay();


    const lastDate =
        new Date(
            month.getFullYear(),
            month.getMonth() + 1,
            0
        ).getDate();


    const previousMonthLastDate =
        new Date(
            month.getFullYear(),
            month.getMonth(),
            0
        ).getDate();


    const days = [];


    // ------------------------------------------------------------------------
    // PREVIOUS MONTH
    // ------------------------------------------------------------------------

    for (
        let index = firstDay - 1;
        index >= 0;
        index--
    ) {

        days.push(
            new Date(
                month.getFullYear(),
                month.getMonth() - 1,
                previousMonthLastDate - index
            )
        );
    }


    // ------------------------------------------------------------------------
    // CURRENT MONTH
    // ------------------------------------------------------------------------

    for (
        let day = 1;
        day <= lastDate;
        day++
    ) {

        days.push(
            new Date(
                month.getFullYear(),
                month.getMonth(),
                day
            )
        );
    }


    // ------------------------------------------------------------------------
    // NEXT MONTH
    // ------------------------------------------------------------------------

    const remaining =
        days.length % 7 === 0
            ? 0
            : 7 - (
                days.length % 7
            );


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        days.push(
            new Date(
                month.getFullYear(),
                month.getMonth() + 1,
                day
            )
        );
    }


    return days;
};


// ============================================================================
// CURRENT MONTH
// ============================================================================

export const isCurrentMonth = (
    day,
    monthDate
) => {

    const date =
        toDate(day);

    const month =
        toDate(monthDate);


    if (
        !date ||
        !month
    ) {
        return false;
    }


    return (
        date.getFullYear() ===
            month.getFullYear() &&

        date.getMonth() ===
            month.getMonth()
    );
};


// ============================================================================
// EVENT STATUS
// ============================================================================

/**
 * Calculates real-time display status.
 *
 * Database status:
 * - upcoming
 * - completed
 * - cancelled
 *
 * Calculated status:
 * - completed
 * - cancelled
 * - overdue
 * - today
 * - upcoming
 */
export const getEventStatus = (
    event,
    referenceDate = new Date()
) => {

    if (!event) {
        return "upcoming";
    }


    if (
        event.status ===
        "completed"
    ) {
        return "completed";
    }


    if (
        event.status ===
        "cancelled"
    ) {
        return "cancelled";
    }


    const eventDate =
        toDate(
            event.endDate ||
            event.startDate
        );


    if (!eventDate) {
        return "upcoming";
    }


    const today =
        startOfDay(
            referenceDate
        );

    const target =
        startOfDay(
            eventDate
        );


    if (
        !today ||
        !target
    ) {
        return "upcoming";
    }


    if (
        target < today
    ) {
        return "overdue";
    }


    if (
        isSameDay(
            target,
            today
        )
    ) {
        return "today";
    }


    return "upcoming";
};


// ============================================================================
// EVENT TYPE LABEL
// ============================================================================

export const getEventTypeLabel = (
    type
) => {

    const labels = {

        warranty:
            "Warranty",

        insurance:
            "Insurance",

        subscription:
            "Subscription",

        payment:
            "Payment",

        maintenance:
            "Maintenance",

        custom:
            "Custom",
    };


    return (
        labels[type] ||
        "Event"
    );
};


// ============================================================================
// EVENT TYPE METADATA
// ============================================================================

export const getEventTypeMeta = (
    type
) => {

    const metadata = {

        warranty: {
            label: "Warranty",
            icon: "shield",
            className:
                "bg-indigo-50 text-indigo-600",
        },

        insurance: {
            label: "Insurance",
            icon: "shield-check",
            className:
                "bg-emerald-50 text-emerald-600",
        },

        subscription: {
            label: "Subscription",
            icon: "repeat",
            className:
                "bg-violet-50 text-violet-600",
        },

        payment: {
            label: "Payment",
            icon: "credit-card",
            className:
                "bg-amber-50 text-amber-600",
        },

        maintenance: {
            label: "Maintenance",
            icon: "wrench",
            className:
                "bg-orange-50 text-orange-600",
        },

        custom: {
            label: "Custom",
            icon: "calendar",
            className:
                "bg-slate-100 text-slate-600",
        },
    };


    return (
        metadata[type] ||
        metadata.custom
    );
};


// ============================================================================
// PRIORITY METADATA
// ============================================================================

export const getPriorityMeta = (
    priority
) => {

    const metadata = {

        low: {
            label: "Low",
            className:
                "text-slate-500",
        },

        medium: {
            label: "Medium",
            className:
                "text-amber-600",
        },

        high: {
            label: "High",
            className:
                "text-rose-600",
        },
    };


    return (
        metadata[priority] ||
        metadata.medium
    );
};


// ============================================================================
// STATUS METADATA
// ============================================================================

export const getEventStatusMeta = (
    status
) => {

    const metadata = {

        completed: {
            label: "Completed",
            className:
                "bg-emerald-50 text-emerald-700",
        },

        cancelled: {
            label: "Cancelled",
            className:
                "bg-slate-100 text-slate-600",
        },

        overdue: {
            label: "Overdue",
            className:
                "bg-rose-50 text-rose-700",
        },

        today: {
            label: "Today",
            className:
                "bg-amber-50 text-amber-700",
        },

        upcoming: {
            label: "Upcoming",
            className:
                "bg-indigo-50 text-indigo-700",
        },
    };


    return (
        metadata[status] ||
        metadata.upcoming
    );
};


// ============================================================================
// EVENT TITLE
// ============================================================================

export const getEventTitle = (
    event
) => {

    return (
        event?.title ||
        "Untitled event"
    );
};


// ============================================================================
// EVENT DESCRIPTION
// ============================================================================

export const getEventDescription = (
    event
) => {

    return (
        event?.description ||
        event?.notes ||
        ""
    );
};


// ============================================================================
// LINKED ASSET NAME
// ============================================================================

export const getEventAssetName = (
    event
) => {

    return (
        event?.asset?.name ||
        event?.asset?.title ||
        event?.assetName ||
        "No asset linked"
    );
};


// ============================================================================
// EVENT DATE RANGE
// ============================================================================

export const getEventDateRange = (
    event
) => {

    if (!event) {
        return {
            start: null,
            end: null,
        };
    }


    const start =
        toDate(
            event.startDate
        );

    const end =
        toDate(
            event.endDate ||
            event.startDate
        );


    return {
        start,
        end,
    };
};


// ============================================================================
// EVENT BELONGS TO DAY
// ============================================================================

/**
 * Supports both:
 *
 * Single-day event:
 * startDate === endDate
 *
 * Multi-day event:
 * startDate → endDate
 */
export const eventBelongsToDay = (
    event,
    day
) => {

    if (
        !event ||
        !day
    ) {
        return false;
    }


    const currentDay =
        startOfDay(day);


    const eventStart =
        startOfDay(
            event.startDate
        );


    const eventEnd =
        endOfDay(
            event.endDate ||
            event.startDate
        );


    if (
        !currentDay ||
        !eventStart ||
        !eventEnd
    ) {
        return false;
    }


    return (
        currentDay >= eventStart &&
        currentDay <= eventEnd
    );
};


// ============================================================================
// GROUP EVENTS BY DAY
// ============================================================================

export const getDateKey = (
    value
) => {

    const date =
        toDate(value);


    if (!date) {
        return null;
    }


    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );
};


export const groupEventsByDay = (
    events = []
) => {

    const grouped = {};


    if (
        !Array.isArray(events)
    ) {
        return grouped;
    }


    events.forEach(
        (event) => {

            const dateKey =
                getDateKey(
                    event?.startDate
                );


            if (!dateKey) {
                return;
            }


            if (
                !grouped[dateKey]
            ) {
                grouped[dateKey] = [];
            }


            grouped[dateKey].push(
                event
            );
        }
    );


    return grouped;
};


// ============================================================================
// GET EVENTS FOR DAY
// ============================================================================

export const getEventsForDay = (
    events = [],
    day
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return events.filter(
        (event) =>
            eventBelongsToDay(
                event,
                day
            )
    );
};


// ============================================================================
// SORT EVENTS
// ============================================================================

export const sortEventsByDate = (
    events = [],
    direction = "asc"
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    const multiplier =
        direction === "desc"
            ? -1
            : 1;


    return [...events].sort(
        (
            first,
            second
        ) => {

            const firstDate =
                toDate(
                    first?.startDate
                );

            const secondDate =
                toDate(
                    second?.startDate
                );


            if (
                !firstDate &&
                !secondDate
            ) {
                return 0;
            }


            if (!firstDate) {
                return 1;
            }


            if (!secondDate) {
                return -1;
            }


            return (
                (
                    firstDate.getTime() -
                    secondDate.getTime()
                ) *
                multiplier
            );
        }
    );
};


// ============================================================================
// UPCOMING EVENTS
// ============================================================================

export const getUpcomingEvents = (
    events = [],
    limit = 5
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    const today =
        startOfDay(
            new Date()
        );


    const upcoming =
        events.filter(
            (event) => {

                if (
                    event?.status ===
                        "completed" ||
                    event?.status ===
                        "cancelled"
                ) {
                    return false;
                }


                const date =
                    startOfDay(
                        event?.startDate
                    );


                return Boolean(
                    date &&
                    date >= today
                );
            }
        );


    return sortEventsByDate(
        upcoming
    ).slice(
        0,
        Math.max(
            0,
            limit
        )
    );
};


// ============================================================================
// OVERDUE EVENTS
// ============================================================================

export const getOverdueEvents = (
    events = []
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return sortEventsByDate(
        events.filter(
            (event) =>
                getEventStatus(
                    event
                ) === "overdue"
        )
    );
};


// ============================================================================
// COMPLETED EVENTS
// ============================================================================

export const getCompletedEvents = (
    events = []
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return events.filter(
        (event) =>
            event?.status ===
            "completed"
    );
};


// ============================================================================
// CANCELLED EVENTS
// ============================================================================

export const getCancelledEvents = (
    events = []
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return events.filter(
        (event) =>
            event?.status ===
            "cancelled"
    );
};


// ============================================================================
// TODAY EVENTS
// ============================================================================

export const getTodayEvents = (
    events = []
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return sortEventsByDate(
        events.filter(
            (event) =>
                getEventStatus(
                    event
                ) === "today"
        )
    );
};


// ============================================================================
// MONTH RANGE
// ============================================================================

export const getMonthRange = (
    monthDate
) => {

    const start =
        startOfMonth(
            monthDate
        );

    const end =
        endOfMonth(
            monthDate
        );


    return {
        start:
            start?.toISOString() ||
            null,

        end:
            end?.toISOString() ||
            null,
    };
};


// ============================================================================
// MONTH EVENT FILTER
// ============================================================================

export const getEventsForMonth = (
    events = [],
    monthDate
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    const month =
        toDate(
            monthDate
        );


    if (!month) {
        return [];
    }


    const monthStart =
        startOfMonth(
            month
        );

    const monthEnd =
        endOfMonth(
            month
        );


    return events.filter(
        (event) => {

            const start =
                toDate(
                    event?.startDate
                );

            const end =
                toDate(
                    event?.endDate ||
                    event?.startDate
                );


            if (
                !start &&
                !end
            ) {
                return false;
            }


            const eventStart =
                start ||
                end;

            const eventEnd =
                end ||
                start;


            return (
                eventStart <=
                    monthEnd &&
                eventEnd >=
                    monthStart
            );
        }
    );
};


// ============================================================================
// EVENT COUNTS
// ============================================================================

export const getEventCounts = (
    events = []
) => {

    if (
        !Array.isArray(events)
    ) {
        return {
            total: 0,
            upcoming: 0,
            today: 0,
            overdue: 0,
            completed: 0,
            cancelled: 0,
        };
    }


    const counts = {
        total: events.length,
        upcoming: 0,
        today: 0,
        overdue: 0,
        completed: 0,
        cancelled: 0,
    };


    events.forEach(
        (event) => {

            const status =
                getEventStatus(
                    event
                );


            if (
                Object.prototype.hasOwnProperty.call(
                    counts,
                    status
                )
            ) {
                counts[status] += 1;
            }
        }
    );


    return counts;
};


// ============================================================================
// EVENT TYPE COUNTS
// ============================================================================

export const getEventTypeCounts = (
    events = []
) => {

    const counts = {};


    if (
        !Array.isArray(events)
    ) {
        return counts;
    }


    events.forEach(
        (event) => {

            const type =
                event?.type ||
                "custom";


            counts[type] =
                (
                    counts[type] ||
                    0
                ) + 1;
        }
    );


    return counts;
};


// ============================================================================
// DEFAULT EVENT DATA
// ============================================================================

export const getDefaultEventData = (
    selectedDate = null
) => {

    const date =
        toDate(
            selectedDate
        ) || new Date();


    const start =
        new Date(
            date
        );


    const end =
        new Date(
            date
        );


    // Keep default event on the selected day.
    start.setHours(
        9,
        0,
        0,
        0
    );


    end.setHours(
        10,
        0,
        0,
        0
    );


    return {

        title: "",

        description: "",

        type: "custom",

        startDate:
            start.toISOString(),

        endDate:
            end.toISOString(),

        allDay: true,

        priority: "medium",

        status: "upcoming",

        asset: null,

        reminder: {
            enabled: false,
            minutesBefore: 1440,
        },

        location: "",

        notes: "",
    };
};


// ============================================================================
// NORMALIZE EVENT
// ============================================================================
//
// Makes backend data safer for UI components.
// Does NOT mutate the original object.
// ============================================================================

export const normalizeEvent = (
    event
) => {

    if (!event) {
        return null;
    }


    return {

        ...event,

        id:
            getEventId(event),

        title:
            getEventTitle(event),

        type:
            event.type ||
            "custom",

        priority:
            event.priority ||
            "medium",

        status:
            event.status ||
            "upcoming",

        startDate:
            event.startDate ||
            null,

        endDate:
            event.endDate ||
            event.startDate ||
            null,

        description:
            event.description ||
            "",

        notes:
            event.notes ||
            "",

        asset:
            event.asset ||
            null,
    };
};


// ============================================================================
// NORMALIZE EVENTS
// ============================================================================

export const normalizeEvents = (
    events = []
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return events
        .map(
            normalizeEvent
        )
        .filter(
            Boolean
        );
};


// ============================================================================
// FILTER EVENTS
// ============================================================================

export const filterEvents = (
    events = [],
    filters = {}
) => {

    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    const {
        type = "all",
        status = "all",
        priority = "all",
        search = "",
    } = filters;


    const searchTerm =
        String(
            search
        )
            .trim()
            .toLowerCase();


    return events.filter(
        (event) => {

            // ---------------------------------------------------------------
            // TYPE
            // ---------------------------------------------------------------

            if (
                type !== "all" &&
                event?.type !== type
            ) {
                return false;
            }


            // ---------------------------------------------------------------
            // PRIORITY
            // ---------------------------------------------------------------

            if (
                priority !== "all" &&
                event?.priority !== priority
            ) {
                return false;
            }


            // ---------------------------------------------------------------
            // STATUS
            // ---------------------------------------------------------------

            if (
                status !== "all"
            ) {

                const calculatedStatus =
                    getEventStatus(
                        event
                    );


                if (
                    calculatedStatus !==
                    status
                ) {
                    return false;
                }
            }


            // ---------------------------------------------------------------
            // SEARCH
            // ---------------------------------------------------------------

            if (
                searchTerm
            ) {

                const searchableText =
                    [
                        event?.title,
                        event?.description,
                        event?.notes,
                        event?.location,
                        event?.type,
                        getEventAssetName(
                            event
                        ),
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                if (
                    !searchableText.includes(
                        searchTerm
                    )
                ) {
                    return false;
                }
            }


            return true;
        }
    );
};


// ============================================================================
// EVENT DATE VALIDATION
// ============================================================================

export const validateEventDates = (
    startDate,
    endDate
) => {

    const start =
        toDate(
            startDate
        );

    const end =
        toDate(
            endDate
        );


    if (!start) {

        return {
            valid: false,
            message:
                "Start date is required.",
        };
    }


    if (
        end &&
        end < start
    ) {

        return {
            valid: false,
            message:
                "End date cannot be earlier than start date.",
        };
    }


    return {
        valid: true,
        message: "",
    };
};


// ============================================================================
// EVENT DATE RANGE LABEL
// ============================================================================

export const formatEventDateRange = (
    event
) => {

    if (!event) {
        return "—";
    }


    const start =
        toDate(
            event.startDate
        );

    const end =
        toDate(
            event.endDate
        );


    if (!start) {
        return "—";
    }


    if (
        !end ||
        isSameDay(
            start,
            end
        )
    ) {

        return formatCalendarDate(
            start
        );
    }


    return (
        `${formatCalendarDate(start)}`
        +
        " – "
        +
        `${formatCalendarDate(end)}`
    );
};


// ============================================================================
// REMINDER LABEL
// ============================================================================

export const getReminderLabel = (
    reminder
) => {

    if (
        !reminder?.enabled
    ) {
        return "No reminder";
    }


    const minutes =
        Number(
            reminder.minutesBefore
        );


    if (
        !Number.isFinite(
            minutes
        )
    ) {
        return "Reminder enabled";
    }


    if (
        minutes < 60
    ) {

        return (
            `Remind ${minutes} `
            +
            `${minutes === 1 ? "minute" : "minutes"} before`
        );
    }


    if (
        minutes < 1440
    ) {

        const hours =
            Math.round(
                minutes / 60
            );


        return (
            `Remind ${hours} `
            +
            `${hours === 1 ? "hour" : "hours"} before`
        );
    }


    const days =
        Math.round(
            minutes / 1440
        );


    return (
        `Remind ${days} `
        +
        `${days === 1 ? "day" : "days"} before`
    );
};


// ============================================================================
// WEEKDAY LABELS
// ============================================================================

export const CALENDAR_WEEKDAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];


export const getWeekdayLabels = () => {
    return [
        ...CALENDAR_WEEKDAYS,
    ];
};


// ============================================================================
// MONTH LABELS
// ============================================================================

export const getMonthLabels = () => {

    return Array.from(
        {
            length: 12,
        },
        (_, index) => {

            return new Intl.DateTimeFormat(
                "en-IN",
                {
                    month: "long",
                }
            ).format(
                new Date(
                    2026,
                    index,
                    1
                )
            );
        }
    );
};


// ============================================================================
// SAFE EVENT COMPARISON
// ============================================================================

export const isSameEvent = (
    first,
    second
) => {

    const firstId =
        getEventId(first);

    const secondId =
        getEventId(second);


    if (
        !firstId ||
        !secondId
    ) {
        return false;
    }


    return (
        String(firstId) ===
        String(secondId)
    );
};


// ============================================================================
// EVENT SORT — PRIORITY
// ============================================================================

export const sortEventsByPriority = (
    events = []
) => {

    const priorityRank = {
        high: 1,
        medium: 2,
        low: 3,
    };


    if (
        !Array.isArray(events)
    ) {
        return [];
    }


    return [...events].sort(
        (
            first,
            second
        ) => {

            const firstRank =
                priorityRank[
                    first?.priority
                ] || 99;

            const secondRank =
                priorityRank[
                    second?.priority
                ] || 99;


            return (
                firstRank -
                secondRank
            );
        }
    );
};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================
//
// DO NOT add:
//
// export default EventForm;
//
// This is a pure helper module.
// ============================================================================

// No default export.