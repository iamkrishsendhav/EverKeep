import mongoose from "mongoose";

// ============================================================================
// FAMILY MODEL
// ============================================================================
//
// EverKeep Family Workspace
//
// A Family contains:
// - Owner
// - Family members
// - Invitations
// - Member permissions
// - Shared asset references
// - Shared subscription references
// - Shared document references
// - Shared warranty references
// - Family activity
// - Family notifications
// - Family settings
//
// IMPORTANT:
// Existing Asset, Subscription, Document and Warranty models are NOT replaced.
// Family only stores the relationship between those resources and the family.
//
// ============================================================================

// ============================================================================
// PERMISSION SCHEMA
// ============================================================================

const permissionSchema = new mongoose.Schema(
    {
        assets: {
            type: Boolean,
            default: true,
        },

        subscriptions: {
            type: Boolean,
            default: true,
        },

        warranties: {
            type: Boolean,
            default: true,
        },

        documents: {
            type: Boolean,
            default: false,
        },

        calendar: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: false,
    },
);

// ============================================================================
// NOTIFICATION PREFERENCE SCHEMA
// ============================================================================

const notificationPreferenceSchema = new mongoose.Schema(
    {
        renewals: {
            type: Boolean,
            default: true,
        },

        warrantyExpiry: {
            type: Boolean,
            default: true,
        },

        insuranceExpiry: {
            type: Boolean,
            default: true,
        },

        activity: {
            type: Boolean,
            default: true,
        },

        familyUpdates: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: false,
    },
);

// ============================================================================
// FAMILY MEMBER SCHEMA
// ============================================================================

const familyMemberSchema = new mongoose.Schema(
    {
        // --------------------------------------------------------------------
        // USER
        // --------------------------------------------------------------------

        user: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        // --------------------------------------------------------------------
        // FAMILY ROLE
        // --------------------------------------------------------------------

        role: {
            type: String,

            enum: ["Owner", "Admin", "Member", "Viewer"],

            default: "Member",
        },

        // --------------------------------------------------------------------
        // RELATIONSHIP
        // --------------------------------------------------------------------

        relationship: {
            type: String,

            trim: true,

            maxlength: 50,

            default: "Family",
        },

        // --------------------------------------------------------------------
        // MEMBER STATUS
        // --------------------------------------------------------------------

        status: {
            type: String,

            enum: ["Active", "Pending", "Suspended"],

            default: "Active",
        },

        // --------------------------------------------------------------------
        // ACCESS LEVEL
        // --------------------------------------------------------------------

        accessLevel: {
            type: String,

            enum: ["Full", "Limited", "ViewOnly"],

            default: "Limited",
        },

        // --------------------------------------------------------------------
        // PERMISSIONS
        // --------------------------------------------------------------------

        permissions: {
            type: permissionSchema,

            default: () => ({}),
        },

        // --------------------------------------------------------------------
        // NOTIFICATION PREFERENCES
        // --------------------------------------------------------------------

        notifications: {
            type: notificationPreferenceSchema,

            default: () => ({}),
        },

        // --------------------------------------------------------------------
        // JOIN DATE
        // --------------------------------------------------------------------

        joinedAt: {
            type: Date,

            default: Date.now,
        },

        // --------------------------------------------------------------------
        // LAST ACTIVITY
        // --------------------------------------------------------------------

        lastActiveAt: {
            type: Date,

            default: null,
        },
    },

    {
        _id: true,
    },
);

// ============================================================================
// INVITATION SCHEMA
// ============================================================================

const invitationSchema = new mongoose.Schema(
    {
        // --------------------------------------------------------------------
        // INVITED EMAIL
        // --------------------------------------------------------------------

        email: {
            type: String,

            required: true,

            trim: true,

            lowercase: true,
        },

        // --------------------------------------------------------------------
        // INVITED BY
        // --------------------------------------------------------------------

        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        // --------------------------------------------------------------------
        // ROLE
        // --------------------------------------------------------------------

        role: {
            type: String,

            enum: ["Admin", "Member", "Viewer"],

            default: "Member",
        },

        // --------------------------------------------------------------------
        // RELATIONSHIP
        // --------------------------------------------------------------------

        relationship: {
            type: String,

            trim: true,

            maxlength: 50,

            default: "Family",
        },

        // --------------------------------------------------------------------
        // ACCESS LEVEL
        // --------------------------------------------------------------------

        accessLevel: {
            type: String,

            enum: ["Full", "Limited", "ViewOnly"],

            default: "Limited",
        },

        // --------------------------------------------------------------------
        // PERMISSIONS
        // --------------------------------------------------------------------

        permissions: {
            type: permissionSchema,

            default: () => ({}),
        },

        // --------------------------------------------------------------------
        // NOTIFICATION PREFERENCES
        // --------------------------------------------------------------------

        notifications: {
            type: notificationPreferenceSchema,

            default: () => ({}),
        },

        // --------------------------------------------------------------------
        // INVITATION TOKEN
        // --------------------------------------------------------------------

        token: {
            type: String,

            required: true,

            unique: true,
        },

        // --------------------------------------------------------------------
        // EXPIRY
        // --------------------------------------------------------------------

        expiresAt: {
            type: Date,

            required: true,
        },

        // --------------------------------------------------------------------
        // STATUS
        // --------------------------------------------------------------------

        status: {
            type: String,

            enum: ["Pending", "Accepted", "Expired", "Cancelled"],

            default: "Pending",
        },

        // --------------------------------------------------------------------
        // ACCEPTED AT
        // --------------------------------------------------------------------

        acceptedAt: {
            type: Date,

            default: null,
        },
    },

    {
        timestamps: true,
    },
);

