import mongoose from "mongoose";

import Warranty from "../models/Warranty.js";

import Asset from "../models/Asset.js";

import Family from "../models/Family.js";

// ============================================================================
// WARRANTY SERVICE
// ============================================================================
//
// Ownership:
//     warranty.owner
//
// Family:
//     warranty.family
//
// Sharing:
//     warranty.sharing.members[]
//
// Access:
//     Owner       → View + Edit + Delete
//     View member → View
//     Edit member → View + Edit
//
// ============================================================================

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE = 1;

const DEFAULT_LIMIT = 20;

const MAX_LIMIT = 100;

// ============================================================================
// ERROR HELPER
// ============================================================================

const createServiceError = (message, statusCode = 400) => {
    const error = new Error(message);

    error.statusCode = statusCode;

    return error;
};

// ============================================================================
// USER VALIDATION
// ============================================================================

const requireUserId = (userId) => {
    if (!userId) {
        throw createServiceError("Authentication required.", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw createServiceError("Invalid user ID.", 400);
    }

    return userId;
};

// ============================================================================
// NORMALIZE ID
// ============================================================================

const normalizeId = (value) => {
    if (!value) {
        return null;
    }

    return value.toString();
};

// ============================================================================
// GET USER FAMILY
// ============================================================================

const getUserFamily = async (userId) => {
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
// GET FAMILY MEMBERSHIP
// ============================================================================

const getFamilyMembership = (family, userId) => {
    if (!family || !userId) {
        return null;
    }

    // ------------------------------------------------------------------------
    // FAMILY OWNER
    // ------------------------------------------------------------------------

    if (normalizeId(family.owner) === normalizeId(userId)) {
        return {
            isOwner: true,

            role: "Owner",

            permissions: {
                warranties: true,
            },
        };
    }

    // ------------------------------------------------------------------------
    // FAMILY MEMBER
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
// GET WARRANTY ACCESS
// ============================================================================

const getWarrantyAccess = async (warranty, userId) => {
    // ------------------------------------------------------------------------
    // OWNER
    // ------------------------------------------------------------------------

    if (normalizeId(warranty.owner) === normalizeId(userId)) {
        return {
            canView: true,

            canEdit: true,

            canDelete: true,

            isOwner: true,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // NO FAMILY
    // ------------------------------------------------------------------------

    if (!warranty.family) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    const family = await Family.findById(warranty.family);

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
    // NOT SHARED
    // ------------------------------------------------------------------------

    if (!warranty.sharing?.shared) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: true,
        };
    }

    const sharedMember = warranty.sharing.members.find(
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

    const canView = membership.permissions?.warranties !== false;

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
// ASSERT VIEW ACCESS
// ============================================================================

const assertCanView = async (warranty, userId) => {
    const access = await getWarrantyAccess(warranty, userId);

    if (!access.canView) {
        throw createServiceError(
            "You do not have permission to view this warranty.",
            403,
        );
    }

    return access;
};

// ============================================================================
// ASSERT EDIT ACCESS
// ============================================================================

const assertCanEdit = async (warranty, userId) => {
    const access = await getWarrantyAccess(warranty, userId);

    if (!access.canEdit) {
        throw createServiceError(
            "You do not have permission to edit this warranty.",
            403,
        );
    }

    return access;
};

// ============================================================================
// ASSERT OWNER
// ============================================================================

const assertOwner = (warranty, userId) => {
    if (normalizeId(warranty.owner) !== normalizeId(userId)) {
        throw createServiceError(
            "Only the warranty owner can perform this action.",
            403,
        );
    }
};

// ============================================================================
// RESOLVE OWNED ASSET
// ============================================================================

const resolveOwnedAsset = async (assetId, userId) => {
    if (assetId === undefined || assetId === null || assetId === "") {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(assetId)) {
        throw createServiceError("Invalid asset ID.", 400);
    }

    const asset = await Asset.findOne({
        _id: assetId,

        owner: userId,
    }).select("_id");

    if (!asset) {
        throw createServiceError("Selected asset was not found.", 404);
    }

    return asset._id;
};

// ============================================================================
// NORMALIZE WARRANTY DATA
// ============================================================================

const normalizeWarrantyData = (data = {}) => {
    const allowedFields = [
        "title",

        "asset",

        "provider",

        "warrantyNumber",

        "startDate",

        "expiryDate",

        "notes",
    ];

    const result = {};

    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            result[field] = data[field];
        }
    });

    // ------------------------------------------------------------------------
    // STRING FIELDS
    // ------------------------------------------------------------------------

    const stringFields = ["title", "provider", "warrantyNumber", "notes"];

    stringFields.forEach((field) => {
        if (typeof result[field] === "string") {
            result[field] = result[field].trim();
        }
    });

    // ------------------------------------------------------------------------
    // DATE VALIDATION
    // ------------------------------------------------------------------------

    if (result.startDate) {
        const startDate = new Date(result.startDate);

        if (Number.isNaN(startDate.getTime())) {
            throw createServiceError("Invalid warranty start date.", 400);
        }
    }

    if (result.expiryDate) {
        const expiryDate = new Date(result.expiryDate);

        if (Number.isNaN(expiryDate.getTime())) {
            throw createServiceError("Invalid warranty expiry date.", 400);
        }
    }

    // ------------------------------------------------------------------------
    // DATE ORDER
    // ------------------------------------------------------------------------

    if (result.startDate && result.expiryDate) {
        const start = new Date(result.startDate);

        const expiry = new Date(result.expiryDate);

        if (expiry < start) {
            throw createServiceError(
                "Warranty expiry date cannot be before start date.",
                400,
            );
        }
    }

    return result;
};

// ============================================================================
// BUILD ACCESS QUERY
// ============================================================================

const buildAccessQuery = async (userId) => {
    const family = await getUserFamily(userId);

    const conditions = [
        {
            owner: userId,
        },
    ];

    if (family) {
        conditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": userId,
        });
    }

    return {
        $or: conditions,
    };
};

