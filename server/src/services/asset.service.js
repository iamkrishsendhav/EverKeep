import mongoose from "mongoose";

import Asset from "../models/Asset.js";

import Family from "../models/Family.js";

// ============================================================================
// ASSET SERVICE
// ============================================================================
//
// Responsibilities:
//
// - Create assets
// - Get user's assets
// - Get single asset
// - Update asset
// - Delete asset
// - Family-aware access control
// - Family sharing
// - Family unsharing
// - Member permission validation
// - Search / filter / pagination
// - Asset statistics
//
// IMPORTANT:
//
// This service contains business logic only.
//
// Controller:
//     req → service → res
//
// Service:
//     validation → authorization → database
//
// ============================================================================

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE = 1;

const DEFAULT_LIMIT = 20;

const MAX_LIMIT = 100;

// ============================================================================
// BASIC HELPERS
// ============================================================================

// -----------------------------------------------------------------------------
// Normalize ObjectId
// -----------------------------------------------------------------------------

const normalizeId = (value) => {
    if (!value) {
        return null;
    }

    return value.toString();
};

// -----------------------------------------------------------------------------
// Validate ObjectId
// -----------------------------------------------------------------------------

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

// -----------------------------------------------------------------------------
// Convert to ObjectId
// -----------------------------------------------------------------------------

const toObjectId = (value) => {
    if (!value) {
        return null;
    }

    return new mongoose.Types.ObjectId(value);
};

// ============================================================================
// ALLOWED ASSET FIELDS
// ============================================================================
//
// Only these fields can be changed by the client.
//
// This prevents accidental / malicious updates to:
// - owner
// - family
// - sharing
// - createdAt
// - updatedAt
//
// ============================================================================

const ALLOWED_UPDATE_FIELDS = [
    "name",

    "category",

    "brand",

    "model",

    "purchaseDate",

    "purchasePrice",

    "warrantyExpiry",

    "serialNumber",

    "image",

    "notes",

    "reminderEnabled",

    "status",
];

// ============================================================================
// PICK ALLOWED FIELDS
// ============================================================================

const pickAllowedFields = (data = {}, fields = ALLOWED_UPDATE_FIELDS) => {
    const result = {};

    fields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            result[field] = data[field];
        }
    });

    return result;
};

// ============================================================================
// NORMALIZE ASSET DATA
// ============================================================================

const normalizeAssetData = (data = {}) => {
    const assetData = pickAllowedFields(data);

    // ------------------------------------------------------------------------
    // Trim strings
    // ------------------------------------------------------------------------

    const stringFields = [
        "name",

        "category",

        "brand",

        "model",

        "serialNumber",

        "image",

        "notes",
    ];

    stringFields.forEach((field) => {
        if (typeof assetData[field] === "string") {
            assetData[field] = assetData[field].trim();
        }
    });

    // ------------------------------------------------------------------------
    // Purchase price
    // ------------------------------------------------------------------------

    if (assetData.purchasePrice !== undefined) {
        if (assetData.purchasePrice === "") {
            assetData.purchasePrice = 0;
        } else {
            const price = Number(assetData.purchasePrice);

            if (!Number.isFinite(price)) {
                throw new Error("Purchase price must be a valid number.");
            }

            if (price < 0) {
                throw new Error("Purchase price cannot be negative.");
            }

            assetData.purchasePrice = price;
        }
    }

    // ------------------------------------------------------------------------
    // Boolean
    // ------------------------------------------------------------------------

    if (assetData.reminderEnabled !== undefined) {
        assetData.reminderEnabled = Boolean(assetData.reminderEnabled);
    }

    return assetData;
};

// ============================================================================
// VALIDATE DATE RELATIONSHIP
// ============================================================================

const validateDates = (data = {}) => {
    if (data.purchaseDate && data.warrantyExpiry) {
        const purchaseDate = new Date(data.purchaseDate);

        const warrantyExpiry = new Date(data.warrantyExpiry);

        if (Number.isNaN(purchaseDate.getTime())) {
            throw new Error("Purchase date is invalid.");
        }

        if (Number.isNaN(warrantyExpiry.getTime())) {
            throw new Error("Warranty expiry date is invalid.");
        }

        if (purchaseDate > warrantyExpiry) {
            throw new Error("Warranty expiry must be after purchase date.");
        }
    }
};

// ============================================================================
// GET FAMILY FOR USER
// ============================================================================

const getUserFamily = async (userId) => {
    if (!userId) {
        return null;
    }

    return Family.findOne({
        status: "Active",

        $or: [
            {
                owner: userId,
            },

            {
                "members.user": userId,

                "members.status": "Active",
            },
        ],
    });
};

