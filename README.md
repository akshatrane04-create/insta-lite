# InstaLite Lab 13 — MVC, Prisma, seeding, filtering, sorting & pagination

Express + Prisma 7 backend following the lab's MVC organization.

## Structure
```text
src/
├── index.js
├── db.js
├── routes/
│   ├── users.routes.js
│   └── posts.routes.js
├── controllers/
│   ├── users.controller.js
│   └── posts.controller.js
└── services/
    ├── users.service.js
    └── posts.service.js
prisma/
├── schema.prisma
└── seed.js
prisma7.config.js
```

## Setup
Requires a Prisma 7-compatible Node.js version.

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Server prints `Server started on port 3000`. `GET /health` returns `{"status":"OK"}`.

## User endpoints
- `POST /users` — required `username`, `email`, `fullname`; optional `bio`; unknown fields ignored.
- `GET /users` — list users, optionally filter/sort/page.
- `GET /users/:id`
- `PATCH /users/:id` — editable `fullname`, `bio`, `isPrivate`.
- `DELETE /users/:id` — 204 empty response.

### User list query parameters
- `search`: case-insensitive/SQLite-supported substring search over username, fullname and email (SQLite `contains` is generally case-insensitive for ASCII).
- `isPrivate=true|false`
- `sortBy=id|username|fullname|createdAt|updatedAt`
- `order=asc|desc`
- `page=1` (default)
- `limit=10` (default, maximum 100)

Examples:
```bash
curl 'http://localhost:3000/users?page=1&limit=2'
curl 'http://localhost:3000/users?search=riya'
curl 'http://localhost:3000/users?isPrivate=true'
curl 'http://localhost:3000/users?sortBy=fullname&order=asc'
curl 'http://localhost:3000/users?search=a&sortBy=createdAt&order=desc&page=2&limit=5'
```

List responses include `data` and `pagination` metadata.

## Post endpoints
- `POST /posts` — required `imageUrl`; optional `caption`, `location`; unknown fields ignored.
- `GET /posts` — list posts, optionally filter/sort/page.
- `GET /posts/:id`
- `PATCH /posts/:id` — editable `caption`, `location`; `imageUrl` ignored.
- `DELETE /posts/:id` — 204 empty response.

### Post list query parameters
- `search`: substring match over caption or location.
- `location`: filter location by substring.
- `sortBy=id|createdAt|updatedAt|caption|location`
- `order=asc|desc` (defaults to `desc`)
- `page=1`, `limit=10` (maximum 100)

Examples:
```bash
curl 'http://localhost:3000/posts?page=1&limit=3'
curl 'http://localhost:3000/posts?search=coffee'
curl 'http://localhost:3000/posts?location=Pune'
curl 'http://localhost:3000/posts?sortBy=location&order=asc'
curl 'http://localhost:3000/posts?search=morning&sortBy=createdAt&order=desc&page=1&limit=5'
```

## Seeding
`npm run prisma:seed` inserts five sample users and twelve sample posts. Users are upserted by username, so rerunning updates them without duplicates. Sample posts are added only if the posts table is empty.

## GitHub
```bash
git add .
git commit -m "Add seed data and list filtering sorting pagination"
git push
```

Do not commit `.env`, `node_modules`, or the SQLite database file.
