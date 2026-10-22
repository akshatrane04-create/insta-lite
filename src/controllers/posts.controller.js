import * as postsService from "../services/posts.service.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parsePositiveInt = (value, fallback, max = 100) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return Math.min(parsed, max);
};

export async function create(req, res, next) {
  try {
    const { imageUrl, caption, location } = req.body ?? {};
    if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });
    const post = await postsService.createPost({ imageUrl, caption, location });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const page = parsePositiveInt(req.query.page, 1, Number.MAX_SAFE_INTEGER);
    const limit = parsePositiveInt(req.query.limit, 10, 100);
    if (!page || !limit) return res.status(400).json({ error: "page and limit must be positive integers" });

    const { search, location, sortBy = "createdAt", order = "desc" } = req.query;
    if (!["asc", "desc"].includes(String(order))) {
      return res.status(400).json({ error: "order must be 'asc' or 'desc'" });
    }

    const filters = {
      search: typeof search === "string" && search.trim() ? search.trim() : undefined,
      location: typeof location === "string" && location.trim() ? location.trim() : undefined,
      sortBy: String(sortBy),
      order: String(order),
      page,
      limit
    };
    const [posts, total] = await Promise.all([
      postsService.listPosts(filters),
      postsService.countPosts(filters)
    ]);

    res.status(200).json({
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: "Post not found" });
    const post = await postsService.getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: "Post not found" });

    const data = {};
    for (const key of ["caption", "location"]) {
      if (Object.hasOwn(req.body ?? {}, key)) data[key] = req.body[key];
    }

    const post = await postsService.updatePost(id, data);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: "Post not found" });
    const deleted = await postsService.deletePost(id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