// ============================================================================
// CHECK FAMILY MEMBERSHIP
// ============================================================================

const getFamilyMembership = (family, userId) => {
    if (!family || !userId) {
        return null;
    }

    // ------------------------------------------------------------------------
    // Owner
    // ------------------------------------------------------------------------

    if (normalizeId(family.owner) === normalizeId(userId)) {
        return {
            isOwner: true,

            role: "Owner",

            accessLevel: "Full",

            permissions: {
                assets: true,

                subscriptions: true,

                warranties: true,

                documents: true,

                calendar: true,
            },
        };
    }

    // ------------------------------------------------------------------------
    // Member
    // ------------------------------------------------------------------------

    const member = family.members.find(
        (item) =>
            normalizeId(item.user) === normalizeId(userId) &&
            item.status === "Active",
    );

    if (!member) {
        return null;
    }

    return {
        isOwner: false,

        role: member.role,

        accessLevel: member.accessLevel,

        permissions: member.permissions,
    };
};

// ============================================================================
// CHECK ASSET ACCESS
// ============================================================================
//
// Returns:
//
// {
//     canView,
//     canEdit,
//     canDelete,
//     isOwner,
//     isFamilyMember
// }
//
// ============================================================================

const getAssetAccess = async (asset, userId) => {
    if (!asset || !userId) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // Asset owner
    // ------------------------------------------------------------------------

    const isOwner = normalizeId(asset.owner) === normalizeId(userId);

    if (isOwner) {
        return {
            canView: true,

            canEdit: true,

            canDelete: true,

            isOwner: true,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // No family
    // ------------------------------------------------------------------------

    if (!asset.family) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // Get family
    // ------------------------------------------------------------------------

    const family = await Family.findById(asset.family);

    if (!family) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    const membership = getFamilyMembership(family, userId);

    if (!membership) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // Asset sharing
    // ------------------------------------------------------------------------

    if (!asset.sharing?.shared) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: true,
        };
    }

    const sharedMember = asset.sharing.members.find(
        (item) => normalizeId(item.user) === normalizeId(userId),
    );

    if (!sharedMember) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: true,
        };
    }

    // ------------------------------------------------------------------------
    // Family permission + asset permission
    // ------------------------------------------------------------------------

    const canView = membership.permissions?.assets !== false;

    const canEdit = canView && sharedMember.access === "Edit";

    return {
        canView,

        canEdit,

        canDelete: false,

        isOwner: false,

        isFamilyMember: true,
    };
};

// ============================================================================
// ASSERT ASSET EXISTS
// ============================================================================

const findAssetOrFail = async (assetId) => {
    if (!assetId || !isValidObjectId(assetId)) {
        throw new Error("Invalid asset ID.");
    }

    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new Error("Asset not found.");
    }

    return asset;
};

// ============================================================================
// ASSERT VIEW ACCESS
// ============================================================================

const assertCanView = async (asset, userId) => {
    const access = await getAssetAccess(asset, userId);

    if (!access.canView) {
        throw new Error("You do not have permission to view this asset.");
    }

    return access;
};

// ============================================================================
// ASSERT EDIT ACCESS
// ============================================================================

const assertCanEdit = async (asset, userId) => {
    const access = await getAssetAccess(asset, userId);

    if (!access.canEdit) {
        throw new Error("You do not have permission to edit this asset.");
    }

    return access;
};

// ============================================================================
// ASSERT OWNER
// ============================================================================

const assertOwner = (asset, userId) => {
    if (normalizeId(asset.owner) !== normalizeId(userId)) {
        throw new Error("Only the asset owner can perform this action.");
    }
};

// ============================================================================
// CREATE ASSET
// ============================================================================

export const createAsset = async (userId, data = {}) => {
    if (!userId) {
        throw new Error("Authentication required.");
    }

    if (!isValidObjectId(userId)) {
        throw new Error("Invalid user ID.");
    }

    const assetData = normalizeAssetData(data);

    // ------------------------------------------------------------------------
    // Required fields
    // ------------------------------------------------------------------------

    if (!assetData.name) {
        throw new Error("Asset name is required.");
    }

    if (!assetData.category) {
        throw new Error("Category is required.");
    }

    validateDates(assetData);

    // ------------------------------------------------------------------------
    // Create as personal asset by default
    // ------------------------------------------------------------------------

    const asset = await Asset.create({
        ...assetData,

        owner: toObjectId(userId),

        family: null,

        sharing: {
            shared: false,

            members: [],
        },
    });

    return asset;
};

