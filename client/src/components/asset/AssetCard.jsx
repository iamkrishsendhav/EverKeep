// import { deleteAsset } from "../../services/asset.service";
import { Edit3, Trash2, CalendarDays, Package } from "lucide-react";

const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatPrice = (price) => {
    if (!price) return "—";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

const statusColor = {
    Active: "bg-emerald-100 text-emerald-700",
    Expired: "bg-red-100 text-red-700",
    Archived: "bg-slate-200 text-slate-700",
};

const AssetCard = ({ asset, onDelete, onEdit }) => {

    return (
        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                        {asset.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {asset.brand || "Unknown Brand"}
                        {asset.model && ` • ${asset.model}`}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[asset.status]
                        }`}
                >
                    {asset.status}
                </span>
            </div>

            {/* Category */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                <Package size={16} />
                {asset.category}
            </div>

            {/* Info */}
            <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                    <span className="text-slate-500">Purchase Price</span>

                    <span className="font-semibold">
                        {formatPrice(asset.purchasePrice)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Purchase Date</span>

                    <span>{formatDate(asset.purchaseDate)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Warranty</span>

                    <span>{formatDate(asset.warrantyExpiry)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">Serial</span>

                    <span className="truncate max-w-[170px]">
                        {asset.serialNumber || "--"}
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
                <button
                    onClick={() => onEdit(asset)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                    <Edit3 size={17} />
                    Edit
                </button>

                <button
                    onClick={() => onDelete(asset)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    <Trash2 size={17} />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default AssetCard;