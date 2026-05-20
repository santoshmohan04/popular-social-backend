import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

function createTestApp() {
  const upload = {
    single: () => (req, res, next) => next()
  };

  return createApp({
    upload,
    getBucket: () => null,
    getFilesCollection: () => null,
    allowedOrigins: ["http://localhost:3000"]
  });
}

test("GET /health returns service health payload", async () => {
  const response = await request(createTestApp()).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: {
      status: "ok"
    }
  });
});

test("GET /api/v1 returns versioned hello payload", async () => {
  const response = await request(createTestApp()).get("/api/v1");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data, "Hello TheWebDev");
});
