import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

function createTestApp(getDbStatus = () => true) {
  const upload = {
    single: () => (req, res, next) => next()
  };

  return createApp({
    upload,
    getBucket: () => null,
    getFilesCollection: () => null,
    allowedOrigins: ["http://localhost:3000"],
    getDbStatus
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

test("GET /ready returns ready when DB is up", async () => {
  const response = await request(createTestApp(() => true)).get("/ready");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    data: { status: "ready" }
  });
});

test("GET /ready returns 503 when DB is not connected", async () => {
  const response = await request(createTestApp(() => false)).get("/ready");

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "NOT_READY");
});

test("GET /nonexistent returns 404 with error envelope", async () => {
  const response = await request(createTestApp()).get("/nonexistent");

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "NOT_FOUND");
});

test("POST /api/v1/upload/post returns 400 when body is missing required fields", async () => {
  const response = await request(createTestApp())
    .post("/api/v1/upload/post")
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("POST /api/v1/upload/post returns 400 when user field is missing", async () => {
  const response = await request(createTestApp())
    .post("/api/v1/upload/post")
    .send({ text: "hello" });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("POST /api/v1/upload/post returns 400 when text field is missing", async () => {
  const response = await request(createTestApp())
    .post("/api/v1/upload/post")
    .send({ user: "alice" });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});
