import test from "node:test";
import assert from "node:assert/strict";
import { createOneTimeToken, hashOneTimeToken } from "../src/services/authToken.service.js";

test("one-time tokens are high entropy and only their SHA-256 hash is stored", () => {
    const first = createOneTimeToken();
    const second = createOneTimeToken();
    assert.equal(first.token.length, 43);
    assert.notEqual(first.token, first.hash);
    assert.equal(first.hash, hashOneTimeToken(first.token));
    assert.notEqual(first.hash, second.hash);
});
