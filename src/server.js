import mongoose from "mongoose";
import { env, validateEnv } from "./config/env.js";
import { logger } from "./config/logger.js";
import { createPusherClient } from "./config/pusher.js";
import { initializeDatabase } from "./config/database.js";
import { createUploadMiddleware } from "./middleware/upload.js";
import { createApp } from "./app.js";

export async function startServer() {
  validateEnv();

  const pusherClient = createPusherClient(env.pusher);
  const { bucket, filesCollection } = await initializeDatabase({
    connectionUrl: env.dbConn,
    pusherClient
  });

  const upload = createUploadMiddleware({
    maxUploadSizeMb: env.maxUploadSizeMb
  });

  const app = createApp({
    upload,
    getBucket: () => bucket,
    getFilesCollection: () => filesCollection,
    allowedOrigins: env.corsOrigins,
    getDbStatus: () => mongoose.connection.readyState === 1
  });

  const server = app.listen(env.port, () => {
    logger.info(`Listening on localhost: ${env.port}`);
  });

  function shutdown(signal) {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        logger.info("DB connection closed");
      } catch (err) {
        logger.error("Error closing DB connection", { error: err.message });
      }

      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000).unref();
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  return app;
}
