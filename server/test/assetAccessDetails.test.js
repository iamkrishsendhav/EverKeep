import test from "node:test";
import assert from "node:assert/strict";
import { buildAssetAccessDetails } from "../src/services/assetAccessDetails.js";

const asset = {
    _id: "asset-1",
    sharing: {
        shared: true,
        members: [{
            user: { _id: "member-1", name: "Alex", email: "alex@example.test" },
            access: "View",
            sharedAt: new Date("2025-01-01T00:00:00Z"),
        }],
    },
};

test("asset owner sees member access details", () => {
    const result = buildAssetAccessDetails(asset, "owner-1", {
        canView: true, canEdit: true, canDelete: true, isOwner: true, isFamilyMember: false,
    });
    assert.equal(result.isOwner, true);
    assert.equal(result.members[0].userId, "member-1");
    assert.equal(result.members[0].access, "View");
});

test("authorized shared user sees only their own capability summary", () => {
    const result = buildAssetAccessDetails(asset, "member-1", {
        canView: true, canEdit: false, canDelete: false, isOwner: false, isFamilyMember: true,
    });
    assert.equal(result.canView, true);
    assert.equal(result.canEdit, false);
    assert.equal("members" in result, false);
});

test("unrelated user cannot inspect asset access", () => {
    assert.throws(
        () => buildAssetAccessDetails(asset, "unrelated-user", {
            canView: false, canEdit: false, canDelete: false, isOwner: false, isFamilyMember: false,
        }),
        { statusCode: 404 },
    );
});

test("unauthenticated user cannot inspect asset access", () => {
    assert.throws(() => buildAssetAccessDetails(asset, null, null), { statusCode: 401 });
});