// ============================================================================
// GET ALL ASSETS
// ============================================================================
//
// Supports:
//
// ?page=1
// ?limit=20
// ?search=macbook
// ?category=Electronics
// ?status=Active
// ?sortBy=createdAt
// ?sortOrder=desc
//
// ============================================================================

export const getAllAssets = async (userId, options = {}) => {
    if (!userId) {
        throw new Error("Authentication required.");
    }

    const page = Math.max(Number(options.page) || DEFAULT_PAGE, 1);

    const limit = Math.min(
        Math.max(Number(options.limit) || DEFAULT_LIMIT, 1),
        MAX_LIMIT,
    );

    const skip = (page - 1) * limit;

    // ------------------------------------------------------------------------
    // Base access query
    // ------------------------------------------------------------------------
    //
    // 1. User's own assets
    //
    // 2. Family assets shared with this user
    //
    // ------------------------------------------------------------------------

    const family = await getUserFamily(userId);

    const accessConditions = [
        {
            owner: userId,
        },
    ];

    if (family) {
        accessConditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": userId,
        });
    }

    const query = {
        $or: accessConditions,
    };

    // ------------------------------------------------------------------------
    // Search
    // ------------------------------------------------------------------------

    if (typeof options.search === "string" && options.search.trim()) {
        const search = options.search.trim();

        query.$and = [
            {
                $or: accessConditions,
            },

            {
                $or: [
                    {
                        name: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        brand: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        model: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        serialNumber: {
                            $regex: search,

                            $options: "i",
                        },
                    },
                ],
            },
        ];

        delete query.$or;
    }

    // ------------------------------------------------------------------------
    // Category
    // ------------------------------------------------------------------------

    if (options.category) {
        query.category = options.category;
    }

    // ------------------------------------------------------------------------
    // Status
    // ------------------------------------------------------------------------

    if (options.status) {
        query.status = options.status;
    }

    // ------------------------------------------------------------------------
    // Sort
    // ------------------------------------------------------------------------

    const allowedSortFields = [
        "createdAt",

        "updatedAt",

        "name",

        "purchaseDate",

        "purchasePrice",

        "warrantyExpiry",
    ];

    const sortBy = allowedSortFields.includes(options.sortBy)
        ? options.sortBy
        : "createdAt";

    const sortOrder = options.sortOrder === "asc" ? 1 : -1;

    const sort = {
        [sortBy]: sortOrder,
    };

    // ------------------------------------------------------------------------
    // Database queries
    // ------------------------------------------------------------------------

    const [assets, total] = await Promise.all([
        Asset.find(query)

            .populate("owner", "name email profileImage")

            .populate("family", "name owner")

            .populate("sharing.members.user", "name email profileImage")

            .sort(sort)

            .skip(skip)

            .limit(limit)

            .lean(),

        Asset.countDocuments(query),
    ]);

    return {
        assets,

        pagination: {
            page,

            limit,

            total,

            pages: Math.ceil(total / limit),
        },
    };
};

// ============================================================================
// GET ASSET BY ID
// ============================================================================

export const getAssetById = async (userId, assetId) => {
    const asset = await findAssetOrFail(assetId);

    await assertCanView(asset, userId);

    await asset.populate([
        {
            path: "owner",

            select: "name email profileImage",
        },

        {
            path: "family",

            select: "name owner members",
        },

        {
            path: "sharing.members.user",

            select: "name email profileImage",
        },
    ]);

    return asset;
};

// ============================================================================
// UPDATE ASSET
// ============================================================================

export const updateAsset = async (userId, assetId, data = {}) => {
    const asset = await findAssetOrFail(assetId);

    await assertCanEdit(asset, userId);

    const updateData = normalizeAssetData(data);

    validateDates({
        ...asset.toObject(),

        ...updateData,
    });

    Object.assign(asset, updateData);

    await asset.save();

    return asset;
};

// ============================================================================
// DELETE ASSET
// ============================================================================

export const deleteAsset = async (userId, assetId) => {
    const asset = await findAssetOrFail(assetId);

    // ------------------------------------------------------------------------
    // Only actual owner can delete
    // ------------------------------------------------------------------------

    assertOwner(asset, userId);

    await asset.deleteOne();

    return {
        deletedAssetId: assetId,

        message: "Asset deleted successfully.",
    };
};

// ============================================================================
// SHARE ASSET WITH FAMILY
// ============================================================================
//
// owner only
//
// Input:
//
// {
//     memberIds: [],
//     access: "View" | "Edit"
// }
//
// ============================================================================

