import prisma from "../db.js";

export function createPost(data) {
  const createData = { imageUrl: data.imageUrl };
  if (data.caption !== undefined) createData.caption = data.caption;
  if (data.location !== undefined) createData.location = data.location;
  return prisma.post.create({ data: createData });
}

export function listPosts() {
  return prisma.post.findMany({ orderBy: { id: "asc" } });
}

export function getPostById(id) {
  return prisma.post.findUnique({ where: { id } });
}

export async function updatePost(id, data) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.post.update({ where: { id }, data });
}

export async function deletePost(id) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.post.delete({ where: { id } });
  return true;
}
