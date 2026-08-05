const AssetSort = ({ value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-[#5B4BFF] focus:ring-4 focus:ring-indigo-100"
        >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceHigh">Price : High → Low</option>
            <option value="priceLow">Price : Low → High</option>
            <option value="name">Name (A-Z)</option>
            <option value="warranty">Warranty Expiring Soon</option>
        </select>
    );
};

export default AssetSort;
