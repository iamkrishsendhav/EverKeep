import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";

import { getWarrantyMeta } from "../../utils/warranty";
import useWarranties from "../../hooks/useWarranties";

import WarrantyHeader from "../../components/warranty/WarrantyHeader";
import WarrantyStats from "../../components/warranty/WarrantyStats";
import WarrantyGrid from "../../components/warranty/WarrantyGrid";

import AddWarrantyModal from "../../components/warranty/AddWarrantyModal";
import EditWarrantyModal from "../../components/warranty/EditWarrantyModal";
import WarrantyDetailsModal from "../../components/warranty/WarrantyDetailsModal";
import DeleteModal from "../../components/warranty/DeleteModal";


// ============================================================
// STATUS FILTERS
// ============================================================

const STATUS_FILTERS = [
    "All",
    "Active",
    "Upcoming",
    "Expiring Soon",
    "Expired",
];


// ============================================================
// WARRANTY PAGE
// ============================================================

const Warranty = () => {

    // ============================================================
    // WARRANTY DATA
    // ============================================================

    const {
        warranties,
        loading,
        error,
        actionLoading,
        fetchWarranties,
        addWarranty,
        editWarranty,
        removeWarranty,
    } = useWarranties();


    // ============================================================
    // UI STATE
    // ============================================================

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [selectedWarranty, setSelectedWarranty] =
        useState(null);

    const [editingWarranty, setEditingWarranty] =
        useState(null);

    const [deletingWarranty, setDeletingWarranty] =
        useState(null);

    const [showAddModal, setShowAddModal] =
        useState(false);


    // ============================================================
    // FILTERED WARRANTIES
    // ============================================================

    const filteredWarranties = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();


        return warranties.filter((warranty) => {

            const meta =
                getWarrantyMeta(warranty);


            // ----------------------------------------------------
            // WARRANTY NAME
            // ----------------------------------------------------

            const title = (
                warranty?.title ||
                warranty?.name ||
                ""
            ).toLowerCase();


            // ----------------------------------------------------
            // PROVIDER
            // ----------------------------------------------------

            const provider = (
                warranty?.provider ||
                warranty?.brand ||
                ""
            ).toLowerCase();


            // ----------------------------------------------------
            // ASSET
            // ----------------------------------------------------

            const asset = (
                warranty?.asset?.name ||
                warranty?.asset?.title ||
                warranty?.assetName ||
                ""
            ).toLowerCase();


            // ----------------------------------------------------
            // SEARCH
            // ----------------------------------------------------

            const matchesSearch =
                !query ||
                title.includes(query) ||
                provider.includes(query) ||
                asset.includes(query);


            // ----------------------------------------------------
            // STATUS
            // ----------------------------------------------------

            const matchesStatus =
                statusFilter === "All" ||
                meta.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        warranties,
        search,
        statusFilter,
    ]);


    // ============================================================
    // ADD WARRANTY
    // ============================================================

    const handleAddWarranty = async (
        formData
    ) => {

        try {

            await addWarranty(
                formData
            );

            setShowAddModal(false);

        } catch (error) {

            console.error(
                "Failed to create warranty:",
                error
            );

            // Modal handles its own error display.
            throw error;
        }
    };


    // ============================================================
    // EDIT WARRANTY
    // ============================================================

    const handleEditWarranty = async (
        formData
    ) => {

        if (!editingWarranty) {
            return;
        }


        const warrantyId =
            editingWarranty?._id ||
            editingWarranty?.id;


        if (!warrantyId) {

            throw new Error(
                "Warranty ID is missing."
            );
        }


        try {

            await editWarranty(
                warrantyId,
                formData
            );

            setEditingWarranty(null);

        } catch (error) {

            console.error(
                "Failed to update warranty:",
                error
            );

            throw error;
        }
    };


    // ============================================================
    // DELETE WARRANTY
    // ============================================================

    const handleDeleteWarranty = async () => {

        if (!deletingWarranty) {
            return;
        }


        const warrantyId =
            deletingWarranty?._id ||
            deletingWarranty?.id;


        if (!warrantyId) {

            throw new Error(
                "Warranty ID is missing."
            );
        }


        try {

            await removeWarranty(
                warrantyId
            );


            setDeletingWarranty(null);

            setSelectedWarranty(null);

        } catch (error) {

            console.error(
                "Failed to delete warranty:",
                error
            );

            throw error;
        }
    };


    // ============================================================
    // LOADING SKELETON
    // ============================================================

    if (loading) {

        return (

            <section
                className="space-y-5 pb-8"
            >

                {/* HEADER */}

                <div
                    className="
                        h-20
                        animate-pulse
                        rounded-3xl
                        bg-white/70
                    "
                />


                {/* STATS */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {Array.from({
                        length: 4,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="
                                h-28
                                animate-pulse
                                rounded-[1.35rem]
                                bg-white/70
                            "
                        />

                    ))}

                </div>


                {/* CARDS */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        md:grid-cols-2
                    "
                >

                    {Array.from({
                        length: 4,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="
                                h-56
                                animate-pulse
                                rounded-[1.4rem]
                                bg-white/70
                            "
                        />

                    ))}

                </div>

            </section>
        );
    }


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <section
            className="
                space-y-5
                pb-8
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <WarrantyHeader
                total={warranties.length}
                onAdd={() =>
                    setShowAddModal(true)
                }
            />


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border
                        border-rose-200
                        bg-rose-50
                        p-4
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-rose-800
                            "
                        >
                            Something went wrong
                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-rose-600
                            "
                        >
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={fetchWarranties}
                        disabled={loading}
                        className="
                            text-xs
                            font-semibold
                            text-rose-700
                            hover:underline
                            disabled:opacity-50
                        "
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* ==================================================
                STATS
            ================================================== */}

            <WarrantyStats
                warranties={warranties}
            />


            {/* ==================================================
                SEARCH + FILTERS
            ================================================== */}

            <div
                className="
                    rounded-[1.35rem]
                    border
                    border-slate-200/80
                    bg-white
                    p-3
                    shadow-[0_8px_30px_rgba(15,23,42,0.03)]
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                    "
                >

                    {/* SEARCH */}

                    <div
                        className="
                            relative
                            flex-1
                        "
                    >

                        <Search
                            size={17}
                            className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />


                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search warranties, providers or assets..."
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50/50
                                pl-10
                                pr-4
                                text-sm
                                text-slate-800
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-indigo-300
                                focus:bg-white
                                focus:ring-4
                                focus:ring-indigo-50
                            "
                        />

                    </div>


                    {/* STATUS FILTERS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-1.5
                        "
                    >

                        {STATUS_FILTERS.map(
                            (status) => (

                                <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                        setStatusFilter(
                                            status
                                        )
                                    }
                                    className={`
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        transition

                                        ${
                                            statusFilter === status
                                                ? "bg-indigo-50 text-[#5B4BFF]"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                        }
                                    `}
                                >
                                    {status}
                                </button>

                            )
                        )}


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={fetchWarranties}
                            disabled={loading}
                            aria-label="Refresh warranties"
                            className="
                                ml-auto
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-slate-200
                                text-slate-500
                                transition
                                hover:bg-slate-50
                                hover:text-slate-800
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={15}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                RESULTS HEADER
            ================================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <p
                    className="
                        text-xs
                        font-semibold
                        text-slate-500
                    "
                >

                    {filteredWarranties.length}{" "}

                    {filteredWarranties.length === 1
                        ? "warranty"
                        : "warranties"
                    }{" "}

                    found

                </p>


                {statusFilter !== "All" && (

                    <button
                        type="button"
                        onClick={() =>
                            setStatusFilter("All")
                        }
                        className="
                            text-xs
                            font-semibold
                            text-indigo-600
                            hover:underline
                        "
                    >
                        Clear filter
                    </button>

                )}

            </div>


            {/* ==================================================
                WARRANTY GRID
            ================================================== */}

            <WarrantyGrid
                warranties={filteredWarranties}
                search={search}
                statusFilter={statusFilter}
                onView={setSelectedWarranty}
                onEdit={setEditingWarranty}
                onDelete={setDeletingWarranty}
                onAdd={() =>
                    setShowAddModal(true)
                }
            />


            {/* ==================================================
                ADD WARRANTY
            ================================================== */}

            {showAddModal && (

                <AddWarrantyModal
                    onClose={() =>
                        setShowAddModal(false)
                    }
                    onCreated={
                        handleAddWarranty
                    }
                />

            )}


            {/* ==================================================
                EDIT WARRANTY
            ================================================== */}

            {editingWarranty && (

                <EditWarrantyModal
                    warranty={editingWarranty}
                    onClose={() =>
                        setEditingWarranty(null)
                    }
                    onUpdated={
                        handleEditWarranty
                    }
                />

            )}


            {/* ==================================================
                DETAILS
            ================================================== */}

            {selectedWarranty && (

                <WarrantyDetailsModal
                    warranty={selectedWarranty}
                    onClose={() =>
                        setSelectedWarranty(null)
                    }
                    onEdit={(warranty) => {

                        setSelectedWarranty(null);

                        setEditingWarranty(
                            warranty
                        );

                    }}
                    onDelete={(warranty) => {

                        setSelectedWarranty(null);

                        setDeletingWarranty(
                            warranty
                        );

                    }}
                />

            )}


            {/* ==================================================
                DELETE
            ================================================== */}

            {deletingWarranty && (

                <DeleteModal
                    warranty={deletingWarranty}
                    deleting={actionLoading}
                    onCancel={() =>
                        setDeletingWarranty(null)
                    }
                    onConfirm={
                        handleDeleteWarranty
                    }
                />

            )}

        </section>
    );
};


export default Warranty;