export const shareAsset = async (userId, assetId, data = {}) => {
    const asset = await findAssetOrFail(assetId);

    // ------------------------------------------------------------------------
    // Only owner can share
    // ------------------------------------------------------------------------

    assertOwner(asset, userId);

    // ------------------------------------------------------------------------
    // Family
    // ------------------------------------------------------------------------

    const family = await getUserFamily(userId);

    if (!family) {
        throw new Error("You do not have a Family workspace.");
    }

    // ------------------------------------------------------------------------
    // Member IDs
    // ------------------------------------------------------------------------

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    if (memberIds.length === 0) {
        throw new Error("Please select at least one family member.");
    }

    // ------------------------------------------------------------------------
    // Access
    // ------------------------------------------------------------------------

    const access = data.access === "Edit" ? "Edit" : "View";

    // ------------------------------------------------------------------------
    // Validate selected members
    // ------------------------------------------------------------------------

    const validMembers = family.members.filter(
        (member) =>
            member.status === "Active" &&
            memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
    );

    if (validMembers.length === 0) {
        throw new Error("No valid family members were selected.");
    }

    // ------------------------------------------------------------------------
    // Apply family
    // ------------------------------------------------------------------------

    asset.family = family._id;

    // ------------------------------------------------------------------------
    // Existing sharing
    // ------------------------------------------------------------------------

    const existingMembers = asset.sharing?.members || [];

    validMembers.forEach((familyMember) => {
        const existing = existingMembers.find(
            (item) => normalizeId(item.user) === normalizeId(familyMember.user),
        );

        if (existing) {
            existing.access = access;

            existing.sharedAt = new Date();
        } else {
            existingMembers.push({
                user: familyMember.user,

                access,

                sharedAt: new Date(),
            });
        }
    });

    asset.sharing = {
        shared: true,

        members: existingMembers,
    };

    await asset.save();

    // ------------------------------------------------------------------------
    // Add Family activity
    // ------------------------------------------------------------------------

    family.activity.unshift({
        actor: toObjectId(userId),

        action: "ASSET_SHARED",

        entityType: "Asset",

        entityId: asset._id,

        message: `${asset.name} was shared with family members.`,

        metadata: {
            memberIds: validMembers.map((member) => member.user),

            access,
        },

        createdAt: new Date(),
    });

    await family.save();

    return asset;
};

// ============================================================================
// UNSHARE ASSET
// ============================================================================
//
// Input:
//
// {
//     memberIds: []
// }
//
// If memberIds is empty:
//     remove sharing completely.
//
// If memberIds contains IDs:
//     remove only those members.
//
// ============================================================================

export const unshareAsset = async (userId, assetId, data = {}) => {
    const asset = await findAssetOrFail(assetId);

    assertOwner(asset, userId);

    if (!asset.sharing?.shared) {
        return asset;
    }

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    // ------------------------------------------------------------------------
    // Remove all sharing
    // ------------------------------------------------------------------------

    if (memberIds.length === 0) {
        asset.family = null;

        asset.sharing = {
            shared: false,

            members: [],
        };
    } else {
        // --------------------------------------------------------------------
        // Remove selected members
        // --------------------------------------------------------------------

        asset.sharing.members = asset.sharing.members.filter(
            (member) =>
                !memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
        );

        if (asset.sharing.members.length === 0) {
            asset.family = null;

            asset.sharing.shared = false;
        }
    }

    await asset.save();

    // ------------------------------------------------------------------------
    // Activity
    // ------------------------------------------------------------------------

    const family = await getUserFamily(userId);

    if (family) {
        family.activity.unshift({
            actor: toObjectId(userId),

            action: "ASSET_UNSHARED",

            entityType: "Asset",

            entityId: asset._id,

            message: `${asset.name} sharing was updated.`,

            metadata: {
                memberIds,
            },

            createdAt: new Date(),
        });

        await family.save();
    }

    return asset;
};

// ============================================================================
// UPDATE SHARING PERMISSION
// ============================================================================

export const updateAssetSharingPermission = async (
    userId,
    assetId,
    memberId,
    access,
) => {
    const asset = await findAssetOrFail(assetId);

    assertOwner(asset, userId);

    if (!["View", "Edit"].includes(access)) {
        throw new Error("Invalid asset access level.");
    }

    const member = asset.sharing?.members?.find(
        (item) => normalizeId(item.user) === normalizeId(memberId),
    );

    if (!member) {
        throw new Error("This family member does not have access to the asset.");
    }

    member.access = access;

    await asset.save();

    return asset;
};

// ============================================================================
// REMOVE SINGLE MEMBER ACCESS
// ============================================================================

