const filters = [
    "All",
    "Invoice",
    "Warranty",
    "Insurance",
    "Medical",
    "Property",
    "Identity",
    "Other",
];

const DocumentFilters = ({ selected = "All", onSelect }) => {
    return (
        <div className="flex flex-wrap gap-3">
            {filters.map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                        selected === item
                            ? "border-[#5B4BFF] bg-indigo-50 text-[#5B4BFF]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );
};

export default DocumentFilters;
