import {
    X,
    CalendarDays,
    IndianRupee,
    Package,
    Tag,
    Hash,
    ClipboardList,
    Edit3,
    Laptop,
    Shield,
    Car,
    Home,
    FileText,
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
    if (!price) return "--";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};


const getWarrantyProgress = (purchaseDate, warrantyExpiry) => {

    if (!purchaseDate || !warrantyExpiry) {
        return {
            percent: 0,
            days: "--",
            text: "No Warranty",
        };
    }

    const purchase = new Date(purchaseDate);

    const expiry = new Date(warrantyExpiry);

    const today = new Date();

    const total =
        expiry - purchase;

    const elapsed =
        today - purchase;

    let percent =
        (elapsed / total) * 100;

    percent = Math.min(
        100,
        Math.max(0, percent)
    );

    const remaining = Math.ceil(
        (expiry - today) /
        (1000 * 60 * 60 * 24)
    );

    if (remaining < 0) {

        return {
            percent: 100,
            days: Math.abs(remaining),
            text: "Expired",
        };

    }

    return {
        percent,
        days: remaining,
        text: "Remaining",
    };
};


const getAssetAge = (purchaseDate) => {

    if (!purchaseDate) return "--";

    const purchase = new Date(purchaseDate);

    const today = new Date();

    let years =
        today.getFullYear() -
        purchase.getFullYear();

    let months =
        today.getMonth() -
        purchase.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years === 0)
        return `${months} Month${months !== 1 ? "s" : ""}`;

    return `${years} Year${years !== 1 ? "s" : ""} ${months} Month${months !== 1 ? "s" : ""}`;
};


const getStatus = (asset) => {
    if (asset.status === "Archived") return "Archived";

    if (!asset.warrantyExpiry) return "Active";

    const today = new Date();
    const expiry = new Date(asset.warrantyExpiry);

    const diffDays = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "Expired";

    if (diffDays <= 30) return "Expiring Soon";

    return "Active";
};



const statusColor = {
    Active: "bg-emerald-100 text-emerald-700",
    "Expiring Soon": "bg-amber-100 text-amber-700",
    Expired: "bg-red-100 text-red-700",
    Archived: "bg-slate-200 text-slate-700",
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

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">

        <div className="rounded-xl bg-white p-3 shadow-sm">
            {icon}
        </div>

        <div className="flex-1">

            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-slate-900 break-all">
                {value || "--"}
            </p>

        </div>

    </div>
);

