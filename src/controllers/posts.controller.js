import * as postsService from "../services/posts.service.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export async function create(req, res, next) {
  try {
    const { imageUrl, caption, location } = req.body ?? {};
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }
    const post = await postsService.createPost({ imageUrl, caption, location });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    res.status(200).json(await postsService.listPosts());
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

    // imageUrl and all other fields are deliberately ignored during PATCH.
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