export const removeAssetMemberAccess = async (userId, assetId, memberId) => {
    return unshareAsset(
        userId,

        assetId,

        {
            memberIds: [memberId],
        },
    );
};

// ============================================================================
// GET ASSET ACCESS DETAILS
// ============================================================================

export const getAssetAccessDetails = async (userId, assetId) => {
    const asset = await findAssetOrFail(assetId);

    const access = await getAssetAccess(asset, userId);

    return {
        assetId: asset._id,

        ...access,
    };
};

// ============================================================================
// GET ASSET STATISTICS
// ============================================================================

export const getAssetStats = async (userId) => {
    if (!userId) {
        throw new Error("Authentication required.");
    }

    const family = await getUserFamily(userId);

    const accessConditions = [
        {
            owner: userId,
        },
    ];

    if (family) {
        accessConditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": userId,
        });
    }

    const baseQuery = {
        $or: accessConditions,
    };

    const [total, active, expired, archived, shared, totalValue] =
        await Promise.all([
            Asset.countDocuments(baseQuery),

            Asset.countDocuments({
                ...baseQuery,

                status: "Active",
            }),

            Asset.countDocuments({
                ...baseQuery,

                status: "Expired",
            }),

            Asset.countDocuments({
                ...baseQuery,

                status: "Archived",
            }),

            Asset.countDocuments({
                ...baseQuery,

                "sharing.shared": true,
            }),

            Asset.aggregate([
                {
                    $match: baseQuery,
                },

                {
                    $group: {
                        _id: null,

                        total: {
                            $sum: {
                                $ifNull: ["$purchasePrice", 0],
                            },
                        },
                    },
                },
            ]),
        ]);

    return {
        total,

        active,

        expired,

        archived,

        shared,

        totalValue: totalValue[0]?.total || 0,
    };
};

// ============================================================================
// GET UPCOMING WARRANTY ASSETS
// ============================================================================
//
// Used later by:
// - Dashboard
// - Calendar
// - Notification system
//
// ============================================================================

export const getUpcomingWarrantyAssets = async (userId, days = 30) => {
    if (!userId) {
        throw new Error("Authentication required.");
    }

    const safeDays = Math.min(Math.max(Number(days) || 30, 1), 365);

    const family = await getUserFamily(userId);

    const accessConditions = [
        {
            owner: userId,
        },
    ];

    if (family) {
        accessConditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": userId,
        });
    }

    const now = new Date();

    const future = new Date();

    future.setDate(future.getDate() + safeDays);

    return Asset.find({
        $or: accessConditions,

        warrantyExpiry: {
            $gte: now,

            $lte: future,
        },

        status: "Active",
    })

        .populate("owner", "name email profileImage")

        .populate("family", "name")

        .sort({
            warrantyExpiry: 1,
        })

        .lean();
};

// ============================================================================
// MARK EXPIRED ASSETS
// ============================================================================
//
// Can be used by a scheduled job later.
//
// ============================================================================

export const updateExpiredAssets = async () => {
    const now = new Date();

    const result = await Asset.updateMany(
        {
            warrantyExpiry: {
                $lt: now,
            },

            status: "Active",
        },

        {
            $set: {
                status: "Expired",
            },
        },
    );

    return {
        matched: result.matchedCount,

        modified: result.modifiedCount,
    };
};

// ============================================================================
// GET FAMILY SHARED ASSETS
// ============================================================================

export const getFamilySharedAssets = async (userId) => {
    const family = await getUserFamily(userId);

    if (!family) {
        return [];
    }

    return Asset.find({
        family: family._id,

        "sharing.shared": true,

        "sharing.members.user": userId,
    })

        .populate("owner", "name email profileImage")

        .populate("sharing.members.user", "name email profileImage")

        .sort({
            updatedAt: -1,
        })

        .lean();
};

// ============================================================================
// DELETE ALL USER ASSETS
// ============================================================================
//
// Useful when deleting/deactivating an account.
// Use carefully from account deletion workflow.
//
// ============================================================================

export const deleteAllUserAssets = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    const result = await Asset.deleteMany({
        owner: userId,
    });

    return {
        deletedCount: result.deletedCount,
    };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    createAsset,

    getAllAssets,

    getAssetById,

    updateAsset,

    deleteAsset,

    shareAsset,

    unshareAsset,

    updateAssetSharingPermission,

    removeAssetMemberAccess,

    getAssetAccessDetails,

    getAssetStats,

    getUpcomingWarrantyAssets,

    updateExpiredAssets,

    getFamilySharedAssets,

    deleteAllUserAssets,
};
