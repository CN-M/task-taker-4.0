"use client";

import { register } from "@/actions/authActions";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export const RegisterForm = () => {
  const [{ message, error }, action] = useFormState(register, {
    error: [],
    message: "",
  });

  return (
    <form action={action} className="flex flex-col space-y-3">
      <div className="flex items-center space-x-5">
        <div className="flex flex-col space-y-3">
          <label htmlFor="firstName">First Name</label>
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="text"
            name="firstName"
            placeholder="Hulk"
          />
          {message === "Error" && (
            <>
              {error
                .filter((err) => err.path === "firstName")
                .map((err) => (
                  <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
                ))}
            </>
          )}
        </div>
        <div className="flex flex-col space-y-3">
          <label htmlFor="lastName">Last Name</label>
          <input
            className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
            type="text"
            name="lastName"
            placeholder="Hogan"
          />
          {message === "Error" && (
            <>
              {error
                .filter((err) => err.path === "lastName")
                .map((err) => (
                  <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
                ))}
            </>
          )}
        </div>
      </div>
      <label htmlFor="email">Email Address</label>
      <input
        className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
        // type="email"
        name="email"
        id="email"
        placeholder="hulk@hogan.com"
        autoComplete="email"
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
      <label htmlFor="password">Password</label>
      <input
        className="border p-2 border-emerald-500 rounded-md focus:border-blue-500"
        type="password"
        name="password"
        id="password"
        placeholder="Br0th3r!"
        autoComplete="current-password"
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
      <RegisterBtn />
      {message === "Error" && (
        <>
          {error
            .filter((err) => err.path === "main")
            .map((err) => (
              <p className="text-red-500 text-sm">{`Error: ${err.message}`}</p>
            ))}
        </>
      )}
      <p className="text-md text-black/75">
        Already have an account?{" "}
        <Link className="text-blue-500 cursor-pointer" href={"/login"}>
          Login here
        </Link>
      </p>
    </form>
  );
};

export const RegisterBtn = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="p-3 rounded-md bg-emerald-600 text-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "Signing Up..." : "Sign Up"}
    </button>
  );
};
