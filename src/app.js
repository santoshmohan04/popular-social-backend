import express from "express";
import bodyParser from "body-parser";
import { createV1Router } from "./routes/v1Routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";

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
    res.status(200).send(`
      <html>
        <head>
          <title>popular-social-backend</title>
          <style>body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:24px}</style>
        </head>
        <body>
          <h1>popular-social-backend</h1>
          <p>Lightweight social backend providing posts, image uploads and realtime events.</p>
          <ul>
            <li><a href="/docs">Interactive API documentation (Swagger)</a></li>
            <li><a href="/health">/health</a> — liveness check</li>
            <li><a href="/ready">/ready</a> — readiness check (503 if DB not connected)</li>
            <li><a href="/api/v1">/api/v1</a> — API root</li>
          </ul>
          <p>See <em>README.md</em> for setup instructions. Server running on port ${process.env.PORT || 9000}.</p>
        </body>
      </html>
    `);
  });

  // Swagger UI
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
