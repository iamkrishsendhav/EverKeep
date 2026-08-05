// import { deleteAsset } from "../../services/asset.service";
// import { Edit3, Trash2, CalendarDays, Package } from "lucide-react";
import {
    Edit3,
    Trash2,
    Eye,
    Laptop,
    Shield,
    Car,
    Home,
    FileText,
    Package
} from "lucide-react";


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

const getAssetStatus = (asset) => {

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

const categoryIcons = {
    Electronics: Laptop,
    Appliances: Package,
    Furniture: Home,
    Vehicle: Car,
    Property: Home,
    Insurance: Shield,
    Documents: FileText,
    Subscription: FileText,
    Other: Package,
};

const statusColor = {
    Active: "bg-emerald-100 text-emerald-700",

    "Expiring Soon":
        "bg-amber-100 text-amber-700",

    Expired:
        "bg-red-100 text-red-700",

    Archived:
        "bg-slate-200 text-slate-700",
};

const AssetCard = ({ asset, onDelete, onEdit, onView }) => {
    const Icon =
        categoryIcons[asset.category] || Package;

    const status = getAssetStatus(asset);

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl">
            {/* Header */}

            <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">

                    <Icon
                        size={28}
                        className="text-[#5B4BFF]"
                    />

                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[status]}`}
                >
                    {status}
                </span>

            </div>

            <div className="mt-5">

                <h3 className="text-2xl font-bold text-slate-900">

                    {asset.name}

                </h3>

                <p className="mt-1 text-slate-500">

                    {asset.brand || "Unknown"}

                    {" • "}

                    {asset.category}

                </p>

            </div>

            {/* Category */}
            {/* <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                <Package size={16} />
                {asset.category}
            </div> */}

            {/* Info */}
            <div className="mt-8 space-y-4">

                <div className="mt-6 flex items-center justify-between text-sm">

                    <div className="flex items-center gap-2">

                        <span>📅</span>

                        <span className="text-slate-500">

                            Purchased

                            {" "}

                            {formatDate(asset.purchaseDate)}

                        </span>

                    </div>

                    <span className="font-semibold">

                        {formatPrice(asset.purchasePrice)}

                    </span>

                </div>
                <div className="my-5 h-px bg-slate-200"></div>



                <div className="flex items-center justify-between">

                    <span className="text-slate-500">

                        Expires / Renews

                    </span>

                    <span className="font-semibold">

                        {formatDate(asset.warrantyExpiry)}

                    </span>

                </div>

            </div>



            {/* price

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-center text-white">

                <p className="text-sm text-indigo-100">

                    Purchase Price

                </p>

                <h2 className="mt-2 text-3xl font-bold">

                    {formatPrice(asset.purchasePrice)}

                </h2>

            </div> */}

            {/* Footer */}
            <div className="mt-6 flex border-t pt-4">

                <button
                    onClick={() => onView(asset)}
                    className="flex flex-1 items-center justify-center gap-2 transition hover:text-indigo-600"
                >
                    <Eye size={18} />
                    View
                </button>

                <button
                    onClick={() => onEdit(asset)}
                    className="flex flex-1 items-center justify-center gap-2 transition hover:text-indigo-600"
                >
                    <Edit3 size={18} />
                    Edit
                </button>

                <button
                    onClick={() => onDelete(asset)}
                    className="flex flex-1 items-center justify-center gap-2 text-red-500 transition hover:text-red-600"
                >
                    <Trash2 size={18} />
                    Delete
                </button>

            </div>
        </div>
    );
};

export default AssetCard;