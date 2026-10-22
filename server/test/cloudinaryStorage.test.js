import test from "node:test";
import assert from "node:assert/strict";
import { PassThrough, Readable } from "node:stream";
import { CloudinaryStorage } from "../src/middleware/cloudinaryStorage.js";

test("Cloudinary storage generates a safe ID and returns provider metadata", async () => {
    let options;
    const fakeCloudinary = {
        uploader: {
            upload_stream(uploadOptions, callback) {
                options = uploadOptions;
                const stream = new PassThrough();
                stream.on("finish", () => callback(null, {
                    secure_url: "https://res.cloudinary.com/example/document.pdf",
                    public_id: `${uploadOptions.folder}/${uploadOptions.public_id}`,
                    resource_type: "raw",
                    format: "pdf",
                    bytes: 12,
                }));
                return stream;
            },
            destroy: async () => ({ result: "ok" }),
        },
    };
    const storage = new CloudinaryStorage({ cloudinary: fakeCloudinary });
    const file = { stream: Readable.from([Buffer.from("test")]), originalname: "name&unsafe.pdf" };
    const stored = await new Promise((resolve, reject) => {
        storage._handleFile({}, file, (error, result) => error ? reject(error) : resolve(result));
    });

    assert.equal(options.resource_type, "auto");
    assert.equal(options.folder, "everkeep/documents");
    assert.match(options.public_id, /^[0-9a-f-]{36}$/i);
    assert.equal(stored.resource_type, "raw");
    assert.equal(stored.size, 12);
    assert.equal(stored.path, "https://res.cloudinary.com/example/document.pdf");
});

test("Cloudinary cleanup preserves the uploaded resource type", async () => {
    let destroyed;
    const fakeCloudinary = {
        uploader: {
            upload_stream: () => new PassThrough(),
            async destroy(publicId, options) {
                destroyed = { publicId, options };
                return { result: "ok" };
            },
        },
    };
    const storage = new CloudinaryStorage({ cloudinary: fakeCloudinary });

    await new Promise((resolve, reject) => {
        storage._removeFile({}, { public_id: "folder/id", resource_type: "raw" }, (error) => error ? reject(error) : resolve());
    });

    assert.deepEqual(destroyed, { publicId: "folder/id", options: { resource_type: "raw" } });
});
