import { Search } from "lucide-react";

const AssetSearch = ({ value, onChange }) => {
    return (
        <div className="relative w-full">
            <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                placeholder="Search assets..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-base shadow-sm outline-none transition focus:border-[#5B4BFF] focus:ring-4 focus:ring-[#5B4BFF]/10"
            />
        </div>
    );
};

export default AssetSearch;