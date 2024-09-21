import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
export const getBulkBlogs = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
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
    return c.json({ success: true, Posts: posts });
  } catch (error) {
    c.status(403);
    return c.json({ error, success: false, message: "Blog not found" });
  }
};
