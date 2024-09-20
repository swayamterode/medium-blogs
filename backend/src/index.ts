import { Hono } from "hono";
import { cors } from "hono/cors";
// App Initialization
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// CORS Config
app.use("/*", cors());

// Routes Import
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blogs";

// Routes
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

// Welcome Route
app.get("/", (c) => {
  return c.text("Medium Backend!");
});

export default app;
