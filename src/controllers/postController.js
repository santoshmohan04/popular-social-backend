import * as postService from "../services/postService.js";
import { successResponse } from "../utils/responses.js";

function serializePost(post) {
  return {
    ...post,
    timestamp: post.timestamp ? new Date(post.timestamp).toISOString() : null,
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : null
  };
}

export async function uploadPost(req, res) {
  const createdPost = await postService.createPost(req.body);
  res.status(201).json(successResponse(serializePost(createdPost.toObject())));
}

export async function getPosts(req, res) {
  const posts = await postService.listPosts();
  res.status(200).json(successResponse(posts.map((post) => serializePost(post.toObject()))));
}
