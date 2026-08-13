import {
    Plus,
    ShieldCheck,
} from "lucide-react";


const WarrantyHeader = ({
    total = 0,
    onAdd,
}) => {

    return (
        <header
            className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >

            {/* ==================================================
                TITLE
            ================================================== */}

            <div
                className="
                    flex
                    min-w-0
                    items-start
                    gap-3
                "
            >

                {/* ICON */}

                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-indigo-50
                        text-[#5B4BFF]
                    "
                >

                    <ShieldCheck
                        size={21}
                        strokeWidth={2}
                    />

                </div>


                {/* TEXT */}

                <div className="min-w-0">

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-slate-950
                                sm:text-[1.65rem]
                            "
                        >
                            Warranties
                        </h1>


                        {/* COUNT */}

                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                text-slate-500
                            "
                        >
                            {total}{" "}
                            {total === 1
                                ? "warranty"
                                : "warranties"
                            }
                        </span>

                    </div>


                    <p
                        className="
                            mt-1
                            max-w-xl
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        Track product coverage, expiry dates,
                        and warranty details in one place.
                    </p>

                </div>

            </div>


            {/* ==================================================
                ACTION
            ================================================== */}

            <button
                type="button"
                onClick={onAdd}
                className="
                    inline-flex
                    h-11
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#5B4BFF]
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_12px_28px_rgba(91,75,255,0.18)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-indigo-600
                    hover:shadow-[0_16px_34px_rgba(91,75,255,0.22)]
                    focus:outline-none
                    focus:ring-4
                    focus:ring-indigo-100
                    active:translate-y-0
                    sm:w-auto
                "
            >

                <Plus
                    size={17}
                    strokeWidth={2.2}
                />

                Add warranty

            </button>

        </header>
    );
};


export default WarrantyHeader;