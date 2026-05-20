import Posts from "../models/postModel.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function normalizePostPayload(payload) {
  const normalizedPayload = { ...payload };

  if (
    normalizedPayload.timestamp &&
    Number.isNaN(Date.parse(normalizedPayload.timestamp))
  ) {
    delete normalizedPayload.timestamp;
  }

  return normalizedPayload;
}

export async function createPost(payload) {
  const createdPost = await Posts.create(normalizePostPayload(payload));
  return createdPost;
}

export async function listPosts({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  sort = "desc"
} = {}) {
  const normalizedPage = Math.max(1, Number(page) || DEFAULT_PAGE);
  const normalizedLimit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(limit) || DEFAULT_LIMIT)
  );
  const sortDirection = sort === "asc" ? 1 : -1;
  const skip = (normalizedPage - 1) * normalizedLimit;

  const [posts, total] = await Promise.all([
    Posts.find({})
      .sort({ timestamp: sortDirection, createdAt: sortDirection })
      .skip(skip)
      .limit(normalizedLimit)
      .exec(),
    Posts.countDocuments({})
  ]);

  return {
    posts,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      totalPages: Math.ceil(total / normalizedLimit)
    }
  };
}