// ============================================================================
// BUILD FILTER QUERY
// ============================================================================

const buildWarrantyQuery = async (userId, filters = {}) => {
    const query = await buildAccessQuery(requireUserId(userId));

    // ------------------------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------------------------

    const search = filters.search?.trim();

    if (search) {
        query.$and = [
            {
                ...query,
            },

            {
                $or: [
                    {
                        title: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        provider: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        warrantyNumber: {
                            $regex: search,

                            $options: "i",
                        },
                    },
                ],
            },
        ];
    }

    // ------------------------------------------------------------------------
    // DATE FILTER
    // ------------------------------------------------------------------------

    if (filters.expiry === "expired") {
        query.expiryDate = {
            $lt: new Date(),
        };
    }

    if (filters.expiry === "active") {
        query.expiryDate = {
            $gte: new Date(),
        };
    }

    return query;
};

// ============================================================================
// CREATE WARRANTY
// ============================================================================

export const createWarranty = async (warrantyData, userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    const data = normalizeWarrantyData(warrantyData);

    data.owner = authenticatedUserId;

    // ------------------------------------------------------------------------
    // Asset ownership
    // ------------------------------------------------------------------------

    if (Object.prototype.hasOwnProperty.call(data, "asset")) {
        data.asset = await resolveOwnedAsset(data.asset, authenticatedUserId);
    }

    // ------------------------------------------------------------------------
    // Personal warranty by default
    // ------------------------------------------------------------------------

    data.family = null;

    data.sharing = {
        shared: false,

        members: [],
    };

    return Warranty.create(data);
};

// ============================================================================
// GET ALL WARRANTIES
// ============================================================================

export const getWarranties = async (userId = null, filters = {}) => {
    const query = await buildWarrantyQuery(userId, filters);

    const page = Math.max(Number(filters.page) || DEFAULT_PAGE, 1);

    const limit = Math.min(
        Math.max(
            Number(filters.limit) || DEFAULT_LIMIT,

            1,
        ),

        MAX_LIMIT,
    );

    const skip = (page - 1) * limit;

    const [warranties, total] = await Promise.all([
        Warranty.find(query)

            .populate("asset", "name brand category")

            .populate("owner", "name email profileImage")

            .populate("family", "name owner")

            .populate("sharing.members.user", "name email profileImage")

            .sort({
                expiryDate: 1,
            })

            .skip(skip)

            .limit(limit)

            .lean(),

        Warranty.countDocuments(query),
    ]);

    return {
        warranties,

        pagination: {
            page,

            limit,

            total,

            pages: Math.ceil(total / limit),
        },
    };
};

// ============================================================================
// GET WARRANTY BY ID
// ============================================================================

