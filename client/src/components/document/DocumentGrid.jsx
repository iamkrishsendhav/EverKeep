import DocumentCard from "./DocumentCard";

const DocumentGrid = ({ documents, onView, onDelete }) => {
    return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((document) => (
                <DocumentCard
                    key={document._id}
                    document={document}
                    onView={onView}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default DocumentGrid;
