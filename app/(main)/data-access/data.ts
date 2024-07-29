import { prisma } from "@/lib/db";
import { validateRequest } from "@/lib/validate-request";

export const getTasks = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return {
      error: [
        {
          path: "password",
          message: "Incorrect username or password",
        },
      ],
    };
  }

  const { id } = user;

  const tasks = await prisma.task.findMany({
    where: {
      authorId: id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return tasks;
};
