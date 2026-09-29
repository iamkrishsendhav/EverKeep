import {
    Users,
    UserPlus,
    ShieldCheck,
    Package,
    Bell,
    ArrowRight,
    Sparkles,
} from "lucide-react";

// ============================================================================
// EMPTY FAMILY STATE
// ============================================================================
//
// Premium onboarding state shown when the authenticated user does not yet
// have a Family workspace.
//
// Responsibilities:
// - Explain the value of Family
// - Create a clear visual hierarchy
// - Provide a single primary CTA
// - Remain responsive across mobile / tablet / desktop
//
// ============================================================================

const EmptyFamilyState = ({ onAddMember }) => {
    // =========================================================================
    // BENEFITS
    // =========================================================================

    const benefits = [
        {
            icon: Users,
            title: "One shared workspace",
            description:
                "Keep your family's important information organized in one place.",
        },

        {
            icon: ShieldCheck,
            title: "Controlled access",
            description: "Choose exactly what each family member can view or edit.",
        },

        {
            icon: Bell,
            title: "Stay ahead",
            description:
                "Keep everyone informed about important renewals and updates.",
        },
    ];

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-gray-200
                bg-white
                shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                dark:border-gray-800
                dark:bg-gray-900
            "
        >
            {/* ================================================================= */}
            {/* DECORATIVE BACKGROUND */}
            {/* ================================================================= */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        -right-24
                        -top-28
                        h-72
                        w-72
                        rounded-full
                        bg-gray-100
                        blur-3xl
                        dark:bg-gray-800/40
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-32
                        -left-24
                        h-64
                        w-64
                        rounded-full
                        bg-gray-100
                        blur-3xl
                        dark:bg-gray-800/30
                    "
                />
            </div>

            {/* ================================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================================= */}

            <div
                className="
                    relative
                    mx-auto
                    max-w-4xl
                    px-5
                    py-10
                    sm:px-8
                    sm:py-14
                    lg:px-12
                    lg:py-16
                "
            >
                {/* ============================================================= */}
                {/* HERO */}
                {/* ============================================================= */}

                <div className="text-center">
                    {/* ========================================================= */}
                    {/* ICON */}
                    {/* ========================================================= */}

                    <div className="relative mx-auto w-fit">
                        {/* Small floating accent */}

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                -right-3
                                -top-3
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-gray-200
                                bg-white
                                text-gray-500
                                shadow-sm
                                dark:border-gray-700
                                dark:bg-gray-900
                                dark:text-gray-400
                            "
                        >
                            <Sparkles size={12} />
                        </div>

                        {/* Main icon */}

                        <div
                            className="
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-[24px]
                                bg-gray-900
                                text-white
                                shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                                dark:bg-white
                                dark:text-gray-900
                            "
                        >
                            <Users size={34} strokeWidth={1.7} />
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* EYEBROW */}
                    {/* ========================================================= */}

                    <div
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-gray-200
                            bg-gray-50
                            px-3
                            py-1.5
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.1em]
                            text-gray-500
                            dark:border-gray-700
                            dark:bg-gray-800
                            dark:text-gray-400
                        "
                    >
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-500
                            "
                        />
                        Family workspace
                    </div>

                    {/* ========================================================= */}
                    {/* TITLE */}
                    {/* ========================================================= */}

                    <h1
                        className="
                            mx-auto
                            mt-4
                            max-w-2xl
                            text-2xl
                            font-semibold
                            tracking-[-0.025em]
                            text-gray-950
                            sm:text-3xl
                            lg:text-4xl
                            dark:text-white
                        "
                    >
                        Keep your family&apos;s
                        <br className="hidden sm:block" />
                        important things together.
                    </h1>

                    {/* ========================================================= */}
                    {/* DESCRIPTION */}
                    {/* ========================================================= */}

                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-xl
                            text-sm
                            leading-6
                            text-gray-500
                            sm:text-base
                            sm:leading-7
                            dark:text-gray-400
                        "
                    >
                        Create a private Family workspace in EverKeep to share assets,
                        warranties, subscriptions, documents, and important reminders with
                        the people who matter.
                    </p>

                    {/* ========================================================= */}
                    {/* CTA */}
                    {/* ========================================================= */}

                    <button
                        type="button"
                        onClick={onAddMember}
                        className="
                            group
                            mt-7
                            inline-flex
                            h-12
                            items-center
                            justify-center
                            gap-2.5
                            rounded-xl
                            bg-gray-900
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:bg-gray-800
                            hover:shadow-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-gray-900/20
                            active:scale-[0.98]
                            dark:bg-white
                            dark:text-gray-900
                            dark:hover:bg-gray-100
                        "
                    >
                        <UserPlus size={17} />
                        Create your family
                        <ArrowRight
                            size={16}
                            className="
                                opacity-60
                                transition-transform
                                duration-200
                                group-hover:translate-x-0.5
                            "
                        />
                    </button>

                    {/* ========================================================= */}
                    {/* TRUST NOTE */}
                    {/* ========================================================= */}

                    <p
                        className="
                            mt-3
                            text-[11px]
                            text-gray-400
                            dark:text-gray-500
                        "
                    >
                        Private to your family · Access is always controlled by you
                    </p>
                </div>

                {/* ============================================================= */}
                {/* BENEFITS */}
                {/* ============================================================= */}

                <div
                    className="
                        mt-12
                        grid
                        gap-3
                        border-t
                        border-gray-100
                        pt-8
                        sm:mt-14
                        sm:grid-cols-3
                        sm:gap-0
                        sm:divide-x
                        sm:divide-gray-100
                        sm:pt-10
                        dark:border-gray-800
                        dark:sm:divide-gray-800
                    "
                >
                    {benefits.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="
                                    group
                                    px-0
                                    py-4
                                    sm:px-6
                                    sm:py-2
                                    first:sm:pl-0
                                    last:sm:pr-0
                                "
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-gray-100
                                            text-gray-600
                                            transition-colors
                                            group-hover:bg-gray-900
                                            group-hover:text-white
                                            dark:bg-gray-800
                                            dark:text-gray-400
                                            dark:group-hover:bg-white
                                            dark:group-hover:text-gray-900
                                        "
                                >
                                    <Icon size={16} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <h3
                                        className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                                dark:text-gray-200
                                            "
                                    >
                                        {title}
                                    </h3>

                                    <p
                                        className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-gray-500
                                                dark:text-gray-500
                                            "
                                    >
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ============================================================= */}
                {/* VISUAL PREVIEW */}
                {/* ============================================================= */}

                <div
                    className="
                        relative
                        mx-auto
                        mt-10
                        max-w-2xl
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        p-3
                        dark:border-gray-800
                        dark:bg-gray-950
                    "
                >
                    {/* Window header */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            px-2
                            pb-3
                        "
                    >
                        <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />

                        <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />

                        <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                    </div>

                    {/* Preview */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            p-4
                            shadow-sm
                            dark:border-gray-800
                            dark:bg-gray-900
                        "
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-gray-900
                                        text-xs
                                        font-semibold
                                        text-white
                                        dark:bg-white
                                        dark:text-gray-900
                                    "
                                >
                                    F
                                </div>

                                <div className="text-left">
                                    <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />

                                    <div className="mt-2 h-2 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
                                </div>
                            </div>

                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="h-8 w-16 rounded-lg bg-gray-100 dark:bg-gray-800" />

                                <div className="h-8 w-20 rounded-lg bg-gray-900 dark:bg-white" />
                            </div>
                        </div>

                        {/* Preview member cards */}

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-gray-100
                                            bg-gray-50
                                            p-3
                                            dark:border-gray-800
                                            dark:bg-gray-800/50
                                        "
                                >
                                    <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-700" />

                                    <div className="flex-1">
                                        <div className="h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />

                                        <div className="mt-2 h-2 w-28 rounded-full bg-gray-100 dark:bg-gray-800" />
                                    </div>

                                    <div className="h-5 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmptyFamilyState;
