import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Context } from "hono";
import { signinInput } from "@swayamterode/medium-blog-common";

export const signinController = async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json(); // { email: string, password: string }
  const response = signinInput.safeParse(body);
  if (!response.success) {
    c.status(403);
    return c.json({
      success: false,
      error: response.error.issues[0].message,
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({ error: "Invalid credentials" });
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      success: true,
      jwtToken: jwt,
      message: "user signed in successfully",
    });
  } catch (error) {
    c.status(403);
    return c.json({ error, message: "user not found", success: false });
  }
};
