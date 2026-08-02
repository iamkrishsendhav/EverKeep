import { Search } from "lucide-react";

const AssetSearch = ({ value, onChange }) => {
    return (
        <div className="relative w-full">

            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                placeholder="Search assets..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#5B4BFF] focus:ring-4 focus:ring-indigo-100"
            />

        </div>
    );
};

export default AssetSearch;