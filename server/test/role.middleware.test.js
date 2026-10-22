import test from "node:test";
import assert from "node:assert/strict";
import { requireAdmin } from "../src/middleware/role.middleware.js";

const runMiddleware = (middleware, user) => {
    const result = { status: null, body: null, nextCalled: false };
    const req = { user };
    const res = {
        status(code) {
            result.status = code;
            return this;
        },
        json(body) {
            result.body = body;
            return this;
        },
    };
    middleware(req, res, () => { result.nextCalled = true; });
    return result;
};

test("admin maintenance permission allows an admin", () => {
    const result = runMiddleware(requireAdmin, { role: "admin" });
    assert.equal(result.nextCalled, true);
    assert.equal(result.status, null);
});

test("admin maintenance permission rejects an ordinary user", () => {
    const result = runMiddleware(requireAdmin, { role: "user" });
    assert.equal(result.nextCalled, false);
    assert.equal(result.status, 403);
    assert.equal(result.body.success, false);
});

test("admin maintenance permission rejects unauthenticated requests", () => {
    const result = runMiddleware(requireAdmin, null);
    assert.equal(result.nextCalled, false);
    assert.equal(result.status, 401);
});
