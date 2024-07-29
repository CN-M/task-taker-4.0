"use client";

import { logout } from "@/actions/authActions";
import { useFormStatus } from "react-dom";

export const LogoutButton = async () => {
  const { pending } = useFormStatus();

  return (
    <form action={logout}>
      <button
        className="bg-emerald-500 rounded-lg px-5 py-2"
        disabled={pending}
      >
        {pending ? "Logging Out..." : "Logout"}
      </button>
    </form>
  );
};