// ============================================================================
// ACTIVITY SCHEMA
// ============================================================================
//
// Stores important family-level actions.
//
// Examples:
// - Member invited
// - Member joined
// - Asset shared
// - Subscription shared
// - Document shared
// - Permission changed
// - Notification preference changed
//
// ============================================================================

const activitySchema = new mongoose.Schema(
    {
        // --------------------------------------------------------------------
        // ACTOR
        // --------------------------------------------------------------------

        actor: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        // --------------------------------------------------------------------
        // ACTION
        // --------------------------------------------------------------------

        action: {
            type: String,

            required: true,

            trim: true,

            maxlength: 100,
        },

        // --------------------------------------------------------------------
        // ENTITY TYPE
        // --------------------------------------------------------------------

        entityType: {
            type: String,

            enum: [
                "Family",
                "Member",
                "Asset",
                "Subscription",
                "Document",
                "Warranty",
                "Calendar",
                "Notification",
            ],

            default: "Family",
        },

        // --------------------------------------------------------------------
        // ENTITY ID
        // --------------------------------------------------------------------

        entityId: {
            type: mongoose.Schema.Types.ObjectId,

            default: null,
        },

        // --------------------------------------------------------------------
        // MESSAGE
        // --------------------------------------------------------------------

        message: {
            type: String,

            required: true,

            trim: true,

            maxlength: 300,
        },

        // --------------------------------------------------------------------
        // ADDITIONAL DATA
        // --------------------------------------------------------------------

        metadata: {
            type: mongoose.Schema.Types.Mixed,

            default: {},
        },

        // --------------------------------------------------------------------
        // CREATED AT
        // --------------------------------------------------------------------

        createdAt: {
            type: Date,

            default: Date.now,
        },
    },

    {
        _id: true,
    },
);

// ============================================================================
// NOTIFICATION SCHEMA
// ============================================================================
//
// Family-specific notifications.
//
// Examples:
// - Netflix renews in 3 days
// - Warranty expires in 7 days
// - Insurance expires in 14 days
// - New family member joined
// - New shared asset
//
// ============================================================================

const notificationSchema = new mongoose.Schema(
    {
        // --------------------------------------------------------------------
        // RECIPIENT
        // --------------------------------------------------------------------

        recipient: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        // --------------------------------------------------------------------
        // NOTIFICATION TYPE
        // --------------------------------------------------------------------

        type: {
            type: String,

            enum: [
                "SubscriptionRenewal",
                "WarrantyExpiry",
                "InsuranceExpiry",
                "FamilyInvitation",
                "FamilyActivity",
                "PermissionChanged",
                "AssetShared",
                "DocumentShared",
                "System",
            ],

            required: true,
        },

        // --------------------------------------------------------------------
        // TITLE
        // --------------------------------------------------------------------

        title: {
            type: String,

            required: true,

            trim: true,

            maxlength: 150,
        },

        // --------------------------------------------------------------------
        // MESSAGE
        // --------------------------------------------------------------------

        message: {
            type: String,

            required: true,

            trim: true,

            maxlength: 500,
        },

        // --------------------------------------------------------------------
        // ENTITY TYPE
        // --------------------------------------------------------------------

        entityType: {
            type: String,

            enum: [
                "Asset",
                "Subscription",
                "Warranty",
                "Document",
                "Family",
                "Member",
                "Calendar",
                "System",
            ],

            default: "Family",
        },

        // --------------------------------------------------------------------
        // ENTITY ID
        // --------------------------------------------------------------------

        entityId: {
            type: mongoose.Schema.Types.ObjectId,

            default: null,
        },

        // --------------------------------------------------------------------
        // READ STATUS
        // --------------------------------------------------------------------

        read: {
            type: Boolean,

            default: false,
        },

        // --------------------------------------------------------------------
        // READ TIME
        // --------------------------------------------------------------------

        readAt: {
            type: Date,

            default: null,
        },

        // --------------------------------------------------------------------
        // CREATED AT
        // --------------------------------------------------------------------

        createdAt: {
            type: Date,

            default: Date.now,
        },
    },

    {
        _id: true,
    },
);

