import mongoose from "mongoose";

const postsModel = new mongoose.Schema(
  {
    user: String,
    imgName: String,
    text: String,
    avatar: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("posts", postsModel);
