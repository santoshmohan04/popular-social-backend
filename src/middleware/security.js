import cors from "cors";
import helmet from "helmet";
import { AppError } from "../utils/errors.js";

export function applySecurityMiddleware(app, allowedOrigins) {
  app.use(helmet());

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new AppError("Origin not allowed by CORS policy", 403, "CORS_FORBIDDEN"));
      }
    })
  );
}
