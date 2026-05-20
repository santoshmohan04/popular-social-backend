import express from "express";
import bodyParser from "body-parser";
import { createV1Router } from "./routes/v1Routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { applySecurityMiddleware } from "./middleware/security.js";

export function createApp({
  upload,
  getBucket,
  getFilesCollection,
  allowedOrigins,
  getDbStatus
}) {
  const app = express();

  app.use(bodyParser.json());
  applySecurityMiddleware(app, allowedOrigins);

  app.get("/", (req, res) => {
    res.status(200).send("Hello TheWebDev");
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: "ok"
      }
    });
  });

  app.get("/ready", (req, res) => {
    const dbReady = getDbStatus ? getDbStatus() : false;
    if (!dbReady) {
      return res.status(503).json({
        success: false,
        error: {
          code: "NOT_READY",
          message: "Service is not ready"
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: "ready"
      }
    });
  });

  app.use(
    "/api/v1",
    createV1Router({
      upload,
      getBucket,
      getFilesCollection
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
