import prisma from "../db.js";

export function createPost(data) {
  const createData = { imageUrl: data.imageUrl };
  if (data.caption !== undefined) createData.caption = data.caption;
  if (data.location !== undefined) createData.location = data.location;
  return prisma.post.create({ data: createData });
}

export function listPosts({ search, location, sortBy, order, page, limit }) {
  const where = {};
  if (search) {
    where.OR = [
      { caption: { contains: search } },
      { location: { contains: search } }
    ];
  }
  if (location) where.location = { contains: location };

  const allowedSortFields = ["id", "createdAt", "updatedAt", "caption", "location"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const safeOrder = order === "asc" ? "asc" : "desc";

  return prisma.post.findMany({
    where,
    orderBy: { [safeSortBy]: safeOrder },
    skip: (page - 1) * limit,
    take: limit
  });
}

export function countPosts({ search, location }) {
  const where = {};
  if (search) {
    where.OR = [
      { caption: { contains: search } },
      { location: { contains: search } }
    ];
  }
  if (location) where.location = { contains: location };
  return prisma.post.count({ where });
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