const AssetDetailsModal = ({
    isOpen,
    asset,
    onClose,
    onEdit,
}) => {

    if (!isOpen || !asset) return null;

    const Icon =
        categoryIcons[asset.category] || Package;

    const status = getStatus(asset);

    const warranty =
        getWarrantyProgress(
            asset.purchaseDate,
            asset.warrantyExpiry
        );

    const assetAge =
        getAssetAge(asset.purchaseDate);




    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-6"
            onClick={onClose}
        >

            <div
                className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}

                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-[#5B4BFF] to-violet-500 p-8 text-white">


                    <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>


                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
                    >
                        <X size={22} />
                    </button>

                    <div className="flex items-center gap-5">

                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/15 backdrop-blur-xl shadow-xl">

                            <Icon size={48} />

                        </div>

                        <div>

                            <h2 className="text-5xl font-extrabold tracking-tight">
                                {asset.name}
                            </h2>

                            <p className="mt-3 text-lg text-white/80">
                                {asset.brand || "Unknown Brand"}
                                {asset.model && ` • ${asset.model}`}
                            </p>

                            <div className="mt-5">

                                <p className="text-sm uppercase tracking-widest text-white/60">
                                    Purchase Price
                                </p>

                                <h3 className="mt-1 text-4xl font-bold">
                                    {formatPrice(asset.purchasePrice)}
                                </h3>

                            </div>

                            <span
                                className={`mt-6 inline-flex items-center rounded-full px-5 py-2 text-sm font-bold shadow-lg ${statusColor[status]}`}
                            >
                                {status}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Body */}

                <div className="grid gap-5 p-8 md:grid-cols-2">

                    <InfoRow
                        icon={<Package size={20} />}
                        label="Category"
                        value={asset.category}
                    />

                    <InfoRow
                        icon={<IndianRupee size={20} />}
                        label="Purchase Price"
                        value={formatPrice(asset.purchasePrice)}
                    />

                    <InfoRow
                        icon={<CalendarDays size={20} />}
                        label="Purchase Date"
                        value={formatDate(asset.purchaseDate)}
                    />

                    <InfoRow
                        icon={<CalendarDays size={20} />}
                        label="Warranty Expires"
                        value={formatDate(asset.warrantyExpiry)}
                    />

                    <InfoRow
                        icon={<Tag size={20} />}
                        label="Brand"
                        value={asset.brand}
                    />

                    <InfoRow
                        icon={<ClipboardList size={20} />}
                        label="Model"
                        value={asset.model}
                    />

                    <InfoRow
                        icon={<Hash size={20} />}
                        label="Serial Number"
                        value={asset.serialNumber}
                    />

                    <InfoRow
                        icon={<ClipboardList size={20} />}
                        label="Status"
                        value={status}
                    />

                </div>

                <div className="px-8">

                    <div className="rounded-3xl border border-slate-200 bg-white p-6">

                        <div className="flex items-center justify-between">

                            <h3 className="text-lg font-bold">
                                Warranty Progress
                            </h3>

                            <span className="font-semibold text-slate-600">

                                {Math.round(
                                    warranty.percent
                                )}% Used

                            </span>

                        </div>

                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">

                            <div
                                className={`h-full rounded-full transition-all duration-700
                ${status === "Expired"
                                        ? "bg-red-500"
                                        : status === "Expiring Soon"
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                    }`}
                                style={{
                                    width:
                                        `${warranty.percent}%`,
                                }}
                            />

                        </div>

                        <div className="mt-5">

                            {
                                warranty.text === "Expired"

                                    ? (

                                        <p className="font-semibold text-red-600">

                                            Expired {warranty.days} days ago

                                        </p>

                                    )

                                    : (

                                        <p className="font-semibold text-emerald-600">

                                            {warranty.days} Days Remaining

                                        </p>

                                    )

                            }

                        </div>

                    </div>

                </div>


                <div className="mt-8 px-8">

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Asset Age
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                {assetAge}
                            </h3>

                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Warranty Left
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-emerald-600">

                                {
                                    warranty.text === "Expired"

                                        ? "Expired"

                                        : `${warranty.days} Days`

                                }

                            </h3>

                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Purchase Price
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                {formatPrice(asset.purchasePrice)}
                            </h3>

                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Category
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-[#5B4BFF]">
                                {asset.category}
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">

                    <h3 className="mb-8 text-xl font-bold text-slate-900">
                        Asset Timeline
                    </h3>

                    <div className="space-y-8">

                        <div className="flex gap-5">

                            <div className="flex flex-col items-center">

                                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>

                                <div className="h-16 w-[2px] bg-slate-300"></div>

                            </div>

                            <div>

                                <p className="font-semibold">
                                    Purchased
                                </p>

                                <p className="text-slate-500">
                                    {formatDate(asset.purchaseDate)}
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-5">

                            <div className="flex flex-col items-center">

                                <div className="h-4 w-4 rounded-full bg-blue-500"></div>

                                <div className="h-16 w-[2px] bg-slate-300"></div>

                            </div>

                            <div>

                                <p className="font-semibold">
                                    Today
                                </p>

                                <p className="text-slate-500">
                                    {formatDate(new Date())}
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-5">

                            <div className="flex items-center">

                                <div className="h-4 w-4 rounded-full bg-[#5B4BFF]"></div>

                            </div>

                            <div>

                                <p className="font-semibold">
                                    Warranty Ends
                                </p>

                                <p className="text-slate-500">
                                    {formatDate(asset.warrantyExpiry)}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2">

                        <div className="rounded-2xl bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Asset Age
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {assetAge}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm">

                            <p className="text-sm text-slate-500">
                                Warranty Remaining
                            </p>

                            <p className="mt-2 text-2xl font-bold">

                                {
                                    warranty.text === "Expired"

                                        ? "Expired"

                                        : `${warranty.days} Days`

                                }

                            </p>

                        </div>

                    </div>

                </div>

                {/* Notes */}

                <div className="px-8 pb-8">

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                        <h3 className="mb-3 text-lg font-bold text-slate-900">
                            Notes
                        </h3>

                        <p className="leading-7 text-slate-600">
                            {asset.notes ||
                                "No notes available for this asset."}
                        </p>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex items-center justify-end gap-4 border-t border-slate-200 px-8 py-6">

                    <button
                        onClick={onClose}
                        className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-100"
                    >
                        Close
                    </button>

                    <button
                        onClick={() => onEdit(asset)}
                        className="flex items-center gap-2 rounded-2xl bg-[#5B4BFF] px-7 py-3 font-semibold text-white transition hover:bg-[#4A39F5]"
                    >
                        <Edit3 size={18} />

                        Edit Asset
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AssetDetailsModal;