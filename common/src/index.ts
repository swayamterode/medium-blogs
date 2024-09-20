import { z } from "zod";

/**
 * Defines the schema for the signup input using Zod.
 *
 * The schema includes the following fields:
 * - `email`: A string that must be a valid email address.
 * - `password`: A string that must be at least 6 characters long.
 * - `name`: An optional string.
 *
 * @constant
 * @type {ZodObject}
 */
export const signupInput = z.object({
  email: z.string().regex(/^[a-z0-9._%+-]+@(gmail\.com|yahoo\.com)$/, {
    message:
      "Email must be lowercase and must be either @gmail.com or @yahoo.com",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  name: z.string().optional(),
});
export type SignupInput = z.infer<typeof signupInput>;

/**
 * Schema for sign-in input validation using Zod.
 *
 * This schema validates the following fields:
 * - `email`: Must be a valid email address.
 * - `password`: Must be a string with a minimum length of 6 characters.
 *
 * @example
 * const validInput = {
 *   email: "example@example.com",
 *   password: "securePassword"
 * };
 *
 * const result = signinInput.safeParse(validInput);
 * if (result.success) {
 *   // Input is valid
 * } else {
 *   // Input is invalid
 *   console.error(result.error.errors);
 * }
 */
export const signinInput = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type SigninInput = z.infer<typeof signinInput>;

/**
 * Schema for creating a blog input using Zod.
 *
 * This schema validates the structure of the input object
 * required to create a blog. It ensures that the input object
 * contains a `title` and `content`, both of which are strings.
 *
 */
export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreateBlogInput = z.infer<typeof createBlogInput>;

/**
 * Schema for updating a blog input.
 *
 * This schema validates the structure of the input object required
 * to update a blog. It ensures that the input object contains the
 * following properties:
 *
 * - `id`: A number representing the unique identifier of the blog.
 * - `title`: A string representing the title of the blog.
 * - `content`: A string representing the content of the blog.
 */
export const updateBlogInput = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
});

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
