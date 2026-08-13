import {
    FileWarning,
    Plus,
    SearchX,
} from "lucide-react";

import WarrantyCard from "./WarrantyCard";


const EmptyWarrantyState = ({
    search,
    statusFilter,
    onAdd,
}) => {

    const isFiltered =
        Boolean(search?.trim()) ||
        statusFilter !== "All";


    return (
        <div
            className="
                flex
                min-h-[320px]
                flex-col
                items-center
                justify-center
                rounded-[1.5rem]
                border
                border-dashed
                border-slate-200
                bg-white/70
                px-6
                py-12
                text-center
            "
        >

            {/* ==================================================
                ICON
            ================================================== */}

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-50
                    text-slate-400
                "
            >

                {isFiltered ? (
                    <SearchX
                        size={25}
                        strokeWidth={1.8}
                    />
                ) : (
                    <FileWarning
                        size={25}
                        strokeWidth={1.8}
                    />
                )}

            </div>


            {/* ==================================================
                TITLE
            ================================================== */}

            <h3
                className="
                    mt-5
                    text-base
                    font-bold
                    tracking-tight
                    text-slate-900
                "
            >
                {isFiltered
                    ? "No warranties found"
                    : "No warranties yet"
                }
            </h3>


            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <p
                className="
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-slate-500
                "
            >

                {isFiltered
                    ? "Try changing your search or status filter to find another warranty."
                    : "Keep your product coverage organized by adding your first warranty."
                }

            </p>


            {/* ==================================================
                ADD BUTTON
            ================================================== */}

            {!isFiltered && (

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
                        bg-[#5B4BFF]
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        shadow-[0_10px_25px_rgba(91,75,255,0.18)]
                        transition
                        hover:-translate-y-0.5
                        hover:bg-indigo-600
                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-100
                    "
                >

                    <Plus size={16} />

                    Add warranty

                </button>

            )}

        </div>
    );
};


// ============================================================
// WARRANTY GRID
// ============================================================

const WarrantyGrid = ({
    warranties = [],
    search = "",
    statusFilter = "All",
    onView,
    onEdit,
    onDelete,
    onAdd,
}) => {

    // ============================================================
    // EMPTY
    // ============================================================

    if (!warranties.length) {

        return (
            <EmptyWarrantyState
                search={search}
                statusFilter={statusFilter}
                onAdd={onAdd}
            />
        );
    }


    // ============================================================
    // GRID
    // ============================================================

    return (
        <div
            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
            "
        >

            {warranties.map((warranty) => {

                const warrantyId =
                    warranty?._id ||
                    warranty?.id;


                return (
                    <WarrantyCard
                        key={warrantyId}
                        warranty={warranty}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );

            })}

        </div>
    );
};


export default WarrantyGrid;