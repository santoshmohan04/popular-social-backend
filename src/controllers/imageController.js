import { AppError } from "../utils/errors.js";
import { successResponse } from "../utils/responses.js";

function streamUploadToGridFs({ file, bucket }) {
  return new Promise((resolve, reject) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve({
        id: uploadStream.id,
        filename: uploadStream.filename,
        bucketName: "images",
        size: file.size,
        mimetype: file.mimetype
      });
    });

    uploadStream.end(file.buffer);
  });
}

export function createUploadImageHandler(upload, getBucket) {
  return [
    upload.single("file"),
    async (req, res, next) => {
      try {
        const bucket = getBucket();
        if (!bucket) {
          throw new AppError("Image store is unavailable", 503, "IMAGE_STORE_UNAVAILABLE");
        }

        if (!req.file) {
          throw new AppError("File is required", 400, "FILE_REQUIRED");
        }

        const uploadedFile = await streamUploadToGridFs({
          file: req.file,
          bucket
        });

        res.status(201).json(successResponse(uploadedFile));
      } catch (error) {
        next(error);
      }
    }
  ];
}

export function createGetSingleImageHandler(getBucket, getFilesCollection) {
  return async (req, res, next) => {
    try {
      const bucket = getBucket();
      const filesCollection = getFilesCollection();

      if (!bucket || !filesCollection) {
        throw new AppError("Image store is unavailable", 503, "IMAGE_STORE_UNAVAILABLE");
      }

      const file = await filesCollection.findOne({ filename: req.query.name });

      if (!file) {
        throw new AppError("File not found", 404, "FILE_NOT_FOUND");
      }

      res.setHeader("Content-Type", file.contentType || "application/octet-stream");
      const readstream = bucket.openDownloadStreamByName(file.filename);
      readstream.on("error", (streamError) => next(streamError));
      readstream.pipe(res);
    } catch (error) {
      next(error);
    }
  };
}
