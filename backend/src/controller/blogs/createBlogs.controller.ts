import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput } from "@swayamterode/medium-blog-common";
import { Context } from "hono";

export const createBlog = async (c: Context) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(403);
    return c.json({ success: false, error: "Invalid input" });
  }
  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(userId),
      },
    });

    if (!blog) {
      c.status(403);
      return c.json({ success: false, error: "Blog not created" });
    }
    return c.json({
      success: true,
      blogId: blog.id,
      message: "Blog created successfully",
    });
  } catch (error) {
    c.status(403);
    return c.json({ error, success: false, message: "Blog not created" });
  }
};
