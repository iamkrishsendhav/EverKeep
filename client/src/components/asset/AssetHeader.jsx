import { Plus } from "lucide-react";

const AssetHeader = ({
    total,
    active,
    expiring,
    expired,
    onAddAsset,
}) => {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div>

                <div className="flex items-center gap-3">

                    <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                        Assets
                    </h1>

                    <button
                        onClick={onAddAsset}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5B4BFF] text-white transition hover:scale-105 hover:bg-[#4A39F5]"
                    >
                        <Plus size={20} />
                    </button>

                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-lg">

                    <span className="text-slate-500">
                        {total} total
                    </span>

                    <span className="text-emerald-600">
                        • {active} healthy
                    </span>

                    <span className="text-amber-500">
                        • {expiring} expiring
                    </span>

                    <span className="text-red-500">
                        • {expired} expired
                    </span>

                </div>

            </div>

            {/* <button
                onClick={onAddAsset}
                className="flex h-14 items-center gap-3 rounded-2xl bg-[#5B4BFF] px-8 text-lg font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-[#4A39F5]"
            >
                <Plus size={22} />

                Add Asset

            </button> */}

        </div>
    );
};

export default AssetHeader;