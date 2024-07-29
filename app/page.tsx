import { AddTaskForm } from "@/components/addTaskForm";
import { Task } from "@/components/task";
import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { getTasks } from "../data-access/data";

export default async function Home() {
  const { user } = await validateRequest();

  const tasks = await getTasks();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center w-1/2">
      {user && (
        <>
          <h2 className="text-xl p-5 font-semibold">
            Hey, {user.firstName}! Here are your tasks:
          </h2>
          <p className="pb-5">
            Hint: Double click on a task to mark it complete.
          </p>

          <div className="flex flex-col justify-center items-center space-y-3">
            {Array.isArray(tasks) && tasks?.length < 1 ? (
              <h3>You have no tasks to display</h3>
            ) : (
              Array.isArray(tasks) &&
              tasks?.map((task) => <Task key={task.id} task={task} />)
            )}
          </div>
          <AddTaskForm />
        </>
      )}
    </div>
  );
}
