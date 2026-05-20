import { AppError } from "../utils/errors.js";

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues ?? result.error.errors ?? [];
      const message = issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return next(new AppError(message, 400, "VALIDATION_ERROR"));
    }

    req.body = result.data;
    next();
  };
}
