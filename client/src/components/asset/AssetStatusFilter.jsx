const statuses = [
    "All",
    "Active",
    "Expiring Soon",
    "Expired",
];

const AssetStatusFilter = ({
    selected,
    onChange,
}) => {
    return (
        <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
                <button
                    key={status}
                    onClick={() => onChange(status)}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                        selected === status
                            ? "bg-[#5B4BFF] text-white shadow-lg"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>
    );
};

export default AssetStatusFilter;