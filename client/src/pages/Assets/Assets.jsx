import { useEffect, useState } from "react";

import AssetGrid from "../../components/asset/AssetGrid";
import DeleteAssetModal from "../../components/asset/DeleteAssetModal";
import AssetModal from "../../components/asset/AssetModal";
import AssetForm from "../../components/asset/AssetForm";


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

    // ==========================
    // Fetch Assets
    // ==========================
    const fetchAssets = async () => {
        try {

            setLoading(true);

            const response = await getAssets();

            setAssets(response.data);

        } catch (err) {

            console.error(err);
            setError("Failed to load assets.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchAssets();
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

    // ==========================
    // UI
    // ==========================
    return (
        <>
            <section className="space-y-6">

                <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Workspace
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-slate-900">
                        Assets
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage all your assets in one place.
                    </p>

                </div>

                <AssetGrid
                    assets={assets}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />

            </section>

            <DeleteAssetModal
                isOpen={!!selectedAsset}
                asset={selectedAsset}
                loading={deleteLoading}
                onClose={() => setSelectedAsset(null)}
                onConfirm={confirmDelete}
            />

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
        </>
    );
};

export default Assets;