import prisma from "../db.js";

export function createUser(data) {
  // Whitelist fields so clients cannot set id/timestamps/isPrivate.
  const createData = {
    username: data.username,
    email: data.email,
    fullname: data.fullname
  };
  if (data.bio !== undefined) createData.bio = data.bio;
  return prisma.user.create({ data: createData });
}

export function listUsers() {
  return prisma.user.findMany({ orderBy: { id: "asc" } });
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
