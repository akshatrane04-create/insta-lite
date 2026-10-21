# InstaLite Lab 13 — MVC + Prisma 7

This project follows the attached Lab 13 requirements: Express routes, a shared Prisma client, and MVC layers (`routes` → `controllers` → `services`).

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
└── schema.prisma
prisma7.config.js
```

## Setup

Requires Node.js 20.19+ (or a version supported by Prisma 7) and npm.

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Server prints `Server started on port 3000`.
Test `GET http://localhost:3000/health` and expect `200` with `{"status":"OK"}`.

This starter uses SQLite with Prisma 7's Better SQLite3 driver adapter. If your previous lab used a different database, retain its provider and adapter configuration instead of replacing them blindly.

## Routes

### Users
- `POST /users` — requires `username`, `email`, `fullname`; accepts optional `bio`. Extra fields ignored.
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id` — only `fullname`, `bio`, `isPrivate` are editable.
- `DELETE /users/:id` — returns `204` with an empty body.

### Posts
- `POST /posts` — requires `imageUrl`; `caption` and `location` are optional. Extra fields ignored.
- `GET /posts`
- `GET /posts/:id`
- `PATCH /posts/:id` — only `caption` and `location` are editable.
- `DELETE /posts/:id` — returns `204` with an empty body.

## Example tests

```bash
curl -i http://localhost:3000/health
curl -i -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"username":"riya_travels","email":"riya@example.com","fullname":"Riya Sharma"}'
curl -i http://localhost:3000/users
curl -i -X POST http://localhost:3000/posts -H "Content-Type: application/json" -d '{"imageUrl":"https://example.com/pic.jpg","caption":"First post","location":"Pune"}'
curl -i http://localhost:3000/posts
```

## GitHub submission

```bash
git init
git add .
git commit -m "Set up Express server and Prisma client"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Do not commit `.env`, `node_modules`, or your local database file.
