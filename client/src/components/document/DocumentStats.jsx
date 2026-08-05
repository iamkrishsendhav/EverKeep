import {
    FileText,
    HardDrive,
    FolderOpen,
    Link2,
} from "lucide-react";

const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
}) => {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-slate-500">

                        {title}

                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">

                        {value}

                    </h2>

                </div>

                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
                >
                    <Icon
                        size={26}
                        className="text-white"
                    />
                </div>

            </div>

        </div>

    );

};

const DocumentStats = ({ documents }) => {

    const totalDocuments = documents.length;

    const totalStorage = documents.reduce(
        (sum, doc) => sum + (doc.size || 0),
        0
    );

    const storageMB = (
        totalStorage / (1024 * 1024)
    ).toFixed(1);

    const categories = new Set(
        documents.map((doc) => doc.category)
    ).size;

    const linkedAssets = documents.filter(
        (doc) => doc.assetId
    ).length;

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
                icon={FileText}
                title="Total Documents"
                value={totalDocuments}
                color="bg-indigo-500"
            />

            <StatCard
                icon={HardDrive}
                title="Storage Used"
                value={`${storageMB} MB`}
                color="bg-emerald-500"
            />

            <StatCard
                icon={FolderOpen}
                title="Categories"
                value={categories}
                color="bg-amber-500"
            />

            <StatCard
                icon={Link2}
                title="Linked Assets"
                value={linkedAssets}
                color="bg-rose-500"
            />

        </div>

    );

};

export default DocumentStats;