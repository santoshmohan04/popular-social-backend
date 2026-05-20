import mongoose from "mongoose";
import Grid from "gridfs-stream";
import { logger } from "./logger.js";

Grid.mongo = mongoose.mongo;

export async function initializeDatabase({ connectionUrl, pusherClient }) {
  await mongoose.connect(connectionUrl);
  logger.info("DB connected for pusher");

  const changeStream = mongoose.connection.collection("posts").watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusherClient
        .trigger("posts", "inserted", { change })
        .catch((error) => logger.error("Error triggering pusher", { error: error.message }));
    }
  });

  const imageConnection = mongoose.createConnection(connectionUrl);
  await new Promise((resolve, reject) => {
    imageConnection.once("open", resolve);
    imageConnection.once("error", reject);
  });

  logger.info("DB connected for GridFS");

  const gfs = Grid(imageConnection.db, mongoose.mongo);
  gfs.collection("images");

  return { gfs };
}
