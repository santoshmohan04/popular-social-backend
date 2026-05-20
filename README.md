# popular-social-backend

Social App Backend.

## Setup

Create `.env` file with the following values:

- `DB_CONN=` // MongoDB connection URL
- `PUSHER_ID=` // Pusher ID
- `PUSHER_KEY=` // Pusher Key
- `PUSHER_SECRET=` // Pusher Secret
- `PUSHER_CLUSTER=ap2` // Optional
- `CORS_ORIGIN=http://localhost:3000` // Optional comma-separated allowlist
- `MAX_UPLOAD_SIZE_MB=10` // Optional

## Scripts

- `npm run start` - start production server
- `npm run dev` - start with nodemon
- `npm run lint` - run eslint
- `npm run format` - run prettier check
- `npm test` - run node test runner

## API

### Health

- `GET /health` — liveness check
- `GET /ready` — readiness check (returns 503 if DB is not connected)

### v1

- `GET /api/v1`
- `POST /api/v1/upload/image`
- `GET /api/v1/images/single?name=<filename>`
- `POST /api/v1/upload/post`
- `GET /api/v1/posts`

#### `GET /api/v1/posts` — query parameters

| Parameter | Type   | Default | Description                     |
| --------- | ------ | ------- | ------------------------------- |
| `page`    | number | `1`     | Page number (1-based)           |
| `limit`   | number | `20`    | Items per page (max 100)        |
| `sort`    | string | `desc`  | Sort direction: `asc` or `desc` |

Response includes a `pagination` envelope:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

#### `POST /api/v1/upload/post` — required body fields

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `user`    | string | ✅       |
| `text`    | string | ✅       |
| `imgName` | string | ❌       |
| `avatar`  | string | ❌       |
