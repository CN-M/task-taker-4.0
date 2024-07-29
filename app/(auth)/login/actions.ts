"use server";

import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { z } from "zod";
import { redirect } from "next/navigation";

const argon2id = new Argon2id();

const loginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(31, { message: "Email must be at most 31 characters long" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password must be at most 255 characters long" }),
});

export const login = async (
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

  const result = loginSchema.safeParse({ email, password });

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
    const { email, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return {
        error: [
          {
            path: "main",
            message: "Account does not exist",
          },
        ],
        message: "Error",
      };
    }

    const validPassword = await argon2id.verify(
      existingUser.password,
      password
    );

    if (!validPassword) {
      return {
        error: [
          {
            path: "password",
            message: "Incorrect username or password",
          },
        ],
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  }
};
