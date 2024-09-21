import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { verify } from "hono/jwt";

export const deleteBlogPost = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authHeader = c.req.header("Authorization") || "";
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.status(403);
    return c.json({
      success: false,
      message: "Jwt Token not provided!",
    });
  }

  const token = authHeader.split("Bearer ")[1];
  let userId, email, name;
  try {
    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload) {
      c.status(403);
      return c.json({
        success: false,
        message: "JWT Validation failed!",
      });
    }
    userId = payload.id;
  } catch (error) {
    c.status(403);
    return c.json({
      success: false,
      message: "You are not logged in!",
    });
  }

  const id = c.req.param("id");

  try {
    const blogPost = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
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
      return c.json({
        success: false,
        error: "Blog not found",
      });
    }

    console.log(blogPost.author.id, userId);
    if (blogPost.author.id !== userId) {
      c.status(403);
      return c.json({
        success: false,
        error: "This blog is not written by you! (access denied)",
      });
    }

    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    return c.json({
      success: true,
      message: "Blog post deleted successfully",
      user: {
        id: userId,
        email: email,
        name: name,
      },
    });
  } catch (error) {
    c.status(403);
    return c.json({
      error,
      success: false,
      message: "Failed to delete blog post",
    });
  }
};
