import express from "express";
import { createUploadImageHandler, createGetSingleImageHandler } from "../controllers/imageController.js";
import { getPosts, uploadPost } from "../controllers/postController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export function createV1Router({ upload, getBucket, getFilesCollection }) {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      data: "Hello TheWebDev"
    });
  });

  router.post("/upload/image", ...createUploadImageHandler(upload, getBucket));
  router.get("/images/single", createGetSingleImageHandler(getBucket, getFilesCollection));
  router.post("/upload/post", asyncHandler(uploadPost));
  router.get("/posts", asyncHandler(getPosts));

  return router;
}
