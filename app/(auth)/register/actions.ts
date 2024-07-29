"use server";

import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
import { z } from "zod";

const argon2id = new Argon2id();

const registerSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(31, { message: "Email must be at most 31 characters long" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password must be at most 255 characters long" }),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters long" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters long" }),
});

export const register = async (
  prevState: {
    message?: string;
    error?: {
      path: string;
      message: string;
    }[];
  },
  formData: FormData
) => {
  const email = formData.get("email")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();

  const result = registerSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
  });

  if (!result.success) {
    console.log(result.error.errors);
    return {
      error: result.error.errors.map((error) => ({
        path: error.path.join("."),
        message: error.message,
      })),
      message: "Error",
    };
  } else {
    const { email, password, firstName, lastName } = result.data;

    const existingUser = await prisma.user.findFirst({ where: { email } });

    if (existingUser) {
      return {
        error: [
          {
            path: "main",
            message: "Email already registered",
          },
        ],
        message: "Error",
      };
    }

    const hashedPassword = await argon2id.hash(password);

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  }
};
