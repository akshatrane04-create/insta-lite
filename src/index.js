import "dotenv/config";
import express from "express";
import prisma from "./db.js";
import usersRouter from "./routes/users.routes.js";
import postsRouter from "./routes/posts.routes.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error?.code === "P2002" || error?.cause?.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({ error: "username or email already taken" });
  }
  if (error?.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }
  res.status(500).json({ error: "Internal server error" });
});

const port = 3000;
const server = app.listen(port, () => {
  console.log("Server started on port 3000");
});

// Keep the imported client available for the app lifetime and close it cleanly.
async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
