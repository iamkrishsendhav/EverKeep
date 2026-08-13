import {
    CalendarDays,
    Clock3,
    FileText,
    Pencil,
    ShieldCheck,
    Trash2,
    X,
} from "lucide-react";
import { useEffect } from "react";

import {
    formatWarrantyDate,
    formatWarrantyDuration,
    getAssetName,
    getProviderName,
    getWarrantyMeta,
    getWarrantyName,
    getWarrantyStatusStyles,
} from "./warrantyHelpers";


const DetailItem = ({
    label,
    value,
    icon: Icon,
    valueClassName = "",
}) => {

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50/70
                p-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                {Icon && (
                    <Icon
                        size={14}
                        className="text-slate-400"
                    />
                )}

                <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-slate-400
                    "
                >
                    {label}
                </p>

            </div>


            <p
                className={`
                    mt-2
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                    ${valueClassName}
                `}
                title={value}
            >
                {value || "—"}
            </p>

        </div>
    );
};


const WarrantyDetailsModal = ({
    warranty,
    onClose,
    onEdit,
    onDelete,
}) => {

    // ============================================================
    // ESCAPE KEY
    // ============================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {
                onClose();
            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [onClose]);


    // ============================================================
    // SAFETY
    // ============================================================

    if (!warranty) {
        return null;
    }


    // ============================================================
    // DATA
    // ============================================================

    const name =
        getWarrantyName(warranty);

    const provider =
        getProviderName(warranty);

    const assetName =
        getAssetName(warranty);

    const meta =
        getWarrantyMeta(warranty);

    const styles =
        getWarrantyStatusStyles(
            meta.status
        );

    const duration =
        formatWarrantyDuration(
            warranty
        );


    // ============================================================
    // ACTIONS
    // ============================================================

    const handleEdit = () => {

        if (onEdit) {
            onEdit(warranty);
        }

    };


    const handleDelete = () => {

        if (onDelete) {
            onDelete(warranty);
        }

    };


    return (
        <div
            className="
                fixed
                inset-0
                z-[55]
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
                backdrop-blur-sm
            "
            onMouseDown={onClose}
        >

            {/* ==================================================
                MODAL
            ================================================== */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="warranty-details-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className="
                    flex
                    w-full
                    max-w-3xl
                    max-h-[92vh]
                    flex-col
                    overflow-hidden
                    rounded-[1.8rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.28)]
                "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200/80
                        px-6
                        py-5
                    "
                >

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
                            className={`
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                ${styles.icon}
                            `}
                        >

                            <ShieldCheck
                                size={23}
                                strokeWidth={2}
                            />

                        </div>


                        {/* TITLE */}

                        <div className="min-w-0">

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >

                                <h2
                                    id="warranty-details-title"
                                    className="
                                        truncate
                                        text-xl
                                        font-bold
                                        tracking-tight
                                        text-slate-950
                                    "
                                >
                                    {name}
                                </h2>


                                {/* STATUS */}

                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-bold
                                        ${styles.badge}
                                    `}
                                >

                                    <span
                                        className={`
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            ${styles.dot}
                                        `}
                                    />

                                    {meta.status}

                                </span>

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                {provider}
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close warranty details"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-800
                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-50
                        "
                    >
                        <X size={17} />
                    </button>

                </header>


                {/* ==================================================
                    BODY
                ================================================== */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-6
                        py-6
                    "
                >

                    {/* ==================================================
                        STATUS SUMMARY
                    ================================================== */}

                    <div
                        className={`
                            rounded-[1.4rem]
                            border
                            p-5
                            ${styles.badge}
                        `}
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.17em]
                                        opacity-70
                                    "
                                >
                                    Warranty status
                                </p>

                                <p
                                    className="
                                        mt-1.5
                                        text-lg
                                        font-bold
                                    "
                                >
                                    {meta.label}
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-white/70
                                "
                            >

                                <Clock3 size={21} />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        DETAILS
                    ================================================== */}

                    <div className="mt-5">

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <FileText
                                size={15}
                                className="text-slate-400"
                            />

                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Warranty details
                            </h3>

                        </div>


                        <div
                            className="
                                mt-3
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            <DetailItem
                                label="Provider"
                                value={provider}
                            />

                            <DetailItem
                                label="Linked Asset"
                                value={assetName}
                            />

                            <DetailItem
                                label="Start Date"
                                value={formatWarrantyDate(
                                    warranty.startDate
                                )}
                                icon={CalendarDays}
                            />

                            <DetailItem
                                label="Expiry Date"
                                value={formatWarrantyDate(
                                    warranty.expiryDate
                                )}
                                icon={CalendarDays}
                                valueClassName={
                                    meta.status === "Expired"
                                        ? "text-rose-600"
                                        : meta.status === "Expiring Soon"
                                            ? "text-amber-600"
                                            : ""
                                }
                            />

                            <DetailItem
                                label="Coverage Period"
                                value={duration}
                            />

                            <DetailItem
                                label="Time Remaining"
                                value={meta.label}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        NOTES
                    ================================================== */}

                    {warranty.notes && (

                        <div className="mt-5">

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <FileText
                                    size={15}
                                    className="text-slate-400"
                                />

                                <h3
                                    className="
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Notes
                                </h3>

                            </div>


                            <div
                                className="
                                    mt-3
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50/70
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    "
                                >
                                    {warranty.notes}
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer
                    className="
                        flex
                        shrink-0
                        flex-col-reverse
                        gap-2
                        border-t
                        border-slate-200/80
                        bg-slate-50/50
                        px-6
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* DELETE */}

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-4
                            text-sm
                            font-semibold
                            text-rose-600
                            transition
                            hover:bg-rose-50
                            focus:outline-none
                            focus:ring-4
                            focus:ring-rose-50
                        "
                    >

                        <Trash2 size={15} />

                        Delete

                    </button>


                    {/* RIGHT */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                text-sm
                                font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                                hover:border-slate-300
                            "
                        >
                            Close
                        </button>


                        <button
                            type="button"
                            onClick={handleEdit}
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#5B4BFF]
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-[0_10px_25px_rgba(91,75,255,0.18)]
                                transition
                                hover:bg-indigo-600
                                focus:outline-none
                                focus:ring-4
                                focus:ring-indigo-100
                            "
                        >

                            <Pencil size={15} />

                            Edit warranty

                        </button>

                    </div>

                </footer>

            </div>

        </div>
    );
};


export default WarrantyDetailsModal;