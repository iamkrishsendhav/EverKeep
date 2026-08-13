import DocumentCard from "./DocumentCard";

const headers = [
    "Document",
    "Category",
    "Linked Asset",
    "File Size",
    "Uploaded Date",
    "Actions",
];

const DocumentGrid = ({ documents, onPreview, onDelete, deletingId }) => {
    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 ${
                                        header === "Actions" ? "text-right" : ""
                                    }`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((document) => (
                            <DocumentCard
                                key={document._id}
                                document={document}
                                onPreview={onPreview}
                                onDelete={onDelete}
                                deleting={deletingId === document._id}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default DocumentGrid;
