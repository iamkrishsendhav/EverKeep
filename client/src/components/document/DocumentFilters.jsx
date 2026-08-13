import {
    BadgeCheck,
    BriefcaseMedical,
    FileBadge,
    FileText,
    GraduationCap,
    Home,
    ReceiptText,
    ShieldCheck,
    WalletCards,
} from "lucide-react";

const folders = [
    { label: "Invoices", category: "Invoice", icon: ReceiptText },
    { label: "Warranty", category: "Warranty", icon: BadgeCheck },
    { label: "Insurance", category: "Insurance", icon: ShieldCheck },
    { label: "Identity", category: "Identity", icon: WalletCards },
    { label: "Medical", category: "Medical", icon: BriefcaseMedical },
    { label: "Property", category: "Property", icon: Home },
    { label: "Education", category: "Education", icon: GraduationCap },
    { label: "Other", category: "Other", icon: FileBadge },
];

const DocumentFilters = ({ documents, selected = "All", onSelect }) => {
    const countFor = (category) =>
        documents.filter((doc) => doc.category === category).length;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                        Folders
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Browse real documents by saved category.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onSelect("All")}
                    className={`hidden rounded-full border px-4 py-2 text-sm font-semibold transition sm:inline-flex ${
                        selected === "All"
                            ? "border-[#5B4BFF] bg-indigo-50 text-[#5B4BFF]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                    }`}
                >
                    All
                </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {folders.map(({ label, category, icon: Icon }) => {
                    const isSelected = selected === category;

                    return (
                        <button
                            key={category}
                            type="button"
                            onClick={() => onSelect(isSelected ? "All" : category)}
                            className={`group rounded-3xl border bg-white p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)] ${
                                isSelected ? "border-[#5B4BFF] ring-4 ring-indigo-50" : "border-slate-200"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-[#5B4BFF] transition group-hover:scale-105">
                                    <Icon size={20} />
                                </div>
                                <FileText size={16} className="text-slate-300" />
                            </div>
                            <div className="mt-5">
                                <p className="text-sm font-semibold text-slate-950">
                                    {label}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {countFor(category)} document{countFor(category) === 1 ? "" : "s"}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default DocumentFilters;
