import { env, validateEnv } from "./config/env.js";
import { logger } from "./config/logger.js";
import { createPusherClient } from "./config/pusher.js";
import { initializeDatabase } from "./config/database.js";
import { createUploadMiddleware } from "./middleware/upload.js";
import { createApp } from "./app.js";

export async function startServer() {
  validateEnv();

  const pusherClient = createPusherClient(env.pusher);
  const { gfs } = await initializeDatabase({
    connectionUrl: env.dbConn,
    pusherClient
  });

  const upload = createUploadMiddleware({
    connectionUrl: env.dbConn,
    maxUploadSizeMb: env.maxUploadSizeMb
  });

  const app = createApp({
    upload,
    getGfs: () => gfs,
    allowedOrigins: env.corsOrigins
  });

  app.listen(env.port, () => {
    logger.info(`Listening on localhost: ${env.port}`);
  });

  return app;
}
