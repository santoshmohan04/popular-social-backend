# App Context: Backend Modernization (popular-social-backend)

## 1) Current application context (as-is)
- Runtime: Node.js backend with Express-style API (`server.js`).
- Data layer: MongoDB + Mongoose.
- File storage: GridFS (`multer-gridfs-storage`, `gridfs-stream`) for image uploads.
- Realtime: Pusher event trigger on MongoDB change stream.
- Model: Single `posts` model (`postModel.js`) with basic schema fields.
- API style: Minimal REST endpoints for upload/read posts and images.
- Project hygiene gaps:
  - No visible `package.json` in repository (dependency lock file exists).
  - No test setup, lint config, formatter config, or CI definitions in repo.
  - No API contract/spec (OpenAPI), versioning, or formal error format.

---

## 2) Modernization goals
- Upgrade backend to current Node.js and API engineering standards.
- Make APIs frontend-ready for modern apps (web/mobile, typed clients, pagination, auth, realtime).
- Improve maintainability, reliability, and security.
- Enable developer velocity through standards, tooling, and documentation.

---

## 3) Recommended framework direction

### Option A (recommended): **NestJS + TypeScript**
Best for long-term scaling and maintainability.
- Built-in modular architecture (controllers/services/modules).
- First-class validation, DI, guards/interceptors, and testing patterns.
- Easy OpenAPI generation and strong TypeScript contracts.
- Works with Mongoose or Prisma.

### Option B: **Express + TypeScript (incremental path)**
Best for minimal disruption and gradual migration.
- Keep current Express style but enforce modern standards.
- Add structured layers (routes/controllers/services/repositories).
- Add validation, typed DTOs, OpenAPI, test and CI standards.

---

## 4) Backend capabilities needed for modern frontend apps

### Core API patterns
- API versioning (`/api/v1/...`).
- Cursor-based pagination + filtering + sorting for feed endpoints.
- Consistent response envelope and error schema.
- Idempotency support for mutation endpoints where relevant.
- Contract-first APIs with OpenAPI/Swagger.

### Authentication & identity
- JWT-based auth (access + refresh token strategy).
- Social auth readiness (Google/Apple/etc.) if required by product.
- Role/permission model (RBAC) for admin/moderation.
- Secure password storage and account recovery flows.

### Social/feed APIs to add or improve
- User profile CRUD.
- Follow/unfollow relationships.
- Post CRUD with media metadata.
- Likes/reactions.
- Comments and threaded replies.
- Save/bookmark/share actions.
- Notifications API (read/unread, pagination).
- Search (users/posts/tags).
- Hashtags/topics.
- Moderation/reporting endpoints.

### Realtime & async
- Realtime feed/notification updates via WebSocket (or keep Pusher with cleaner event contracts).
- Background jobs for media processing, notifications, and fan-out.
- Queue infrastructure (BullMQ + Redis or equivalent).

---

## 5) Engineering standards to adopt

### Code quality
- TypeScript strict mode.
- ESLint + Prettier + import/order rules.
- Conventional commit conventions.
- Clear folder structure by domain/module.

### Validation & contracts
- Request/response DTO validation (`zod` / `class-validator`).
- OpenAPI spec generation and publishing.
- Typed API clients for frontend consumption.

### Observability
- Structured logging (Pino/Winston) with request correlation IDs.
- Metrics + health endpoints (`/health`, `/ready`).
- Centralized error tracking (e.g., Sentry).

### Security best practices
- Helmet, CORS allowlist, input sanitization, and rate limiting.
- Auth hardening (token expiry, rotation, revoke strategy).
- Secrets via environment management (no secrets in code).
- Dependency scanning + SAST + audit in CI.
- File upload hardening (MIME checks, size limits, antivirus scanning if needed).

### Performance & reliability
- DB indexing strategy for feed and lookup patterns.
- Caching strategy (Redis) for hot reads.
- Proper timeout/retry/circuit-breaker for external calls.
- Graceful shutdown and process management.

---

## 6) Data and storage modernization
- Evolve current `posts` schema:
  - Use proper timestamp types (ISO 8601 format) instead of plain string.
  - Add ownership fields, status/moderation fields, and metadata.
- Consider media strategy:
  - Keep GridFS short-term, evaluate object storage (S3/GCS) for scale.
- Add migrations/seed strategy for schema evolution.

---

## 7) Suggested target architecture
- `src/modules/*` domain modules (users, auth, posts, comments, notifications).
- `src/common/*` shared concerns (errors, middleware, config, logging).
- `src/infrastructure/*` db, queue, cache, storage adapters.
- `tests/*` unit, integration, and API contract tests.
- Config by environment with schema validation.

---

## 8) Delivery roadmap (phased)

### Phase 1: Foundation
- Recreate missing project manifest and scripts (`package.json`).
- Standardize Node version and environment config.
- Add lint, format, and test baseline.
- Introduce TypeScript and folder structure.
- Add API versioning and centralized error handling.

### Phase 2: API modernization
- Implement auth/token flow and protected routes.
- Introduce DTO validation and OpenAPI docs.
- Add pagination/filter/sort standards across list endpoints.
- Implement consistent response/error contracts.

### Phase 3: Social features for frontend
- Build likes/comments/follows/notifications/search APIs.
- Improve post/media lifecycle and moderation endpoints.
- Add realtime strategy and async jobs.

### Phase 4: Production readiness
- CI/CD gates (lint, test, security scan).
- Monitoring/alerts/logging maturity.
- Load/performance testing and optimization.

---

## 9) Definition of done for “latest standards”
- Type-safe codebase with validated API contracts.
- Secure-by-default API middleware and auth flows.
- Automated lint/test/security checks in CI.
- Documented, versioned APIs consumable by modern frontend clients.
- Observability and operational readiness in place.
