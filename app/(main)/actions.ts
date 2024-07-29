"use server";

import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateRequest } from "@/lib/validate-request";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function logout() {
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
}

const taskSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Task must be at least 3 characters long" })
    .max(255, { message: "Task must be at most 255 characters long" }),
});

export const addTask = async (
  prevState: {
    message?: string;
    error?: {
      path: string;
      message: string;
    }[];
  },
  formData: FormData
) => {
  const content = formData.get("content");

  const result = taskSchema.safeParse({ content });

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
    const { content } = result.data;

    const { user } = await validateRequest();

    if (!user) {
      return {
        error: [
          {
            path: "main",
            message: "Not Authorized",
          },
        ],
      };
    }

    const { id } = user;

    await prisma.task.create({
      data: {
        content,
        author: { connect: { id } },
      },
    });

    revalidatePath("/");

    return {
      error: [],
      message: "Success",
    };
  }
};

export const updateTask = async (
  prevState: {
    taskId?: string;
  },
  formData: FormData
) => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      error: [
        {
          path: "main",
          message: "Not Authorized",
        },
      ],
    };
  }

  const { taskId } = prevState;

  const existingPost = await prisma.task.findFirst({
    where: { id: taskId, author: user },
  });

  if (!existingPost) {
    return {
      error: [
        {
          path: "main",
          message: "Post does not exist",
        },
      ],
      message: "Error",
    };
  }

  const { id, completed } = existingPost;

  await prisma.task.update({
    where: { id },
    data: {
      completed: !completed,
    },
  });

  revalidatePath("/");

  return {
    taskId,
  };
};

export const deleteTask = async (
  prevState: {
    taskId?: string;
  },
  formData: FormData
) => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      error: [
        {
          path: "main",
          message: "Not Authorized",
        },
      ],
    };
  }

  const { taskId } = prevState;

  const existingPost = await prisma.task.findFirst({
    where: { id: taskId, author: user },
  });

  if (!existingPost) {
    return {
      error: [
        {
          path: "main",
          message: "Post does not exist",
        },
      ],
      message: "Error",
    };
  }

  const { id } = existingPost;

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/");

  return {
    taskId,
  };
};
