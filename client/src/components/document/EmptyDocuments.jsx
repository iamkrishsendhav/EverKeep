import { FileText, Plus } from "lucide-react";

const EmptyDocuments = ({ onUpload }) => {

    return (

        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">

                <FileText
                    size={42}
                    className="text-[#5B4BFF]"
                />

            </div>

            <h2 className="mt-8 text-3xl font-bold">

                No Documents Yet

            </h2>

            <p className="mt-3 text-slate-500">

                Store invoices, warranties, insurance papers and important files.

            </p>

            <button
                onClick={onUpload}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#5B4BFF] px-7 py-3 font-semibold text-white transition hover:scale-105"
            >

                <Plus size={18} />

                Upload First Document

            </button>

        </div>

    );
};

export default EmptyDocuments;