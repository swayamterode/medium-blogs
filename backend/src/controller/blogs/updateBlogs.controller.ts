import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { updateBlogInput } from "@swayamterode/medium-blog-common";
import { Context } from "hono";

export const updateBlog = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const response = updateBlogInput.safeParse(body);
    if (!response.success) {
      c.status(403);
      return c.json({
        success: false,
        error: response.error.issues[0].message,
      });
    }
    const blogUpdate = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    if (!blogUpdate) {
      c.status(403);
      return c.json({ success: false, error: "Blog not updated" });
    }
    return c.json({
      success: true,
      blogId: body.id,
      message: `Blog with id ${body.id} updated successfully`,
    });
  } catch (error) {
    c.status(403);
    return c.json({ error, success: false, message: "Blog not updated" });
  }
};
