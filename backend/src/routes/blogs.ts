import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware";
import { createBlog } from "../controller/blogs/createBlogs.controller";
import { updateBlog } from "../controller/blogs/updateBlogs.controller";
import { getBulkBlogs } from "../controller/blogs/getBulkBlogs.controller";
import { getSingleBlog } from "../controller/blogs/getSingleBlog.controller";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: Number;
  };
}>();

blogRouter.use("/*", authMiddleware);
blogRouter.post("/create", createBlog);
blogRouter.put("/", updateBlog);
blogRouter.get("/bulk", getBulkBlogs);
blogRouter.get("/single-blog/:id", getSingleBlog);
