import {
    CalendarDays,
    Clock3,
    Eye,
    MoreVertical,
    Pencil,
    ShieldCheck,
    Trash2,
} from "lucide-react";

import {
    formatWarrantyDate,
    getAssetName,
    getProviderName,
    getWarrantyMeta,
    getWarrantyName,
    getWarrantyStatusStyles,
} from "./warrantyHelpers";

//import { getWarrantyMeta } from "../../utils/warranty";


//import StatusBadge from "./StatusBadge";

const StatusBadge = ({ status }) => {

    const styles = getWarrantyStatusStyles(
        status
    );

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-[11px]
                font-semibold
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

            {status}

        </span>
    );
};

const WarrantyCard = ({
    warranty,
    onView,
    onEdit,
    onDelete,
}) => {

    if (!warranty) {
        return null;
    }


    // ============================================================
    // WARRANTY DATA
    // ============================================================

    const name =
        getWarrantyName(warranty);

    const provider =
        getProviderName(warranty);

    const assetName =
        getAssetName(warranty);


    // ============================================================
    // STATUS
    // ============================================================

    const meta =
        getWarrantyMeta(warranty);

    const styles =
        getWarrantyStatusStyles(
            meta.status
        );


    // ============================================================
    // ACTION HANDLERS
    // ============================================================

    const handleView = () => {

        if (onView) {
            onView(warranty);
        }

    };


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
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-[1.4rem]
                border
                border-slate-200/80
                bg-white
                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-indigo-200
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
            "
        >

            {/* ==================================================
                STATUS ACCENT
            ================================================== */}

            <div
                className={`
                    absolute
                    inset-x-0
                    top-0
                    h-0.5
                    ${styles.accent}
                `}
            />


            <div className="p-4">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    {/* LEFT */}

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
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                ${styles.icon}
                            `}
                        >

                            <ShieldCheck
                                size={19}
                                strokeWidth={2}
                            />

                        </div>


                        {/* NAME */}

                        <div className="min-w-0">

                            <h3
                                title={name}
                                className="
                                    truncate
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {name}
                            </h3>

                            <p
                                title={provider}
                                className="
                                    mt-0.5
                                    truncate
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {provider}
                            </p>

                        </div>

                    </div>


                    {/* MORE */}

                    <button
                        type="button"
                        aria-label="Warranty actions"
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <MoreVertical size={16} />
                    </button>

                </div>


                {/* ==================================================
                    STATUS + TIME
                ================================================== */}

                <div
                    className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <StatusBadge
                        status={meta.status}
                    />


                    <span
                        className={`
                            text-[11px]
                            font-semibold
                            ${styles.time}
                        `}
                    >
                        {meta.label}
                    </span>

                </div>


                {/* ==================================================
                    LINKED ASSET
                ================================================== */}

                <div
                    className="
                        mt-3
                        rounded-xl
                        bg-slate-50
                        px-3
                        py-2.5
                    "
                >

                    <p
                        className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-slate-400
                        "
                    >
                        Linked Asset
                    </p>

                    <p
                        title={assetName}
                        className="
                            mt-1
                            truncate
                            text-xs
                            font-semibold
                            text-slate-700
                        "
                    >
                        {assetName}
                    </p>

                </div>


                {/* ==================================================
                    DATES
                ================================================== */}

                <div
                    className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-3
                    "
                >

                    {/* START */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                            "
                        >

                            <CalendarDays
                                size={12}
                                className="text-slate-400"
                            />

                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]
                                    text-slate-400
                                "
                            >
                                Started
                            </p>

                        </div>


                        <p
                            className="
                                mt-1
                                text-xs
                                font-semibold
                                text-slate-700
                            "
                        >
                            {formatWarrantyDate(
                                warranty.startDate
                            )}
                        </p>

                    </div>


                    {/* EXPIRY */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                            "
                        >

                            <CalendarDays
                                size={12}
                                className="text-slate-400"
                            />

                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]
                                    text-slate-400
                                "
                            >
                                Expires
                            </p>

                        </div>


                        <p
                            className={`
                                mt-1
                                text-xs
                                font-semibold
                                ${styles.expiry}
                            `}
                        >
                            {formatWarrantyDate(
                                warranty.expiryDate
                            )}
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

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

                    {/* VIEW */}

                    <button
                        type="button"
                        onClick={handleView}
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            px-2
                            py-1.5
                            text-xs
                            font-semibold
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            hover:text-[#5B4BFF]
                        "
                    >

                        <Eye size={14} />

                        View

                    </button>


                    {/* RIGHT ACTIONS */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1
                        "
                    >

                        {/* EDIT */}

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
                                transition
                                hover:bg-indigo-50
                                hover:text-indigo-600
                                focus:outline-none
                                focus:ring-4
                                focus:ring-indigo-50
                            "
                        >

                            <Pencil size={14} />

                        </button>


                        {/* DELETE */}

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
                                transition
                                hover:bg-rose-50
                                hover:text-rose-600
                                focus:outline-none
                                focus:ring-4
                                focus:ring-rose-50
                            "
                        >

                            <Trash2 size={14} />

                        </button>

                    </div>

                </div>

            </div>

        </article>
    );
};


export default WarrantyCard;