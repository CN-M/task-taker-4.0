"use server";

import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateRequest } from "@/lib/validate-request";
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
    .max(64, { message: "Email must be at most 64 characters long" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(255, { message: "Password must be at most 255 characters long" }),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(64, { message: "First name must be at most 64 characters long" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(64, { message: "Last name must be at most 64 characters long" }),
});

const loginSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(64, { message: "Email must be at most 64 characters long" })
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

export const loginAsGuest = async (
  prevState: {
    message?: string;
    error?: {
      path: string;
      message: string;
    }[];
  },
  formData: FormData
) => {
  const guestAccounts = [
    {
      firstName: "Batman",
      email: "bruce.wayne@wayneenterprises.com",
      password: "SUPERMAN-SUCKZ",
    },
    {
      firstName: "Superman",
      email: "clark.kent@dailyplanet.com",
      password: "LoisLane123",
    },
    {
      firstName: "Wonderwoman",
      email: "diana.prince@themyscira.gov",
      password: "SUPERMAN-SUCKZ",
    },
  ];

  const randomGuest = Math.floor(Math.random() * guestAccounts.length);

  const { email, password } = guestAccounts[randomGuest];

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

    console.log(`Logged in as ${guestAccounts[randomGuest].firstName}`);
    return redirect("/");
  }
};
export const logout = async () => {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
};
