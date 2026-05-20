import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import path from "node:path";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function createUploadMiddleware({ connectionUrl, maxUploadSizeMb }) {
  const storage = new GridFsStorage({
    url: connectionUrl,
    file: (req, file) => {
      return new Promise((resolve) => {
        const filename = `image-${Date.now()}${path.extname(file.originalname)}`;
        resolve({
          filename,
          bucketName: "images"
        });
      });
    }
  });

  return multer({
    storage,
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
