import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Context, Hono } from "hono";
import { signupInput } from "@swayamterode/medium-blog-common";

new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

export const signupController = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const response = signupInput.safeParse(body);
  if (!response.success) {
    c.status(403);
    return c.json({
      success: false,
      error: response.error.issues[0].message,
    });
  }

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      c.status(409); // Conflict
      return c.json({
        success: false,
        message: "Email already in use",
      });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      success: true,
      jwtToken: jwt,
      message: "User created successfully",
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    c.status(403);
    return c.json({ success: false, error });
  }
};
