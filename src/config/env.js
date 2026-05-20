import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["DB_CONN", "PUSHER_ID", "PUSHER_KEY", "PUSHER_SECRET"];

export function validateEnv() {
  const missingVariables = requiredVariables.filter((key) => !process.env[key]);
  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
}

function parseOrigins(value) {
  if (!value) {
    return ["http://localhost:3000"];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 9000),
  dbConn: process.env.DB_CONN,
  pusher: {
    appId: process.env.PUSHER_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || "ap2"
  },
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 10)
};
