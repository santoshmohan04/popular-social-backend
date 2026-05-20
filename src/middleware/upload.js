import multer from "multer";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

export function createUploadMiddleware({ maxUploadSizeMb }) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxUploadSizeMb * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.has(file.mimetype)) {
        cb(null, true);
        return;
      }

      cb(new Error("Unsupported file type"));
    }
  });
}
