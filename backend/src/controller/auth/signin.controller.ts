import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Context } from "hono";
import { signinInput } from "@swayamterode/medium-blog-common";

// Controller function for handling user sign-in
export const signinController = async (c: Context) => {
  // Initialize Prisma client with Accelerate extension and datasource URL from environment variables
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Parse the request body to get email and password
  const body = await c.req.json(); // { email: string, password: string }

  // Validate the request body against the signinInput schema
  const response = signinInput.safeParse(body);
  if (!response.success) {
    // If validation fails, return a 403 status with the validation error message
    c.status(403);
    return c.json({
      success: false,
      error: response.error.issues[0].message,
    });
  }

  try {
    // Find the user in the database by email
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    // If user does not exist, return a 403 status with an error message
    if (!user) {
      c.status(403);
      return c.json({ error: "User does not exist", success: false });
    }

    // If the password does not match, return a 403 status with an error message
    if (user.password !== body.password) {
      c.status(403);
      return c.json({ error: "Wrong password", success: false });
    }

    // Generate a JWT token for the user
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    // Return a 200 status with the JWT token and success message
    c.status(200);
    return c.json({
      success: true,
      jwtToken: jwt,
      message: "User signed in successfully",
    });
  } catch (error) {
    // If an error occurs, return a 403 status with the error message
    c.status(403);
    return c.json({ error, message: "An error occurred", success: false });
  }
};
