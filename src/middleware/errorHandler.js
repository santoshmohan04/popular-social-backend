import { errorResponse } from "../utils/responses.js";
import { logger } from "../config/logger.js";

export function notFoundHandler(req, res) {
  res.status(404).json(errorResponse("Route not found", "NOT_FOUND"));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "Unexpected error";

  logger.error("Request failed", {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    code,
    message
  });

  if (next) {
    // no-op to satisfy middleware signature for linters
  }

  res.status(statusCode).json(errorResponse(message, code));
}
