import AssetCard from "./AssetCard";

const AssetGrid = ({ assets, onDelete , onEdit }) => {
    if (assets.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <h2 className="text-xl font-semibold">
                    No Assets Found
                </h2>

                <p className="mt-2 text-slate-500">
                    Add your first asset to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
                <AssetCard
                    key={asset._id}
                    asset={asset}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default AssetGrid;