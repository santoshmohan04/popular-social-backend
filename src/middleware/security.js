import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AppError } from "../utils/errors.js";

const defaultRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests, please try again later",
        429,
        "RATE_LIMIT_EXCEEDED"
      )
    );
  }
});

export function applySecurityMiddleware(app, allowedOrigins) {
  app.use(helmet());
  app.use(defaultRateLimiter);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(
          new AppError(
            "Origin not allowed by CORS policy",
            403,
            "CORS_FORBIDDEN"
          )
        );
      }
    })
  );
}
