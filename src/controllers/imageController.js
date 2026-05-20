import { AppError } from "../utils/errors.js";
import { successResponse } from "../utils/responses.js";

export function createUploadImageHandler(upload) {
  return [
    upload.single("file"),
    (req, res) => {
      res.status(201).json(successResponse(req.file));
    }
  ];
}

export function createGetSingleImageHandler(getGfs) {
  return (req, res, next) => {
    const gfs = getGfs();
    if (!gfs) {
      next(new AppError("Image store is unavailable", 503, "IMAGE_STORE_UNAVAILABLE"));
      return;
    }

    gfs.files.findOne({ filename: req.query.name }, (err, file) => {
      if (err) {
        next(err);
        return;
      }

      if (!file) {
        next(new AppError("file not found", 404, "FILE_NOT_FOUND"));
        return;
      }

      const readstream = gfs.createReadStream(file.filename);
      readstream.on("error", (streamError) => next(streamError));
      readstream.pipe(res);
    });
  };
}
