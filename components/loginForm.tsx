"use client";

import { login } from "@/app/(auth)/actions";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export const LoginForm = () => {
  const [{ message, error }, action] = useFormState(login, {
    error: [],
    message: "",
  });

  return (
    <form action={action} className="flex flex-col space-y-3 w-full">
      <label htmlFor="email" className="text-sm sm:text-base">
        Email
      </label>
      <input
        className="border p-2 sm:p-3 border-emerald-500 rounded-md focus:border-blue-500 w-full"
        type="email"
        name="email"
        placeholder="hulk@hogan.com"
        required
      />
      {message === "Error" && (
        <>
          {error
            .filter((err) => err.path === "email")
            .map((err) => (
              <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
            ))}
        </>
      )}
      <label htmlFor="password" className="text-sm sm:text-base">
        Password
      </label>
      <input
        className="border p-2 sm:p-3 border-emerald-500 rounded-md focus:border-blue-500 w-full"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="password"
        required
      />
      {message === "Error" && (
        <>
          {error
            .filter((err) => err.path === "password")
            .map((err) => (
              <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
            ))}
        </>
      )}
      <LoginBtn />
      {message === "Error" && (
        <>
          {error
            .filter((err) => err.path === "main")
            .map((err) => (
              <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
            ))}
        </>
      )}
      <p className="text-sm">
        Don't have an account?{" "}
        <Link className="text-blue-500 cursor-pointer" href={"/register"}>
          Register here
        </Link>
      </p>
    </form>
  );
};

export const LoginBtn = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="p-2 sm:p-3 rounded-md bg-emerald-600 text-white w-full"
      type="submit"
      disabled={pending}
    >
      {pending ? "Logging In..." : "Log In"}
    </button>
  );
};
