import prisma from "../db.js";

export function createUser(data) {
  const createData = {
    username: data.username,
    email: data.email,
    fullname: data.fullname
  };
  if (data.bio !== undefined) createData.bio = data.bio;
  return prisma.user.create({ data: createData });
}

export function listUsers({ search, isPrivate, sortBy, order, page, limit }) {
  const where = {};
  if (search) {
    where.OR = [
      { username: { contains: search } },
      { fullname: { contains: search } },
      { email: { contains: search } }
    ];
  }
  if (isPrivate !== undefined) where.isPrivate = isPrivate;

  const allowedSortFields = ["id", "username", "fullname", "createdAt", "updatedAt"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "id";
  const safeOrder = order === "desc" ? "desc" : "asc";

  return prisma.user.findMany({
    where,
    orderBy: { [safeSortBy]: safeOrder },
    skip: (page - 1) * limit,
    take: limit
  });
}

export function countUsers({ search, isPrivate }) {
  const where = {};
  if (search) {
    where.OR = [
      { username: { contains: search } },
      { fullname: { contains: search } },
      { email: { contains: search } }
    ];
  }
  if (isPrivate !== undefined) where.isPrivate = isPrivate;
  return prisma.user.count({ where });
}

export function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUser(id, data) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.user.delete({ where: { id } });
  return true;
}
