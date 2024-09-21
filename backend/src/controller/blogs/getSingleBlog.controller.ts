import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const getSingleBlog = async (c: Context) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blogPost) {
      c.status(403);
      return c.json({ success: false, error: "Blog not found" });
    }
    return c.json({
      success: true,
      blog: blogPost,
    });
  } catch (error) {
    c.status(403);
    return c.json({ error, success: false, message: "Blog not found" });
  }
};
