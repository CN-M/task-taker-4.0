"use client";

import { deleteTask, updateTask } from "@/actions/taskActions";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useFormState } from "react-dom";

type TaskType = {
  id: string;
  content: string;
  completed: boolean;
  authorId: string;
};

type Message = {
  message: string;
};

export const Task = ({
  task: { id, content, completed },
}: {
  task: TaskType;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, action] = useFormState(updateTask, {
    taskId: id,
  });

  return (
    <div className="flex items-center justify-center w-full border rounded-md p-3 border-emerald-300">
      <form
        ref={formRef}
        action={action}
        onDoubleClick={(e) => {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }}
        className="w-full"
      >
        <div className="flex justify-around items-center py-2 px-10 gap-3 hover:cursor-pointer">
          <p className={cn("text-2xl", completed ? "line-through" : "")}>
            {content}
          </p>
        </div>
      </form>
      <DeleteBtn id={id} />
    </div>
  );
};

export const DeleteBtn = ({ id }: { id: string }) => {
  const [state, action] = useFormState(deleteTask, {
    taskId: id,
  });
  return (
    <form action={action}>
      <button className="rounded-md px-4 py-3 bg-red-500 text-sm text-white tracking-widest border-none hover:bg-red-400">
        Delete
      </button>
    </form>
  );
};
