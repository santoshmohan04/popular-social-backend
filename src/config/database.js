import mongoose from "mongoose";
import { logger } from "./logger.js";

export async function initializeDatabase({ connectionUrl, pusherClient }) {
  await mongoose.connect(connectionUrl);
  logger.info("DB connected for pusher");

  const changeStream = mongoose.connection.collection("posts").watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusherClient
        .trigger("posts", "inserted", { change })
        .catch((error) =>
          logger.error("Error triggering pusher", { error: error.message })
        );
    }
  });

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images"
  });

  logger.info("DB connected for GridFS bucket");

  return {
    bucket,
    filesCollection: mongoose.connection.db.collection("images.files")
  };
}
