import test from "node:test";
import assert from "node:assert/strict";
import { buildAssetSearchFilter } from "../src/services/asset.service.js";

const baseFamily = (user, permissions = {}) => ({
    _id: "family-1",
    owner: "owner-1",
    members: [{ user, status: "Active", permissions }],
});

test("asset search scopes shared results to active members with asset permission", () => {
    const query = buildAssetSearchFilter("member-1", baseFamily("member-1"), "laptop");
    assert.equal(query.$or.length, 2);
    assert.deepEqual(query.$or[1], {
        family: "family-1",
        "sharing.shared": true,
        "sharing.members.user": "member-1",
    });
});

test("asset search excludes family assets when the member has no asset permission", () => {
    const query = buildAssetSearchFilter("member-1", baseFamily("member-1", { assets: false }), "laptop");
    assert.deepEqual(query.$or, [{ owner: "member-1" }]);
});

test("asset search treats search terms literally instead of as regular expressions", () => {
    const query = buildAssetSearchFilter("user-1", null, "[laptop].*");
    const expression = query.$and[0].$or[0].name;
    assert.equal(expression.test("[laptop].*"), true);
    assert.equal(expression.test("laptop-anything"), false);
});
