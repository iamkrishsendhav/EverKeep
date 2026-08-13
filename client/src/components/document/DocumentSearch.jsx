import { Search } from "lucide-react";

const DocumentSearch = ({ value, onChange, total }) => {
    return (
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex min-w-0 flex-1 items-center">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 text-slate-400"
                />
                <span className="sr-only">Search documents</span>
                <input
                    type="search"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search by file name, category or linked asset"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#5B4BFF] focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
            </label>

            <div className="shrink-0 px-2 text-sm font-medium text-slate-500">
                {total} result{total === 1 ? "" : "s"}
            </div>
        </div>
    );
};

export default DocumentSearch;
