export const buildAssetAccessDetails = (asset, userId, access) => {
    if (!userId) {
        const error = new Error("Authentication required.");
        error.statusCode = 401;
        throw error;
    }
    if (!access?.canView) {
        const error = new Error("Asset not found.");
        error.statusCode = 404;
        throw error;
    }

    return {
        assetId: String(asset._id),
        canView: true,
        canEdit: Boolean(access.canEdit),
        canDelete: Boolean(access.canDelete),
        isOwner: Boolean(access.isOwner),
        isFamilyMember: Boolean(access.isFamilyMember),
        shared: Boolean(asset.sharing?.shared),
        ...(access.isOwner ? {
            members: (asset.sharing?.members || []).map((member) => ({
                userId: member.user?._id ? String(member.user._id) : String(member.user),
                name: member.user?.name || "Family member",
                email: member.user?.email || "",
                access: member.access,
                sharedAt: member.sharedAt,
            })),
        } : {}),
    };
};

export default buildAssetAccessDetails;
