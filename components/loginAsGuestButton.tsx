"use client";

import { loginAsGuest } from "@/actions/authActions";
import { useFormState, useFormStatus } from "react-dom";

export const LoginAsGuestButton = async () => {
  const [{ message, error }, action] = useFormState(loginAsGuest, {
    error: [],
    message: "",
  });

  const { pending } = useFormStatus();
  return (
    <>
      <form className="bg-blue-500 rounded-lg px-5 py-2" action={action}>
        <button className="" disabled={pending}>
          {pending ? "Logging In..." : "Login as Guest"}
        </button>
      </form>
      {message === "Error" && (
        <>
          {error
            .filter((err) => err.path === "main")
            .map((err) => (
              <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
            ))}
        </>
      )}
    </>
  );
};
