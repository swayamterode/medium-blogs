import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.split(" ")[1];
  try {
    if (!token) {
      c.status(403);
      return c.json({
        success: false,
        message: "Unauthorized Token not provided!",
      });
    }

    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(403);
      return c.json({
        success: false,
        message: "You are not logged in!",
      });
    }
    c.set("userId", Number(payload.id));
    return await next();
  } catch (error) {
    c.status(403);
    return c.json({
      success: false,
      message: "You are not logged in!",
    });
  }
});
