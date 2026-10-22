import test from "node:test";
import assert from "node:assert/strict";
import { validateEnvironment } from "../src/config/validateEnv.js";

const validEnvironment = {
    NODE_ENV: "test",
    MONGODB_URI: "mongodb://127.0.0.1:27017/everkeep",
    JWT_SECRET: "test-secret-with-at-least-32-characters",
    CLIENT_URL: "http://localhost:5173",
};

test("environment validation accepts required values and valid optional pairs", () => {
    assert.doesNotThrow(() => validateEnvironment(validEnvironment));
});

test("environment validation rejects a short JWT secret", () => {
    assert.throws(
        () => validateEnvironment({ ...validEnvironment, JWT_SECRET: "too-short" }),
        /JWT_SECRET must contain at least 32 characters/,
    );
});

test("production requires an explicit frontend origin", () => {
    assert.throws(
        () => validateEnvironment({ ...validEnvironment, NODE_ENV: "production", CLIENT_URL: "" }),
        /CLIENT_URL must be configured in production/,
    );
});

test("partial Cloudinary credentials are rejected", () => {
    assert.throws(
        () => validateEnvironment({ ...validEnvironment, CLOUDINARY_API_KEY: "placeholder" }),
        /Cloudinary configuration requires/,
    );
});

test("partial Twilio credentials are rejected", () => {
    assert.throws(
        () => validateEnvironment({ ...validEnvironment, TWILIO_ACCOUNT_SID: "placeholder" }),
        /Twilio configuration requires/,
    );
});