// ============================================================================
// FAMILY SETTINGS SCHEMA
// ============================================================================

const familySettingsSchema = new mongoose.Schema(
    {
        // --------------------------------------------------------------------
        // RENEWAL ALERTS
        // --------------------------------------------------------------------

        renewalAlerts: {
            type: Boolean,

            default: true,
        },

        // --------------------------------------------------------------------
        // WARRANTY ALERTS
        // --------------------------------------------------------------------

        warrantyAlerts: {
            type: Boolean,

            default: true,
        },

        // --------------------------------------------------------------------
        // INSURANCE ALERTS
        // --------------------------------------------------------------------

        insuranceAlerts: {
            type: Boolean,

            default: true,
        },

        // --------------------------------------------------------------------
        // ACTIVITY ALERTS
        // --------------------------------------------------------------------

        activityAlerts: {
            type: Boolean,

            default: true,
        },

        // --------------------------------------------------------------------
        // MEMBER UPDATE ALERTS
        // --------------------------------------------------------------------

        memberUpdateAlerts: {
            type: Boolean,

            default: true,
        },
    },

    {
        _id: false,
    },
);

// ============================================================================
// MAIN FAMILY SCHEMA
// ============================================================================

const familySchema = new mongoose.Schema(
    {
        // =====================================================================
        // FAMILY BASIC INFORMATION
        // =====================================================================

        name: {
            type: String,

            required: [true, "Family name is required"],

            trim: true,

            maxlength: 100,

            default: "My Family",
        },

        // =====================================================================
        // FAMILY OWNER
        // =====================================================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: [true, "Family owner is required"],

            unique: true,

            index: true,
        },

        // =====================================================================
        // FAMILY MEMBERS
        // =====================================================================

        members: {
            type: [familyMemberSchema],

            default: [],
        },

        // =====================================================================
        // FAMILY INVITATIONS
        // =====================================================================

        invitations: {
            type: [invitationSchema],

            default: [],
        },

        // =====================================================================
        // FAMILY ACTIVITY
        // =====================================================================

        activity: {
            type: [activitySchema],

            default: [],
        },

        // =====================================================================
        // FAMILY NOTIFICATIONS
        // =====================================================================

        notifications: {
            type: [notificationSchema],

            default: [],
        },

        // =====================================================================
        // FAMILY SETTINGS
        // =====================================================================

        settings: {
            type: familySettingsSchema,

            default: () => ({}),
        },

        // =====================================================================
        // FAMILY STATUS
        // =====================================================================

        status: {
            type: String,

            enum: ["Active", "Archived"],

            default: "Active",

            index: true,
        },
    },

    {
        timestamps: true,
    },
);

// ============================================================================
// INDEXES
// ============================================================================

// Find active families quickly.
familySchema.index({
    owner: 1,
    status: 1,
});

// Search pending invitations efficiently.
familySchema.index({
    "invitations.email": 1,
    "invitations.status": 1,
});

// Find notifications for a specific user.
familySchema.index({
    "notifications.recipient": 1,
    "notifications.read": 1,
});

// Sort activity efficiently.
familySchema.index({
    "activity.createdAt": -1,
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Check whether a user belongs to this family.
 */
familySchema.methods.hasMember = function (userId) {
    const id = userId?.toString();

    if (!id) {
        return false;
    }

    if (this.owner && this.owner.toString() === id) {
        return true;
    }

    return this.members.some(
        (member) => member.user && member.user.toString() === id,
    );
};

/**
 * Get a specific family member.
 */
familySchema.methods.getMember = function (userId) {
    const id = userId?.toString();

    if (!id) {
        return null;
    }

    return (
        this.members.find(
            (member) => member.user && member.user.toString() === id,
        ) || null
    );
};

/**
 * Check whether a user is the family owner.
 */
familySchema.methods.isOwner = function (userId) {
    if (!userId || !this.owner) {
        return false;
    }

    return this.owner.toString() === userId.toString();
};

// ============================================================================
// MODEL
// ============================================================================

const Family = mongoose.model("Family", familySchema);

export default Family;
