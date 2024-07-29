"use client";

import { addTask } from "@/app/(main)/actions";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

export const AddTaskForm = () => {
  const [{ message, error }, action] = useFormState(addTask, {
    error: [],
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (message === "Success") {
      formRef.current?.reset();
    }
  }, [message]);

  return (
    <div className="flex flex-col p-10 space-y-5">
      <form ref={formRef} action={action} className="flex flex-col space-y-3">
        <input
          className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
          type="text"
          name="content"
          placeholder="Take out the trash"
          required
          min={1}
        />
        {message === "Error" && (
          <>
            {error
              .filter((err) => err.path === "content")
              .map((err) => (
                <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
              ))}
          </>
        )}
        <SubmitBtn />
        {message === "Error" && (
          <>
            {error
              .filter((err) => err.path === "main")
              .map((err) => (
                <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
              ))}
          </>
        )}
      </form>
    </div>
  );
};

export const SubmitBtn = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="p-3 rounded-md bg-emerald-600 text-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "Adding Task..." : "Add Task"}
    </button>
  );
};
