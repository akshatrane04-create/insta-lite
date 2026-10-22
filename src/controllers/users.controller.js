import * as usersService from "../services/users.service.js";

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
    const { username, email, fullname, bio } = req.body ?? {};
    if (!username || !email || !fullname) {
      return res.status(400).json({ error: "username, email and fullname are required" });
    }
    const user = await usersService.createUser({ username, email, fullname, bio });
    return res.status(201).json(user);
  } catch (error) {
    if (error?.code === "P2002" || error?.cause?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const page = parsePositiveInt(req.query.page, 1, Number.MAX_SAFE_INTEGER);
    const limit = parsePositiveInt(req.query.limit, 10, 100);
    if (!page || !limit) return res.status(400).json({ error: "page and limit must be positive integers" });

    const { search, sortBy = "id", order = "asc" } = req.query;
    if (!["asc", "desc"].includes(String(order))) {
      return res.status(400).json({ error: "order must be 'asc' or 'desc'" });
    }

    let isPrivate;
    if (req.query.isPrivate !== undefined) {
      if (!["true", "false"].includes(String(req.query.isPrivate))) {
        return res.status(400).json({ error: "isPrivate must be true or false" });
      }
      isPrivate = String(req.query.isPrivate) === "true";
    }

    const filters = {
      search: typeof search === "string" && search.trim() ? search.trim() : undefined,
      isPrivate,
      sortBy: String(sortBy),
      order: String(order),
      page,
      limit
    };
    const [users, total] = await Promise.all([
      usersService.listUsers(filters),
      usersService.countUsers(filters)
    ]);

    res.status(200).json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: "User not found" });
    const user = await usersService.getUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: "User not found" });

    const data = {};
    for (const key of ["fullname", "bio", "isPrivate"]) {
      if (Object.hasOwn(req.body ?? {}, key)) data[key] = req.body[key];
    }

    const user = await usersService.updateUser(id, data);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: "User not found" });
    const deleted = await usersService.deleteUser(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
