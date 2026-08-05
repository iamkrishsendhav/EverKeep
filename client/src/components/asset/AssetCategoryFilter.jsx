const categories = [
    "All",
    "Electronics",
    "Appliances",
    "Furniture",
    "Vehicle",
    "Property",
    "Insurance",
    "Subscription",
    "Documents",
    "Other",
];

const AssetCategoryFilter = ({
    selected,
    onChange,
}) => {

    return (

        <div className="flex flex-wrap gap-3">

            {categories.map((category) => (

                <button
                    key={category}
                    onClick={() => onChange(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition
                    ${selected === category
                            ? "bg-[#5B4BFF] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                >

                    {category}

                </button>

            ))}

        </div>

    );

};

export default AssetCategoryFilter;