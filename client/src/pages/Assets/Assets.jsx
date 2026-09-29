import { useEffect, useState } from "react";

import AssetGrid from "../../components/asset/AssetGrid";
import DeleteAssetModal from "../../components/asset/DeleteAssetModal";
import AssetModal from "../../components/asset/AssetModal";
import AssetForm from "../../components/asset/AssetForm";
import AssetSearch from "../../components/asset/AssetSearch";
import AssetCategoryFilter from "../../components/asset/AssetCategoryFilter";
import AssetStatusFilter from "../../components/asset/AssetStatusFilter";
import AssetSort from "../../components/asset/AssetSort";
import AssetHeader from "../../components/asset/AssetHeader";
import AssetDetailsModal from "../../components/asset/AssetDetailsModal";


import {
    getAssets,
    deleteAsset,
} from "../../services/asset.service";

const Assets = () => {

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [viewAsset, setViewAsset] = useState(null);


    // ==========================
    // Fetch Assets
    // ==========================
    const fetchAssets = async () => {
        try {

            setLoading(true);

            const response = await getAssets();

            setAssets(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(err);
            setAssets([]);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load assets."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchAssets();

        window.addEventListener(
            "everkeep:assets:changed",
            fetchAssets
        );

        return () => {
            window.removeEventListener(
                "everkeep:assets:changed",
                fetchAssets
            );
        };
    }, []);

    // ==========================
    // Open Delete Modal
    // ==========================
    const handleDelete = (asset) => {
        setSelectedAsset(asset);
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setIsEditOpen(true);
    };

    // ==========================
    // Confirm Delete
    // ==========================
    const confirmDelete = async () => {

        if (!selectedAsset) return;

        try {

            setDeleteLoading(true);

            await deleteAsset(selectedAsset._id);

            setSelectedAsset(null);

            await fetchAssets();

        } catch (err) {

            console.error(err);

        } finally {

            setDeleteLoading(false);

        }
    };

    // ==========================
    // Loading
    // ==========================
    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-slate-500">Loading assets...</p>
            </div>
        );
    }

    // ==========================
    // Error
    // ==========================
    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }




    const getStatus = (asset) => {

        if (asset.status === "Archived") {
            return "Archived";
        }

        if (!asset.warrantyExpiry) {
            return "Active";
        }

        const today = new Date();

        const expiry = new Date(asset.warrantyExpiry);

        const diffDays = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {
            return "Expired";
        }

        if (diffDays <= 30) {
            return "Expiring Soon";
        }

        return "Active";
    };


    //filter logic



    const filteredAssets = assets
        .filter((asset) => {

            const keyword = search.toLowerCase();

            const matchesSearch =
                asset.name.toLowerCase().includes(keyword) ||
                (asset.brand || "").toLowerCase().includes(keyword) ||
                asset.category.toLowerCase().includes(keyword);

            const matchesCategory =
                category === "All"
                    ? true
                    : asset.category === category;

            const matchesStatus =
                status === "All"
                    ? true
                    : getStatus(asset) === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        })

        .sort((a, b) => {

            switch (sortBy) {

                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);

                case "priceHigh":
                    return b.purchasePrice - a.purchasePrice;

                case "priceLow":
                    return a.purchasePrice - b.purchasePrice;

                case "name":
                    return a.name.localeCompare(b.name);

                case "warranty":
                    return (
                        new Date(a.warrantyExpiry) -
                        new Date(b.warrantyExpiry)
                    );

                default:
                    return (
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    );
            }

        });


    const total = assets.length;

    const active = assets.filter(
        (asset) => getStatus(asset) === "Active"
    ).length;

    const expiring = assets.filter(
        (asset) => getStatus(asset) === "Expiring Soon"
    ).length;

    const expired = assets.filter(
        (asset) => getStatus(asset) === "Expired"
    ).length;




    const handleView = (asset) => {
        setViewAsset(asset);
    };



    // ==========================
    // UI
    // ==========================
    return (
        <>
            <section className="space-y-6">

                {/* <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Workspace
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-slate-900">
                        Assets
                    </h1>

                    <div className="mt-6">
                        <AssetSearch
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    <div className="mt-4">

                        <AssetCategoryFilter
                            selected={category}
                            onChange={setCategory}
                        />

                    </div>

                    <div className="mt-4">
                        <AssetStatusFilter
                            selected={status}
                            onChange={setStatus}
                        />
                    </div>

                    <div className="mt-4 flex justify-end">

                        <AssetSort
                            value={sortBy}
                            onChange={setSortBy}
                        />

                    </div>

                </div> */}

                <AssetHeader
                    total={total}
                    active={active}
                    expiring={expiring}
                    expired={expired}
                    onAddAsset={() => setIsAddOpen(true)}
                />

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <AssetSearch
                            value={search}
                            onChange={setSearch}
                        />

                        <AssetSort
                            value={sortBy}
                            onChange={setSortBy}
                        />
                    </div>

                    <div className="mt-4 space-y-4">
                        <AssetCategoryFilter
                            selected={category}
                            onChange={setCategory}
                        />

                        <AssetStatusFilter
                            selected={status}
                            onChange={setStatus}
                        />
                    </div>
                </div>


                <AssetGrid
                    assets={filteredAssets}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onView={handleView}
                />

            </section>

            {/* Delete Modal */}
            <DeleteAssetModal
                isOpen={!!selectedAsset}
                asset={selectedAsset}
                loading={deleteLoading}
                onClose={() => setSelectedAsset(null)}
                onConfirm={confirmDelete}
            />

            {/* Add Asset Modal */}
            <AssetModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add New Asset"
                description="Store warranties, invoices and lifecycle information."
            >
                <AssetForm
                    onCancel={() => setIsAddOpen(false)}
                    onSuccess={() => {
                        setIsAddOpen(false);
                        fetchAssets();
                    }}
                />
            </AssetModal>

            {/* Edit Asset Modal */}
            <AssetModal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditingAsset(null);
                }}
                title="Edit Asset"
                description="Update your asset information."
            >
                <AssetForm
                    asset={editingAsset}
                    onCancel={() => {
                        setIsEditOpen(false);
                        setEditingAsset(null);
                    }}
                    onSuccess={() => {
                        setIsEditOpen(false);
                        setEditingAsset(null);
                        fetchAssets();
                    }}
                />
            </AssetModal>

            <AssetDetailsModal
                isOpen={!!viewAsset}
                asset={viewAsset}
                onClose={() => setViewAsset(null)}
                onEdit={(asset) => {
                    setViewAsset(null);
                    handleEdit(asset);
                }}
            />

        </>
    );
};

export default Assets;
