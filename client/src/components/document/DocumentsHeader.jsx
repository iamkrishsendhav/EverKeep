import { FileText, Plus, Search } from "lucide-react";

const DocumentsHeader = ({ total, onUpload }) => {

    return (

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

                <div className="flex items-center gap-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">

                        <FileText
                            className="text-[#5B4BFF]"
                            size={28}
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-900">

                            Documents

                        </h1>

                        <p className="text-slate-500">

                            {total} Documents Stored

                        </p>

                    </div>

                </div>

            </div>

            <div className="flex flex-col gap-4 sm:flex-row">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        placeholder="Search documents..."
                        className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-400 sm:w-80"
                    />

                </div>

                <button
                    onClick={onUpload}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B4BFF] px-6 py-3 font-semibold text-white transition hover:scale-105"
                >

                    <Plus size={18} />

                    Upload

                </button>

            </div>

        </div>

    );
};

export default DocumentsHeader;