import { Search, SlidersHorizontal } from "lucide-react";

const DocumentSearch = ({
    value,
    onChange,
    category,
    onCategoryChange,
    sortBy,
    onSortChange,
    total,
}) => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}

                <div className="relative flex-1">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition-all focus:border-[#5B4BFF] focus:bg-white"
                    />

                </div>

                {/* Filters */}

                <div className="flex flex-wrap items-center gap-3">

                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

                        <SlidersHorizontal
                            size={18}
                            className="text-slate-500"
                        />

                        <select
                            value={category}
                            onChange={(e) =>
                                onCategoryChange(e.target.value)
                            }
                            className="bg-transparent text-sm outline-none"
                        >
                            <option>All</option>
                            <option>Invoice</option>
                            <option>Warranty</option>
                            <option>Insurance</option>
                            <option>Identity</option>
                            <option>Medical</option>
                            <option>Property</option>
                            <option>Other</option>
                        </select>

                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            onSortChange(e.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#5B4BFF]"
                    >
                        <option value="latest">
                            Latest First
                        </option>

                        <option value="oldest">
                            Oldest First
                        </option>

                        <option value="name">
                            Name (A-Z)
                        </option>

                        <option value="size">
                            File Size
                        </option>

                    </select>

                </div>

            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">

                <p>

                    Showing

                    <span className="mx-1 font-semibold text-slate-900">

                        {total}

                    </span>

                    Documents

                </p>

            </div>

        </div>
    );
};

export default DocumentSearch;