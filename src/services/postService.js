import Posts from "../models/postModel.js";

function normalizePostPayload(payload) {
  const normalizedPayload = { ...payload };

  if (normalizedPayload.timestamp && Number.isNaN(Date.parse(normalizedPayload.timestamp))) {
    delete normalizedPayload.timestamp;
  }

  return normalizedPayload;
}

export async function createPost(payload) {
  const createdPost = await Posts.create(normalizePostPayload(payload));
  return createdPost;
}

export async function listPosts() {
  return Posts.find({}).sort({ timestamp: -1, createdAt: -1 }).exec();
}