export const getWarrantyById = async (warrantyId, userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    if (!mongoose.Types.ObjectId.isValid(warrantyId)) {
        throw createServiceError("Invalid warranty ID.", 400);
    }

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    await assertCanView(warranty, authenticatedUserId);

    await warranty.populate([
        {
            path: "asset",

            select: "name brand category",
        },

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

    return warranty;
};

// ============================================================================
// UPDATE WARRANTY
// ============================================================================

export const updateWarranty = async (
    warrantyId,
    warrantyData,
    userId = null,
) => {
    const authenticatedUserId = requireUserId(userId);

    if (!mongoose.Types.ObjectId.isValid(warrantyId)) {
        throw createServiceError("Invalid warranty ID.", 400);
    }

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    await assertCanEdit(warranty, authenticatedUserId);

    const data = normalizeWarrantyData(warrantyData);

    // Never change ownership/family/sharing through normal update.

    delete data.owner;

    delete data.family;

    delete data.sharing;

    if (Object.prototype.hasOwnProperty.call(data, "asset")) {
        data.asset = await resolveOwnedAsset(data.asset, authenticatedUserId);
    }

    Object.assign(warranty, data);

    await warranty.save();

    await warranty.populate("asset", "name brand category");

    return warranty;
};

// ============================================================================
// DELETE WARRANTY
// ============================================================================

export const deleteWarranty = async (warrantyId, userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    if (!mongoose.Types.ObjectId.isValid(warrantyId)) {
        throw createServiceError("Invalid warranty ID.", 400);
    }

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    assertOwner(warranty, authenticatedUserId);

    await warranty.deleteOne();

    return warranty;
};

// ============================================================================
// GET UPCOMING WARRANTIES
// ============================================================================

export const getUpcomingWarranties = async (userId = null, days = 30) => {
    const authenticatedUserId = requireUserId(userId);

    const normalizedDays = Number(days);

    if (!Number.isFinite(normalizedDays) || normalizedDays < 0) {
        throw createServiceError("Invalid days value.", 400);
    }

    const today = new Date();

    const futureDate = new Date();

    futureDate.setDate(futureDate.getDate() + normalizedDays);

    const query = await buildAccessQuery(authenticatedUserId);

    query.expiryDate = {
        $gte: today,

        $lte: futureDate,
    };

    return Warranty.find(query)

        .populate("asset", "name brand category")

        .populate("owner", "name email profileImage")

        .populate("family", "name")

        .sort({
            expiryDate: 1,
        })

        .lean();
};

// ============================================================================
// GET EXPIRED WARRANTIES
// ============================================================================

export const getExpiredWarranties = async (userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    const query = await buildAccessQuery(authenticatedUserId);

    query.expiryDate = {
        $lt: new Date(),
    };

    return Warranty.find(query)

        .populate("asset", "name brand category")

        .populate("owner", "name email profileImage")

        .sort({
            expiryDate: -1,
        })

        .lean();
};

// ============================================================================
// GET WARRANTY STATS
// ============================================================================

export const getWarrantyStats = async (userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    const query = await buildAccessQuery(authenticatedUserId);

    const warranties = await Warranty.find(query).lean();

    const now = new Date();

    const active = warranties.filter(
        (warranty) => warranty.expiryDate && new Date(warranty.expiryDate) >= now,
    );

    const expired = warranties.filter(
        (warranty) => warranty.expiryDate && new Date(warranty.expiryDate) < now,
    );

    const shared = warranties.filter(
        (warranty) => warranty.sharing?.shared === true,
    );

    return {
        total: warranties.length,

        active: active.length,

        expired: expired.length,

        shared: shared.length,
    };
};

// ============================================================================
// SHARE WARRANTY
// ============================================================================
//
// Owner only.
//
// Body:
//
// {
//     memberIds: [],
//     access: "View" | "Edit"
// }
//
// ============================================================================

export const shareWarranty = async (warrantyId, userId, data = {}) => {
    const authenticatedUserId = requireUserId(userId);

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    assertOwner(warranty, authenticatedUserId);

    const family = await getUserFamily(authenticatedUserId);

    if (!family) {
        throw createServiceError("You do not have a Family workspace.", 400);
    }

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    if (memberIds.length === 0) {
        throw createServiceError("Please select at least one family member.", 400);
    }

    const access = data.access === "Edit" ? "Edit" : "View";

    const validMembers = family.members.filter(
        (member) =>
            member.status === "Active" &&
            memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
    );

    if (validMembers.length === 0) {
        throw createServiceError("No valid family members were selected.", 400);
    }

    warranty.family = family._id;

    const existingMembers = warranty.sharing?.members || [];

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

    warranty.sharing = {
        shared: true,

        members: existingMembers,
    };

    await warranty.save();

    // --------------------------------------------------------------------
    // FAMILY ACTIVITY
    // --------------------------------------------------------------------

    family.activity.unshift({
        actor: authenticatedUserId,

        action: "WARRANTY_SHARED",

        entityType: "Warranty",

        entityId: warranty._id,

        message: `${warranty.title} was shared with family members.`,

        metadata: {
            memberIds: validMembers.map((member) => member.user),

            access,
        },

        createdAt: new Date(),
    });

    await family.save();

    return warranty;
};

// ============================================================================
// UNSHARE WARRANTY
// ============================================================================

export const unshareWarranty = async (warrantyId, userId, data = {}) => {
    const authenticatedUserId = requireUserId(userId);

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    assertOwner(warranty, authenticatedUserId);

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    if (memberIds.length === 0) {
        warranty.family = null;

        warranty.sharing = {
            shared: false,

            members: [],
        };
    } else {
        warranty.sharing.members = (warranty.sharing?.members || []).filter(
            (member) =>
                !memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
        );

        if (warranty.sharing.members.length === 0) {
            warranty.family = null;

            warranty.sharing.shared = false;
        }
    }

    await warranty.save();

    return warranty;
};

// ============================================================================
// UPDATE MEMBER PERMISSION
// ============================================================================

export const updateWarrantySharingPermission = async (
    warrantyId,
    userId,
    memberId,
    access,
) => {
    const authenticatedUserId = requireUserId(userId);

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    assertOwner(warranty, authenticatedUserId);

    if (!["View", "Edit"].includes(access)) {
        throw createServiceError("Invalid warranty access level.", 400);
    }

    const member = warranty.sharing?.members?.find(
        (item) => normalizeId(item.user) === normalizeId(memberId),
    );

    if (!member) {
        throw createServiceError(
            "This family member does not have access to the warranty.",
            404,
        );
    }

    member.access = access;

    await warranty.save();

    return warranty;
};

// ============================================================================
// REMOVE MEMBER ACCESS
// ============================================================================

export const removeWarrantyMemberAccess = async (
    warrantyId,
    userId,
    memberId,
) => {
    return unshareWarranty(
        warrantyId,

        userId,

        {
            memberIds: [memberId],
        },
    );
};

// ============================================================================
// GET FAMILY SHARED WARRANTIES
// ============================================================================

export const getFamilySharedWarranties = async (userId) => {
    const authenticatedUserId = requireUserId(userId);

    const family = await getUserFamily(authenticatedUserId);

    if (!family) {
        return [];
    }

    return Warranty.find({
        family: family._id,

        "sharing.shared": true,

        "sharing.members.user": authenticatedUserId,
    })

        .populate("asset", "name brand category")

        .populate("owner", "name email profileImage")

        .populate("sharing.members.user", "name email profileImage")

        .sort({
            expiryDate: 1,
        })

        .lean();
};

// ============================================================================
// GET WARRANTY ACCESS DETAILS
// ============================================================================

export const getWarrantyAccessDetails = async (warrantyId, userId) => {
    const authenticatedUserId = requireUserId(userId);

    const warranty = await Warranty.findById(warrantyId);

    if (!warranty) {
        throw createServiceError("Warranty not found.", 404);
    }

    const access = await getWarrantyAccess(warranty, authenticatedUserId);

    if (!access.canView) {
        throw createServiceError(
            "You do not have permission to view this warranty.",
            403,
        );
    }

    return {
        warrantyId: warranty._id,

        ...access,
    };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    createWarranty,

    getWarranties,

    getWarrantyById,

    updateWarranty,

    deleteWarranty,

    getUpcomingWarranties,

    getExpiredWarranties,

    getWarrantyStats,

    shareWarranty,

    unshareWarranty,

    updateWarrantySharingPermission,

    removeWarrantyMemberAccess,

    getFamilySharedWarranties,

    getWarrantyAccessDetails,
};
