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

- `GET /health`
- `GET /api/v1`
- `POST /api/v1/upload/image`
- `GET /api/v1/images/single?name=<filename>`
- `POST /api/v1/upload/post`
- `GET /api/v1/posts`
