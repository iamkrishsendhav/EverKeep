import "dotenv/config";
import mongoose from "mongoose";

const indexName = "invitations.token_1";
const indexKey = { "invitations.token": 1 };
const indexOptions = {
    unique: true,
    partialFilterExpression: {
        "invitations.token": { $type: "string" },
    },
    name: indexName,
};

const sameKey = (key) =>
    Object.keys(key || {}).length === 1 &&
    key["invitations.token"] === 1;

try {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured.");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: false,
        serverSelectionTimeoutMS: 8000,
    });

    const families = mongoose.connection.db.collection("families");
    const hasFamiliesCollection = await mongoose.connection.db
        .listCollections({ name: "families" }, { nameOnly: true })
        .hasNext();
    const indexes = hasFamiliesCollection ? await families.indexes() : [];
    const matchingIndexes = indexes.filter((index) => sameKey(index.key));

    if (hasFamiliesCollection) {
        const [familyCount, invitationTokenFields] = await Promise.all([
            families.countDocuments(),
            families.aggregate([
                { $unwind: "$invitations" },
                {
                    $group: {
                        _id: { $type: "$invitations.token" },
                        count: { $sum: 1 },
                    },
                },
            ]).toArray(),
        ]);
        console.log(JSON.stringify({
            existingFamilies: familyCount,
            invitationTokenFieldTypes: Object.fromEntries(
                invitationTokenFields.map(({ _id, count }) => [_id, count]),
            ),
        }));
    }

    if (matchingIndexes.some((index) => index.name !== indexName)) {
        throw new Error(
            "A differently named invitations.token index exists; inspect it before migrating.",
        );
    }

    const duplicates = await families.aggregate([
        { $unwind: "$invitations" },
        { $match: { "invitations.token": { $type: "string" } } },
        {
            $group: {
                _id: "$invitations.token",
                families: { $addToSet: "$_id" },
            },
        },
        { $match: { $expr: { $gt: [{ $size: "$families" }, 1] } } },
        { $count: "duplicateTokenCount" },
    ]).toArray();

    if (duplicates.length) {
        throw new Error(
            `Found ${duplicates[0].duplicateTokenCount} invitation token(s) reused across families; resolve those records before rebuilding the index.`,
        );
    }

    const currentIndex = matchingIndexes.find((index) => index.name === indexName);
    const isCorrect = currentIndex?.unique === true &&
        currentIndex.partialFilterExpression?.["invitations.token"]?.$type === "string";

    if (currentIndex && !isCorrect) {
        await families.dropIndex(indexName);
        console.log(`Dropped only the obsolete ${indexName} index.`);
    }

    if (!isCorrect) {
        await families.createIndex(indexKey, indexOptions);
        console.log(`Created the partial unique ${indexName} index.`);
    } else {
        console.log(`${indexName} is already correctly configured.`);
    }
} catch (error) {
    console.error(`Family invitation index migration failed: ${error.message}`);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
